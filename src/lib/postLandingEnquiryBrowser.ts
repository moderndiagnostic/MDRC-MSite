export const LANDING_ENQUIRY_PHP = "https://www.mdrcindia.com/scripts/ajax/index.php";

export type BrowserLandingEnquiry = {
  name: string;
  phone: string;
  email: string;
  scan: string;
  message: string;
  terms?: string;
};

export function postEnquiryWithPlainForm(fields: BrowserLandingEnquiry) {
  const form = document.createElement("form");
  form.method = "POST";
  form.action = LANDING_ENQUIRY_PHP;
  form.enctype = "application/x-www-form-urlencoded";
  form.setAttribute("accept-charset", "UTF-8");

  const add = (name: string, value: string) => {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = value;
    form.appendChild(input);
  };

  add("method", "landing_page_enquiry");
  add("name", fields.name);
  add("phone", fields.phone);
  add("email", fields.email);
  add("scan", fields.scan);
  add("message", fields.message);
  add("terms", fields.terms || "Yes");

  document.body.appendChild(form);
  form.submit();
}
