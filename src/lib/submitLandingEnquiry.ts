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

const PHP_ENQUIRY_URLS = [
  process.env.LANDING_ENQUIRY_URL,
  process.env.NODE_ENV === "production" ? "http://127.0.0.1/scripts/ajax/index.php" : "",
  "https://www.mdrcindia.com/scripts/ajax/index.php",
].filter((url): url is string => Boolean(url));

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

export async function submitLandingEnquiry(
  fields: LandingEnquiryFields,
  ip = "",
) {
  const payload = new URLSearchParams();
  payload.set("method", "landing_page_enquiry");
  payload.set("name", fields.name.trim());
  payload.set("phone", fields.phone.trim());
  payload.set("email", fields.email.trim());
  payload.set("scan", fields.scan || "MRI");
  payload.set("message", fields.message.trim());
  payload.set("terms", fields.terms || "Yes");
  if (ip) payload.set("ip", ip);

  let lastError = "Could not submit. Please try again.";

  for (const url of PHP_ENQUIRY_URLS) {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json, text/plain, */*",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Origin: "https://www.mdrcindia.com",
          Referer: "https://www.mdrcindia.com/lp/imaging/mri-scan-in-gurgaon/",
          ...(ip ? { "X-Forwarded-For": ip, "X-Real-IP": ip } : {}),
        },
        body: payload.toString(),
        cache: "no-store",
        redirect: "follow",
        signal: AbortSignal.timeout(url.includes("127.0.0.1") ? 3000 : 15000),
      });

      const text = await response.text();
      const data = parseEnquiryJson(text);
      if (!data) {
        lastError = "Could not submit. Please try again.";
        continue;
      }

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
