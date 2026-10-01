"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { nativePostEnquiryForm } from "@/lib/postLandingEnquiryBrowser";

function readValue(formEl: HTMLFormElement | null, name: string, fallback = "") {
  const field = formEl?.elements.namedItem(name);
  if (field && "value" in field) return String(field.value || "");
  return fallback;
}

function normalizeIndianMobile(raw: string) {
  let digits = raw.replace(/\D/g, "");
  if (digits.startsWith("91") && digits.length >= 12) digits = digits.slice(2);
  if (digits.startsWith("0") && digits.length === 11) digits = digits.slice(1);
  if (digits.length > 10) digits = digits.slice(-10);
  return digits;
}

const INTEREST_OPTIONS = [
  {
    value: "Comprehensive Chronic Endometritis DICE Panel",
    label: "Comprehensive Chronic Endometritis DICE Panel (6 days)",
  },
  {
    value: "DICE PCR Panel — 11 Pathogens only",
    label: "DICE PCR Panel — 11 Pathogens only (4 days)",
  },
  {
    value: "Not sure — need guidance",
    label: "Not sure — need guidance",
  },
];

export default function CepClient({ html }: { html: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [errors, setErrors] = useState({ name: false, phone: false, email: false });
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    clinic: "",
    interest: INTEREST_OPTIONS[0].value,
    message: "",
  });

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const onFaqClick = (event: Event) => {
      const button = (event.target as HTMLElement).closest(".faq-q");
      if (!button || !root.contains(button)) return;
      const item = button.closest(".faq-item");
      const answer = item?.querySelector(".faq-a") as HTMLElement | null;
      if (!item || !answer) return;

      const isOpen = item.classList.contains("open");
      root.querySelectorAll(".faq-item.open").forEach((openItem) => {
        openItem.classList.remove("open");
        const openAnswer = openItem.querySelector(".faq-a") as HTMLElement | null;
        if (openAnswer) openAnswer.style.maxHeight = "0";
      });

      if (!isOpen) {
        item.classList.add("open");
        answer.style.maxHeight = `${answer.scrollHeight}px`;
      }
    };

    root.addEventListener("click", onFaqClick);
    return () => root.removeEventListener("click", onFaqClick);
  }, [html]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formEl = event.currentTarget;
    const name = readValue(formEl, "name", form.name).trim();
    const phone = normalizeIndianMobile(readValue(formEl, "phone", form.phone));
    const email = readValue(formEl, "email", form.email).trim();
    const clinic = readValue(formEl, "clinic", form.clinic).trim();
    const interest = readValue(formEl, "interest", form.interest) || INTEREST_OPTIONS[0].value;
    const note = readValue(formEl, "note", form.message).trim();
    const nextErrors = {
      name: !name,
      phone: !/^[6-9]\d{9}$/.test(phone),
      email: Boolean(email) && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
    };
    setErrors(nextErrors);
    setSubmitError("");
    if (nextErrors.name || nextErrors.phone || nextErrors.email) {
      setSubmitError("Please enter a valid name and 10-digit mobile number.");
      return;
    }

    const phoneInput = formEl.elements.namedItem("phone");
    if (phoneInput && "value" in phoneInput) phoneInput.value = phone;
    const scanInput = formEl.elements.namedItem("scan");
    if (scanInput && "value" in scanInput) scanInput.value = interest;
    const messageInput = formEl.elements.namedItem("message");
    if (messageInput && "value" in messageInput) {
      messageInput.value = [clinic && `Clinic: ${clinic}`, note].filter(Boolean).join("\n");
    }

    setSending(true);
    nativePostEnquiryForm(formEl, "/chronic-endometritis-panel/enquiry");
  };

  return (
    <div className="cep-page bg-white min-h-screen">
      <div ref={rootRef} suppressHydrationWarning dangerouslySetInnerHTML={{ __html: html }} />

      <section className="cta-band" id="enquire">
        <div className="wrap enquire-wrap">
          <div className="enquire-intro">
            <h2>Ready to order this panel, or want more detail first?</h2>
            <p>
              Leave your details and the reporting team will call you back — or reach the lab directly for
              requisition forms and specimen kits.
            </p>
            <div className="hero-ctas" style={{ marginTop: 28 }}>
              <a href="tel:01246712000" className="btn btn-ghost">
                Call 0124-6712000
              </a>
              <a href="mailto:info@mdrcindia.com" className="btn btn-ghost">
                Email the lab
              </a>
            </div>
          </div>

          <form
            className={`enquire-form${submitted ? " submitted" : ""}`}
            id="enquireForm"
            method="post"
            encType="application/x-www-form-urlencoded"
            onSubmit={handleSubmit}
            noValidate
          >
            <input type="hidden" name="method" value="landing_page_enquiry" />
            <input type="hidden" name="terms" value="Yes" />
            <input type="hidden" name="scan" value={form.interest} />
            <input type="hidden" name="message" value="" />
            <div className="ef-success">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="#0879b8" strokeWidth="1.6" />
                <path
                  d="M8 12.5l2.5 2.5L16 9.5"
                  stroke="#0879b8"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <h4>Enquiry received</h4>
              <p>Thank you. Your enquiry has been submitted. The MDRC team will call you back.</p>
              <button
                type="button"
                className="btn btn-outline"
                style={{ borderColor: "rgba(255,255,255,.4)", color: "#fff" }}
                onClick={() => {
                  setSubmitted(false);
                  setSubmitError("");
                  setForm({
                    name: "",
                    phone: "",
                    email: "",
                    clinic: "",
                    interest: INTEREST_OPTIONS[0].value,
                    message: "",
                  });
                }}
              >
                Submit another enquiry
              </button>
            </div>

            <div className="ef-fields">
              <div className={`ef-row${errors.name ? " has-error" : ""}`}>
                <label htmlFor="cep_efName">
                  Name<span>*</span>
                </label>
                <input
                  type="text"
                  id="cep_efName"
                  name="name"
                  placeholder="Dr. Jane Doe"
                  autoComplete="name"
                  value={form.name}
                  onChange={(event) => {
                    const name = event.target.value;
                    setForm((current) => ({ ...current, name }));
                  }}
                />
                <span className="ef-err">Please enter your name</span>
              </div>
              <div className="ef-row-split">
                <div className={`ef-row${errors.phone ? " has-error" : ""}`}>
                  <label htmlFor="cep_efPhone">
                    Phone<span>*</span>
                  </label>
                  <input
                    type="tel"
                    id="cep_efPhone"
                    name="phone"
                    placeholder="98XXXXXXXX"
                    autoComplete="tel"
                    inputMode="numeric"
                    maxLength={13}
                    value={form.phone}
                    onChange={(event) => {
                      const phone = normalizeIndianMobile(event.target.value);
                      setForm((current) => ({ ...current, phone }));
                    }}
                  />
                  <span className="ef-err">Enter a valid 10-digit number</span>
                </div>
                <div className={`ef-row${errors.email ? " has-error" : ""}`}>
                  <label htmlFor="cep_efEmail">Email</label>
                  <input
                    type="email"
                    id="cep_efEmail"
                    name="email"
                    placeholder="you@clinic.com"
                    autoComplete="email"
                    value={form.email}
                    onChange={(event) => {
                      const email = event.target.value;
                      setForm((current) => ({ ...current, email }));
                    }}
                  />
                  <span className="ef-err">Enter a valid email</span>
                </div>
              </div>
              <div className="ef-row">
                <label htmlFor="cep_efClinic">Clinic / hospital</label>
                <input
                  type="text"
                  id="cep_efClinic"
                  name="clinic"
                  placeholder="Optional"
                  autoComplete="organization"
                  value={form.clinic}
                  onChange={(event) => {
                    const clinic = event.target.value;
                    setForm((current) => ({ ...current, clinic }));
                  }}
                />
              </div>
              <div className="ef-row">
                <label htmlFor="cep_efInterest">I&apos;m enquiring about</label>
                <select
                  id="cep_efInterest"
                  name="interest"
                  value={form.interest}
                  onChange={(event) => {
                    const interest = event.target.value;
                    setForm((current) => ({ ...current, interest }));
                  }}
                >
                  {INTEREST_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="ef-row">
                <label htmlFor="cep_efMsg">Message</label>
                <textarea
                  id="cep_efMsg"
                  name="note"
                  rows={3}
                  placeholder="Requisition forms, specimen kits, pricing, or anything else"
                  value={form.message}
                  onChange={(event) => {
                    const message = event.target.value;
                    setForm((current) => ({ ...current, message }));
                  }}
                />
              </div>
              {submitError ? (
                <p className="ef-note" style={{ color: "#ffd7d7", marginBottom: 12 }}>
                  {submitError}
                </p>
              ) : null}
              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: "100%", justifyContent: "center", touchAction: "manipulation" }}
                disabled={sending}
              >
                {sending ? "Sending..." : "Send enquiry"}
              </button>
              <p className="ef-note">We will contact you on the number you provide.</p>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
