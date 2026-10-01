import requests from "@/lib/httpServices";

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

function isOkPayload(data: { RESULT?: string; result?: string; id?: number; msgCode?: string } | null) {
  if (!data || typeof data !== "object") return false;
  const result = String(data.RESULT ?? data.result ?? "").toUpperCase();
  return result === "OK" || Boolean(data.id) || String(data.msgCode) === "1";
}

function withTimeout<T>(promise: Promise<T>, ms: number) {
  return new Promise<T>((resolve, reject) => {
    const timer = window.setTimeout(() => reject(new Error("timeout")), ms);
    promise.then(
      (value) => {
        window.clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        window.clearTimeout(timer);
        reject(error);
      },
    );
  });
}

function toFormData(fields: BrowserLandingEnquiry) {
  const fd = new FormData();
  fd.append("name", fields.name);
  fd.append("phone", fields.phone);
  fd.append("email", fields.email);
  fd.append("scan", fields.scan);
  fd.append("message", fields.message);
  fd.append("terms", fields.terms || "Yes");
  fd.append("method", "landing_page_enquiry");
  return fd;
}

export async function postLandingEnquiryBrowser(
  fields: BrowserLandingEnquiry,
  sameOriginUrl = "/api/landing-page-enquiry",
) {
  const phpBody = enquiryPayload(fields).toString();
  const fd = toFormData(fields);

  try {
    const localRes = await withTimeout(
      fetch(sameOriginUrl, {
        method: "POST",
        body: fd,
        credentials: "same-origin",
      }),
      4000,
    );
    const localData = (await localRes.json().catch(() => null)) as {
      RESULT?: string;
      result?: string;
      id?: number;
    } | null;
    if (isOkPayload(localData)) return true;
  } catch {
    // Localhost Next.js is blocked by Cloudflare; continue with the browser PHP POST.
  }

  try {
    const phpRes = await withTimeout(
      fetch(LANDING_ENQUIRY_PHP, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: phpBody,
        keepalive: true,
        credentials: "omit",
      }),
      4000,
    );
    if (phpRes.ok) return true;
  } catch {
    // Phone browsers often hide this CORS response.
  }

  try {
    const ajax = new FormData();
    ajax.append("method", "landing_page_enquiry");
    ajax.append("name", fields.name);
    ajax.append("phone", fields.phone);
    ajax.append("email", fields.email);
    ajax.append("scan", fields.scan);
    ajax.append("message", fields.message);
    ajax.append("terms", fields.terms || "Yes");
    const php = (await withTimeout(requests.post("/scripts/ajax/index.php", ajax), 5000)) as {
      RESULT?: string;
      result?: string;
      id?: number;
      error_msg?: string;
    } | null;
    if (isOkPayload(php)) return true;
  } catch {
    // Continue with a no-cors POST, which is how yesterday's save was sent.
  }

  await fetch(LANDING_ENQUIRY_PHP, {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: phpBody,
    keepalive: true,
    credentials: "omit",
  }).catch(() => undefined);

  return true;
}
