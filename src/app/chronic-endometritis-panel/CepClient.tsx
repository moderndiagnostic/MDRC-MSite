"use client";

import { useEffect, useRef, useState } from "react";

const WEBAPI_URL = "https://www.mdrcindia.com/webApi/index.php";
const PHP_ENQUIRY_URL = "https://www.mdrcindia.com/scripts/ajax/index.php";

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

  const saveLandingEnquiry = (fields: {
    name: string;
    phone: string;
    email: string;
    interest: string;
    message: string;
  }) => {
    const payload = new URLSearchParams();
    payload.set("method", "landing_page_enquiry");
    payload.set("name", fields.name);
    payload.set("phone", fields.phone);
    payload.set("email", fields.email);
    payload.set("scan", fields.interest);
    payload.set("message", fields.message);
    payload.set("terms", "Yes");
    return fetch(PHP_ENQUIRY_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: payload.toString(),
    });
  };

  const handleSubmit = async () => {
    const name = form.name.trim();
    const phone = form.phone.replace(/\D/g, "");
    const email = form.email.trim();
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

    const message = [form.clinic.trim() && `Clinic: ${form.clinic.trim()}`, form.message.trim()]
      .filter(Boolean)
      .join("\n");

    setSending(true);
    try {
      const formData = new FormData();
      formData.append("view", "test_booking_inquiry");
      formData.append("name", name);
      formData.append("phone", phone);
      formData.append("city", "Gurugram");
      formData.append("address", form.clinic.trim() || "Gurugram");
      formData.append("enquiry_type", "New Booking");
      formData.append("test_type", form.interest);

      const response = await fetch(WEBAPI_URL, {
        method: "POST",
        body: formData,
      });
      const result = (await response.json().catch(() => null)) as
        | { msgCode?: string; message?: string }
        | null;

      await saveLandingEnquiry({
        name,
        phone,
        email,
        interest: form.interest,
        message,
      }).catch(() => undefined);

      if (result?.msgCode === "1") {
        setSubmitted(true);
        return;
      }

      setSubmitted(true);
    } catch {
      try {
        await saveLandingEnquiry({
          name,
          phone,
          email,
          interest: form.interest,
          message,
        });
        setSubmitted(true);
      } catch {
        setSubmitError("Could not submit. Please try again.");
      }
    } finally {
      setSending(false);
    }
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

          <div className={`enquire-form${submitted ? " submitted" : ""}`} id="enquireForm">
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
                  onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
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
                    value={form.phone}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        phone: event.target.value.replace(/\D/g, "").slice(0, 10),
                      }))
                    }
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
                    onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
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
                  onChange={(event) => setForm((current) => ({ ...current, clinic: event.target.value }))}
                />
              </div>
              <div className="ef-row">
                <label htmlFor="cep_efInterest">I&apos;m enquiring about</label>
                <select
                  id="cep_efInterest"
                  name="interest"
                  value={form.interest}
                  onChange={(event) => setForm((current) => ({ ...current, interest: event.target.value }))}
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
                  name="message"
                  rows={3}
                  placeholder="Requisition forms, specimen kits, pricing, or anything else"
                  value={form.message}
                  onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))}
                />
              </div>
              {submitError ? (
                <p className="ef-note" style={{ color: "#ffd7d7", marginBottom: 12 }}>
                  {submitError}
                </p>
              ) : null}
              <button
                type="button"
                className="btn btn-primary"
                style={{ width: "100%", justifyContent: "center" }}
                disabled={sending}
                onClick={handleSubmit}
              >
                {sending ? "Sending..." : "Send enquiry"}
              </button>
              <p className="ef-note">We will contact you on the number you provide.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
