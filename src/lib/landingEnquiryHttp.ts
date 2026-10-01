import { NextResponse } from "next/server";
import {
  isEnquirySuccess,
  submitLandingEnquiry,
  type LandingEnquiryFields,
} from "@/lib/submitLandingEnquiry";

export const LANDING_ENQUIRY_PHP = "https://www.mdrcindia.com/scripts/ajax/index.php";

function escapeAttr(value: string) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function html(body: string) {
  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

export function thankYouHtml() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Enquiry received</title>
</head>
<body style="font-family:Arial,sans-serif;padding:32px 20px;text-align:center;color:#123">
  <h1 style="font-size:22px">Enquiry received</h1>
  <p>Thank you. The MDRC team will call you back.</p>
  <p><a href="javascript:history.back()">Back to the form</a></p>
</body>
</html>`;
}

export function relayToPhpHtml(fields: LandingEnquiryFields) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Submitting enquiry</title>
</head>
<body style="font-family:Arial,sans-serif;padding:32px 20px;text-align:center;color:#123">
  <p>Submitting your enquiry…</p>
  <form id="landingEnquiryRelay" method="post" action="${LANDING_ENQUIRY_PHP}">
    <input type="hidden" name="method" value="landing_page_enquiry" />
    <input type="hidden" name="name" value="${escapeAttr(fields.name)}" />
    <input type="hidden" name="phone" value="${escapeAttr(fields.phone)}" />
    <input type="hidden" name="email" value="${escapeAttr(fields.email)}" />
    <input type="hidden" name="scan" value="${escapeAttr(fields.scan)}" />
    <input type="hidden" name="message" value="${escapeAttr(fields.message)}" />
    <input type="hidden" name="terms" value="${escapeAttr(fields.terms || "Yes")}" />
  </form>
  <script>document.getElementById("landingEnquiryRelay").submit();</script>
</body>
</html>`;
}

function getClientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "";
  return request.headers.get("x-real-ip") || request.headers.get("cf-connecting-ip") || "";
}

export async function handleLandingEnquiryPost(
  request: Request,
  mapFields: (incoming: FormData) => LandingEnquiryFields,
) {
  const incoming = await request.formData();
  const fields = mapFields(incoming);
  const result = await submitLandingEnquiry(fields, getClientIp(request));
  const accept = request.headers.get("accept") || "";

  if (accept.includes("application/json")) {
    return NextResponse.json(result);
  }

  if (isEnquirySuccess(result)) return html(thankYouHtml());
  return NextResponse.json(result);
}
