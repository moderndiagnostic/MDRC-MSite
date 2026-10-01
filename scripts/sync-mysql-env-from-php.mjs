import fs from "node:fs";
import path from "node:path";

const ROOTS = ["/home/mdrcindia.com/html", "/home/mdrcindia.com"];
const FILE_NAMES = new Set([
  "database.php",
  "db.php",
  "config.php",
  "connection.php",
  "connect.php",
  "constants.php",
]);

function walk(dir, files, depth = 0) {
  if (depth > 5 || files.length > 80) return;
  let entries = [];
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === ".git" || entry.name === "vendor") continue;
      walk(full, files, depth + 1);
    } else if (FILE_NAMES.has(entry.name.toLowerCase())) {
      files.push(full);
    }
  }
}

function readQuoted(content, keys) {
  for (const key of keys) {
    const match =
      content.match(new RegExp(`['"]${key}['"]\\s*=>\\s*['"]([^'"]*)['"]`)) ||
      content.match(new RegExp(`\\['${key}'\\]\\s*=\\s*['"]([^'"]*)['"]`)) ||
      content.match(new RegExp(`\\$${key}\\s*=\\s*['"]([^'"]*)['"]`)) ||
      content.match(new RegExp(`define\\(\\s*['"]${key}['"]\\s*,\\s*['"]([^'"]*)['"]`));
    if (match?.[1]) return match[1];
  }
  return "";
}

function parsePhp(content) {
  const user = readQuoted(content, ["username", "DB_USER", "db_user", "dbuser"]);
  const database = readQuoted(content, ["database", "DB_NAME", "db_name", "dbname"]);
  if (!user || !database) return null;
  return {
    host: readQuoted(content, ["hostname", "DB_HOST", "db_host", "dbhost"]) || "127.0.0.1",
    user,
    password: readQuoted(content, ["password", "DB_PASSWORD", "db_pass", "dbpass"]),
    database,
  };
}

function upsertEnv(file, values) {
  let text = "";
  try {
    text = fs.readFileSync(file, "utf8");
  } catch {
    text = "";
  }
  const lines = text.split(/\r?\n/).filter((line) => line.length > 0);
  const keys = Object.keys(values);
  const kept = lines.filter((line) => !keys.some((key) => line.startsWith(`${key}=`)));
  for (const key of keys) kept.push(`${key}=${values[key]}`);
  fs.writeFileSync(file, `${kept.join("\n")}\n`, "utf8");
}

const files = [
  "/home/mdrcindia.com/html/application/config/database.php",
  "/home/mdrcindia.com/html/config/database.php",
  "/home/mdrcindia.com/html/webApi/config.php",
];
for (const root of ROOTS) walk(root, files);

let found = null;
for (const file of files) {
  try {
    found = parsePhp(fs.readFileSync(file, "utf8"));
    if (found) break;
  } catch {
    // Skip unreadable files.
  }
}

if (!found) {
  console.log("MySQL settings were not found in PHP config.");
  process.exit(0);
}

const envFile = path.join(process.cwd(), ".env");
upsertEnv(envFile, {
  MYSQL_HOST: found.host || "127.0.0.1",
  MYSQL_PORT: "3306",
  MYSQL_USER: found.user,
  MYSQL_PASSWORD: found.password,
  MYSQL_DATABASE: found.database,
});
console.log(`Wrote MySQL settings to ${envFile} for database ${found.database}.`);
