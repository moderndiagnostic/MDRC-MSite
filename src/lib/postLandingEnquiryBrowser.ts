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
  if (!data) return false;
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

export async function postLandingEnquiryBrowser(fields: BrowserLandingEnquiry) {
  const payload = enquiryPayload(fields);
  const phpBody = payload.toString();

  // This is the request that already inserts from PC Chrome.
  try {
    const phpRes = await fetch(LANDING_ENQUIRY_PHP, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: phpBody,
      keepalive: true,
      credentials: "omit",
    });
    if (phpRes.ok) return;
  } catch {
    // iOS may hide the CORS response; keep going with the same API the booking form uses.
  }

  // Same CORS-open webApi path used by the mobile booking enquiry form.
  try {
    const webApiData = (await withTimeout(
      requests.post("/webApi/index.php", {
        view: "landing_page_enquiry",
        method: "landing_page_enquiry",
        name: fields.name,
        phone: fields.phone,
        email: fields.email,
        scan: fields.scan,
        message: fields.message,
        terms: fields.terms || "Yes",
      }),
      8000,
    )) as { msgCode?: string; RESULT?: string; result?: string; id?: number } | null;
    if (isOkPayload(webApiData)) return;
  } catch {
    // Continue.
  }

  try {
    const localFd = new FormData();
    localFd.append("name", fields.name);
    localFd.append("phone", fields.phone);
    localFd.append("email", fields.email);
    localFd.append("scan", fields.scan);
    localFd.append("message", fields.message);
    localFd.append("terms", fields.terms || "Yes");
    const localRes = await fetch("/api/landing-page-enquiry", {
      method: "POST",
      body: localFd,
    });
    const localData = (await localRes.json().catch(() => null)) as {
      RESULT?: string;
      result?: string;
      id?: number;
    } | null;
    if (isOkPayload(localData)) return;
  } catch {
    // Fall through.
  }

  // Opaque POST: Safari can send this even when it will not expose the response.
  await fetch(LANDING_ENQUIRY_PHP, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: phpBody,
    keepalive: true,
    credentials: "omit",
    mode: "no-cors",
  }).catch(() => undefined);

  if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
    navigator.sendBeacon(
      LANDING_ENQUIRY_PHP,
      new Blob([phpBody], { type: "application/x-www-form-urlencoded" }),
    );
  }
}
