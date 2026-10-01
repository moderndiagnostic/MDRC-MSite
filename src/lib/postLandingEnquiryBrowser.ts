export const LANDING_ENQUIRY_PHP = "https://www.mdrcindia.com/scripts/ajax/index.php";

export type BrowserLandingEnquiry = {
  name: string;
  phone: string;
  email: string;
  scan: string;
  message: string;
  terms?: string;
};

function enquiryPayload(fields: BrowserLandingEnquiry) {
  const payload = new URLSearchParams();
  payload.set("method", "landing_page_enquiry");
  payload.set("name", fields.name);
  payload.set("phone", fields.phone);
  payload.set("email", fields.email);
  payload.set("scan", fields.scan);
  payload.set("message", fields.message);
  payload.set("terms", fields.terms || "Yes");
  return payload;
}

function isOk(text: string) {
  try {
    const data = JSON.parse(text) as { RESULT?: string; result?: string; id?: number };
    const result = String(data.RESULT ?? data.result ?? "").toUpperCase();
    return result === "OK" || Boolean(data.id);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return false;
    try {
      const data = JSON.parse(match[0]) as { RESULT?: string; result?: string; id?: number };
      const result = String(data.RESULT ?? data.result ?? "").toUpperCase();
      return result === "OK" || Boolean(data.id);
    } catch {
      return false;
    }
  }
}

function enquiryUrls() {
  const urls = [LANDING_ENQUIRY_PHP];
  if (typeof window !== "undefined" && /(^|\.)mdrcindia\.com$/i.test(window.location.hostname)) {
    urls.unshift(`${window.location.origin}/scripts/ajax/index.php`);
  }
  return urls;
}

function isLocalBrowser() {
  if (typeof window === "undefined") return false;
  const host = window.location.hostname;
  return (
    host === "localhost" ||
    host === "127.0.0.1" ||
    host.startsWith("192.168.") ||
    host.startsWith("10.")
  );
}

export async function postLandingEnquiryBrowser(fields: BrowserLandingEnquiry) {
  const body = enquiryPayload(fields).toString();
  let lastError = "Could not submit. Please try again.";
  let crossOriginBlocked = false;

  for (const url of enquiryUrls()) {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json, text/plain, */*",
        },
        body,
        credentials: "omit",
      });
      const text = await response.text();
      if (isOk(text)) return;
      lastError = "Could not submit. Please try again.";
    } catch {
      crossOriginBlocked = true;
    }
  }

  if (crossOriginBlocked && isLocalBrowser()) return;
  throw new Error(lastError);
}
