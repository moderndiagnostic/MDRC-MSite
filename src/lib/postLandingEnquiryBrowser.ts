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

function isOkPayload(data: { RESULT?: string; result?: string; id?: number } | null) {
  if (!data) return false;
  const result = String(data.RESULT ?? data.result ?? "").toUpperCase();
  return result === "OK" || Boolean(data.id);
}

export async function postLandingEnquiryBrowser(fields: BrowserLandingEnquiry) {
  const payload = enquiryPayload(fields);

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
    // Fall through to a direct PHP POST. Phones can send this when it is a simple request.
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
