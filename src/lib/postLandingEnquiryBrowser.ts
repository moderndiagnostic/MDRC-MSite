const PHP_ENQUIRY_URL = "https://www.mdrcindia.com/scripts/ajax/index.php";

export type BrowserLandingEnquiry = {
  name: string;
  phone: string;
  email: string;
  scan: string;
  message: string;
  terms?: string;
};

function escapeAttr(value: string) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function relayHtml(fields: BrowserLandingEnquiry) {
  const terms = fields.terms || "Yes";
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Submitting enquiry</title>
</head>
<body style="font-family:Arial,sans-serif;padding:32px 20px;text-align:center">
  <p>Submitting your enquiry…</p>
  <form id="landingEnquiryRelay" method="post" action="${PHP_ENQUIRY_URL}">
    <input type="hidden" name="method" value="landing_page_enquiry" />
    <input type="hidden" name="name" value="${escapeAttr(fields.name)}" />
    <input type="hidden" name="phone" value="${escapeAttr(fields.phone)}" />
    <input type="hidden" name="email" value="${escapeAttr(fields.email)}" />
    <input type="hidden" name="scan" value="${escapeAttr(fields.scan)}" />
    <input type="hidden" name="message" value="${escapeAttr(fields.message)}" />
    <input type="hidden" name="terms" value="${escapeAttr(terms)}" />
  </form>
  <script>document.getElementById("landingEnquiryRelay").submit();</script>
</body>
</html>`;
}

export function postEnquiryWithPlainForm(fields: BrowserLandingEnquiry) {
  const fd = new FormData();
  fd.append("name", fields.name);
  fd.append("phone", fields.phone);
  fd.append("email", fields.email);
  fd.append("scan", fields.scan);
  fd.append("message", fields.message);
  fd.append("terms", fields.terms || "Yes");
  fd.append("method", "landing_page_enquiry");
  fetch("/api/landing-page-enquiry", {
    method: "POST",
    body: fd,
    keepalive: true,
  }).catch(() => undefined);

  const html = relayHtml(fields);
  const blobUrl = URL.createObjectURL(new Blob([html], { type: "text/html" }));
  window.location.replace(blobUrl);
}
