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
  "http://127.0.0.1/scripts/ajax/index.php",
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
          ...(ip ? { "X-Forwarded-For": ip, "X-Real-IP": ip } : {}),
        },
        body: payload.toString(),
        cache: "no-store",
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

      return {
        RESULT: "FAIL" as const,
        error_msg: data.error_msg || data.message || lastError,
      };
    } catch {
      lastError = "Could not submit. Please try again.";
    }
  }

  return { RESULT: "FAIL" as const, error_msg: lastError };
}
