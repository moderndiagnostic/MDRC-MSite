export const LANDING_ENQUIRY_PHP = "https://www.mdrcindia.com/scripts/ajax/index.php";

export type BrowserLandingEnquiry = {
  name: string;
  phone: string;
  email: string;
  scan: string;
  message: string;
  terms?: string;
};

export function postLandingEnquiryBrowser(fields: BrowserLandingEnquiry) {
  return new Promise<void>((resolve, reject) => {
    if (typeof document === "undefined") {
      reject(new Error("Enquiry can only be submitted in the browser."));
      return;
    }

    const frameName = `lp_enq_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const iframe = document.createElement("iframe");
    iframe.name = frameName;
    iframe.setAttribute("aria-hidden", "true");
    iframe.style.cssText = "position:fixed;width:1px;height:1px;left:-9999px;border:0";

    const form = document.createElement("form");
    form.method = "POST";
    form.action = LANDING_ENQUIRY_PHP;
    form.target = frameName;
    form.acceptCharset = "UTF-8";

    const values: Record<string, string> = {
      method: "landing_page_enquiry",
      name: fields.name,
      phone: fields.phone,
      email: fields.email,
      scan: fields.scan,
      message: fields.message,
      terms: fields.terms || "Yes",
    };

    Object.entries(values).forEach(([key, value]) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = value;
      form.appendChild(input);
    });

    document.body.appendChild(iframe);
    document.body.appendChild(form);
    form.submit();

    window.setTimeout(() => {
      form.remove();
      iframe.remove();
      resolve();
    }, 2000);
  });
}
