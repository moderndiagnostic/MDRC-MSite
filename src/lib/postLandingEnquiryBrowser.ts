export function nativePostEnquiryForm(form: HTMLFormElement, actionUrl: string) {
  form.setAttribute("action", actionUrl);
  form.setAttribute("method", "post");
  form.setAttribute("enctype", "application/x-www-form-urlencoded");
  form.removeAttribute("target");
  HTMLFormElement.prototype.submit.call(form);
}
