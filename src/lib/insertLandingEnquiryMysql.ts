import mysql from "mysql2/promise";
import fs from "node:fs";
import type { LandingEnquiryFields } from "@/lib/submitLandingEnquiry";

const TABLE = "landingm_enquiry";

const PHP_DB_FILES = [
  process.env.MYSQL_CONFIG_PATH,
  "/home/mdrcindia.com/html/application/config/database.php",
  "/home/mdrcindia.com/html/scripts/config.php",
].filter((path): path is string => Boolean(path));

function readQuoted(content: string, keys: string[]) {
  for (const key of keys) {
    const match =
      content.match(new RegExp(`['"]${key}['"]\\s*=>\\s*['"]([^'"]*)['"]`)) ||
      content.match(new RegExp(`\\['${key}'\\]\\s*=\\s*['"]([^'"]*)['"]`)) ||
      content.match(new RegExp(`define\\(\\s*['"]${key}['"]\\s*,\\s*['"]([^'"]*)['"]`));
    if (match?.[1]) return match[1];
  }
  return "";
}

function phpMysqlConfig() {
  for (const file of PHP_DB_FILES) {
    try {
      const content = fs.readFileSync(file, "utf8");
      const user = readQuoted(content, ["username", "DB_USER", "db_user"]);
      const database = readQuoted(content, ["database", "DB_NAME", "db_name"]);
      if (!user || !database) continue;
      return {
        host: readQuoted(content, ["hostname", "DB_HOST", "db_host"]) || "127.0.0.1",
        port: Number(process.env.MYSQL_PORT || 3306),
        user,
        password: readQuoted(content, ["password", "DB_PASSWORD", "db_pass"]),
        database,
      };
    } catch {
      // File is not on this machine (local laptop).
    }
  }
  return null;
}

function mysqlConfig() {
  const user = process.env.MYSQL_USER;
  const database = process.env.MYSQL_DATABASE;
  if (user && database) {
    return {
      host: process.env.MYSQL_HOST || "127.0.0.1",
      port: Number(process.env.MYSQL_PORT || 3306),
      user,
      password: process.env.MYSQL_PASSWORD || "",
      database,
    };
  }
  return phpMysqlConfig();
}

export async function insertLandingEnquiryMysql(
  fields: LandingEnquiryFields,
  ip = "",
  page = "",
) {
  const config = mysqlConfig();
  if (!config) return null;

  const conn = await mysql.createConnection(config);
  try {
    const [result] = await conn.execute(
      `INSERT INTO \`${TABLE}\` (page, name, phone, email, scan, message, terms, ip)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        page,
        fields.name.trim(),
        fields.phone.trim(),
        fields.email.trim(),
        fields.scan || "",
        fields.message.trim(),
        fields.terms || "Yes",
        ip,
      ],
    );
    const id = Number((result as mysql.ResultSetHeader).insertId);
    if (!id) return null;
    return { RESULT: "OK" as const, id };
  } finally {
    await conn.end();
  }
}
