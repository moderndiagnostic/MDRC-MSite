export type BrowserLandingEnquiry = {
  name: string;
  phone: string;
  email: string;
  scan: string;
  message: string;
  terms?: string;
};

function enquiryUrls() {
  const path =
    typeof window === "undefined"
      ? ""
      : window.location.pathname.replace(/\/$/, "");
  return [path ? `${path}/enquiry` : "", "/api/landing-page-enquiry"].filter(Boolean);
}

export async function postEnquiryWithPlainForm(fields: BrowserLandingEnquiry) {
  const fd = new FormData();
  fd.append("name", fields.name);
  fd.append("phone", fields.phone);
  fd.append("email", fields.email);
  fd.append("scan", fields.scan);
  fd.append("message", fields.message);
  fd.append("terms", fields.terms || "Yes");
  fd.append(
    "page",
    typeof window === "undefined" ? "" : window.location.pathname.replace(/\/$/, "").replace(/^\//, ""),
  );

  for (const url of enquiryUrls()) {
    try {
      const res = await fetch(url, {
        method: "POST",
        body: fd,
        headers: { Accept: "application/json" },
      });
      if (!res.ok) continue;
      const data = (await res.json().catch(() => null)) as {
        RESULT?: string;
        result?: string;
        id?: number;
      } | null;
      const result = String(data?.RESULT ?? data?.result ?? "").toUpperCase();
      if (result === "OK" || Boolean(data?.id)) return true;
    } catch {
      // Try the next same-origin route.
    }
  }

  return false;
}
