import http from "node:http";

export type LandingEnquiryFields = {
  name: string;
  phone: string;
  email: string;
  scan: string;
  message: string;
  terms?: string;
};

type EnquiryJson = {
  RESULT?: string;
  result?: string;
  id?: number;
  error_msg?: string;
  message?: string;
};

const CHROME_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

export function parseEnquiryJson(text: string): EnquiryJson | null {
  try {
    return JSON.parse(text) as EnquiryJson;
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return null;
    try {
      return JSON.parse(match[0]) as EnquiryJson;
    } catch {
      return null;
    }
  }
}

export function isEnquirySuccess(data: EnquiryJson | null) {
  const result = String(data?.RESULT ?? data?.result ?? "").toUpperCase();
  return result === "OK" || Boolean(data?.id);
}

function enquiryBody(fields: LandingEnquiryFields, ip = "") {
  const payload = new URLSearchParams();
  payload.set("method", "landing_page_enquiry");
  payload.set("name", fields.name.trim());
  payload.set("phone", fields.phone.trim());
  payload.set("email", fields.email.trim());
  payload.set("scan", fields.scan || "MRI");
  payload.set("message", fields.message.trim());
  payload.set("terms", fields.terms || "Yes");
  if (ip) payload.set("ip", ip);
  return payload.toString();
}

function postPhpHttp(
  body: string,
  ip: string,
  options: { host: string; port: number; hostHeader: string },
) {
  return new Promise<string>((resolve, reject) => {
    const req = http.request(
      {
        host: options.host,
        port: options.port,
        path: "/scripts/ajax/index.php",
        method: "POST",
        headers: {
          Host: options.hostHeader,
          "User-Agent": CHROME_UA,
          "Content-Type": "application/x-www-form-urlencoded",
          "Content-Length": Buffer.byteLength(body),
          Origin: "https://www.mdrcindia.com",
          Referer: "https://www.mdrcindia.com/",
          Accept: "application/json, text/plain, */*",
          ...(ip ? { "X-Forwarded-For": ip, "X-Real-IP": ip } : {}),
        },
        timeout: 4000,
      },
      (res) => {
        const chunks: Buffer[] = [];
        res.on("data", (chunk) => chunks.push(chunk as Buffer));
        res.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
      },
    );
    req.on("error", reject);
    req.on("timeout", () => {
      req.destroy();
      reject(new Error("timeout"));
    });
    req.write(body);
    req.end();
  });
}

export async function submitLandingEnquiry(fields: LandingEnquiryFields, ip = "") {
  const body = enquiryBody(fields, ip);
  let lastError = "Could not submit. Please try again.";

  const localAttempts = [
    { host: "127.0.0.1", port: 80, hostHeader: "127.0.0.1" },
    { host: "127.0.0.1", port: 80, hostHeader: "www.mdrcindia.com" },
    { host: "127.0.0.1", port: 80, hostHeader: "localhost" },
  ];

  for (const attempt of localAttempts) {
    try {
      const localText = await postPhpHttp(body, ip, attempt);
      const localData = parseEnquiryJson(localText);
      if (isEnquirySuccess(localData)) {
        return { RESULT: "OK" as const, ...localData };
      }
      if (localData?.error_msg || localData?.message) {
        lastError = localData.error_msg || localData.message || lastError;
      }
    } catch {
      // Try the next local PHP vhost.
    }
  }

  const remoteUrls = [
    process.env.LANDING_ENQUIRY_URL,
    "http://127.0.0.1/scripts/ajax/index.php",
    "https://www.mdrcindia.com/scripts/ajax/index.php",
  ].filter((url): url is string => Boolean(url));

  for (const url of remoteUrls) {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json, text/plain, */*",
          "User-Agent": CHROME_UA,
          Origin: "https://www.mdrcindia.com",
          Referer: "https://www.mdrcindia.com/lp/imaging/mri-scan-in-gurgaon/",
          ...(ip ? { "X-Forwarded-For": ip, "X-Real-IP": ip } : {}),
        },
        body,
        cache: "no-store",
        redirect: "follow",
        signal: AbortSignal.timeout(4000),
      });
      const text = await response.text();
      const data = parseEnquiryJson(text);
      if (!data) continue;
      if (isEnquirySuccess(data)) {
        return { RESULT: "OK" as const, ...data };
      }
      lastError = data.error_msg || data.message || lastError;
    } catch {
      lastError = "Could not submit. Please try again.";
    }
  }

  return { RESULT: "FAIL" as const, error_msg: lastError };
}
