import requests from "@/lib/httpServices";

export const LANDING_ENQUIRY_PHP = "https://www.mdrcindia.com/scripts/ajax/index.php";

export function isPhoneBrowser() {
  if (typeof navigator === "undefined") return false;
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

/** Native POST so iOS/Android actually send the row (JS CORS is blocked on phones). */
export function nativeSubmitLandingForm(form: HTMLFormElement) {
  form.setAttribute("action", LANDING_ENQUIRY_PHP);
  form.setAttribute("method", "post");
  form.setAttribute("enctype", "application/x-www-form-urlencoded");
  let popup: Window | null = null;
  try {
    popup = window.open("about:blank", "mdrcLandingEnquiry");
  } catch {
    popup = null;
  }
  form.setAttribute("target", popup ? "mdrcLandingEnquiry" : "_self");
  HTMLFormElement.prototype.submit.call(form);
  return Boolean(popup);
}

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

function isOkPayload(data: { RESULT?: string; result?: string; id?: number } | null) {
  if (!data) return false;
  const result = String(data.RESULT ?? data.result ?? "").toUpperCase();
  return result === "OK" || Boolean(data.id);
}

export async function postLandingEnquiryBrowser(fields: BrowserLandingEnquiry) {
  const payload = enquiryPayload(fields);

  try {
    const webApiData = (await requests.post("/webApi/index.php", {
      view: "landing_page_enquiry",
      method: "landing_page_enquiry",
      name: fields.name,
      phone: fields.phone,
      email: fields.email,
      scan: fields.scan,
      message: fields.message,
      terms: fields.terms || "Yes",
    })) as { msgCode?: string; RESULT?: string; result?: string; id?: number } | null;
    if (String(webApiData?.msgCode) === "1" || isOkPayload(webApiData)) return;
  } catch {
    // Continue with the PHP ajax endpoint used by landing pages.
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
    // Fall through to a direct PHP POST.
  }

  await fetch(LANDING_ENQUIRY_PHP, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: payload.toString(),
    keepalive: true,
    credentials: "omit",
  }).catch(() => undefined);
}
