"use client";

import { useCallback, useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { postEnquiryWithPlainForm } from "@/lib/postLandingEnquiryBrowser";

const SITE_URL = "https://www.mdrcindia.com";
const PHONE_DISPLAY = "8920 300 300";
const PHONE_HREF = "tel:+918920300300";
const IMG = "/assets/images/lp/health-package-in-gurugram";
const DEFAULT_PACKAGE = "Help me choose a package";

const PACKAGES = [
  "Modern Fit India Package",
  "Modern Niramaya Package (1.1)",
  "Modern Niramaya Package (1.2)",
  "Modern Niramaya Package (1.3) for Woman",
  "Modern Niramaya Package (1.4) for Men",
  "Modern Niramaya (1.5)",
  "Modern Niramaya (with imaging) 1.6",
  "Modern Niramaya (with imaging) 1.7 for Men",
  "Modern Niramaya (with imaging) 1.8 for Woman",
  "Modern Niramaya 1.2 with Water Soluble Vitamins",
  "Modern Niramaya Package (1.3) For Women With Fat & Water-Soluble Vitamins",
  "Modern Niramaya Package (1.4) For Men With Fat & Water-Soluble Vitamins",
  DEFAULT_PACKAGE,
  "Others",
];

type HealthPackage = {
  name: string;
  params: string;
  items: string[];
  price: string;
  mrp?: string;
  badge?: string;
};

const healthPackages: HealthPackage[] = [
  {
    name: "Modern Fit India Package",
    params: "Includes 42 Parameters",
    items: [
      "CBC & Sugar Fasting",
      "SGOT, SGPT & Total Bilirubin",
      "TSH, Total Cholesterol & Triglycerides",
      "Serum Creatinine, BUN & eGFR",
    ],
    price: "₹499",
  },
  {
    name: "Modern Niramaya Package (1.1)",
    params: "Includes 40 Parameters",
    items: ["Lipid Profile", "Liver & Kidney Function Tests", "CBC & Serum Iron", "Thyroid Profile & Fasting Glucose"],
    mrp: "₹1,200",
    price: "₹900",
    badge: "25% OFF",
  },
  {
    name: "Modern Niramaya Package (1.2)",
    params: "Includes 84 Parameters",
    items: ["Lipid Profile, LFT & KFT", "CBC, Iron & Thyroid Profile", "Vitamin D & Vitamin B12", "HbA1c & Urine Routine"],
    mrp: "₹3,500",
    price: "₹2,625",
    badge: "25% OFF",
  },
  {
    name: "Modern Niramaya Package (1.3) for Woman",
    params: "Includes 93 Parameters",
    items: [
      "CBC, Lipid Profile, LFT & KFT",
      "Vitamin D & Vitamin B12",
      "ANA & Rheumatoid Factor",
      "Serum Iron & Fasting Glucose",
    ],
    mrp: "₹5,000",
    price: "₹3,750",
    badge: "25% OFF",
  },
  {
    name: "Modern Niramaya Package (1.4) for Men",
    params: "Includes 94 Parameters",
    items: [
      "CBC, Lipid Profile & LFT",
      "hs-CRP, IgE & Rheumatoid Factor",
      "Iron Profile, Folic Acid & HbA1c",
      "PSA & Urine Microalbumin",
    ],
    mrp: "₹5,500",
    price: "₹4,125",
    badge: "25% OFF",
  },
  {
    name: "Modern Niramaya (1.5)",
    params: "Includes 10 Parameters",
    items: [
      "CBC & Lipid Profile",
      "Liver & Kidney Function Tests",
      "Thyroid Profile, Fasting Glucose & Serum Iron",
      "ECG & X-Ray Chest PA View",
    ],
    price: "₹1,700",
  },
  {
    name: "Modern Niramaya (with imaging) 1.6",
    params: "Includes 18 Parameters",
    items: [
      "CBC, Lipid Profile, LFT & KFT",
      "Thyroid, HbA1c, Vitamin D & B12",
      "IgE, CRP & ESR",
      "ECG, X-Ray, Ultrasound Abdomen & PFT",
    ],
    price: "₹4,500",
  },
  {
    name: "Modern Niramaya (with imaging) 1.7 for Men",
    params: "Includes 25 Parameters",
    items: [
      "CBC, Lipid Profile, LFT & KFT",
      "Thyroid, HbA1c, Vitamin D & B12",
      "Iron Profile, PSA, ANA & Rheumatoid Factor",
      "ECG, X-Ray, Ultrasound Whole Abdomen & PFT",
    ],
    price: "₹5,800",
  },
  {
    name: "Modern Niramaya (with imaging) 1.8 for Woman",
    params: "Includes 24 Parameters",
    items: [
      "CBC, Lipid Profile, LFT & KFT",
      "Thyroid, HbA1c, Vitamin D & B12",
      "Iron Profile, CA-125, ANA & Rheumatoid Factor",
      "ECG, X-Ray, Ultrasound Whole Abdomen & PFT",
    ],
    price: "₹5,400",
  },
];

const vitaminPackages: HealthPackage[] = [
  {
    name: "Modern Niramaya 1.2 with Water Soluble Vitamins",
    params: "Includes 92 Parameters",
    items: ["Water Soluble Vitamins Panel", "Lipid Profile, LFT & KFT", "Thyroid Profile & HbA1c", "CRP & SLE Panel"],
    mrp: "₹5,700",
    price: "₹4,275",
    badge: "25% OFF",
  },
  {
    name: "Modern Niramaya Package (1.3) For Women With Fat & Water-Soluble Vitamins",
    params: "Includes 105 Parameters",
    items: [
      "Fat & Water Soluble Vitamins by LC-MS/MS",
      "CBC, Lipid Profile, LFT & KFT",
      "ANA & Rheumatoid Factor",
      "hs-CRP, IgE & Serum Iron",
    ],
    mrp: "₹7,600",
    price: "₹5,700",
    badge: "25% OFF",
  },
  {
    name: "Modern Niramaya Package (1.4) For Men With Fat & Water-Soluble Vitamins",
    params: "Includes 106 Parameters",
    items: [
      "Fat & Water Soluble Vitamins by LC-MS/MS",
      "CBC, Lipid Profile, LFT & KFT",
      "Iron Profile, HbA1c & hs-CRP",
      "PSA & Urine Routine",
    ],
    mrp: "₹8,100",
    price: "₹6,075",
    badge: "25% OFF",
  },
];

const features = [
  {
    title: "Comprehensive Packages",
    description: "Packages with up to 106 parameters covering vital organs, vitamins and more.",
    image: `${IMG}/why-choose-mri/3t-mri-technology.webp`,
  },
  {
    title: "Home Sample Collection",
    description: "Get your samples collected from the comfort of your home.",
    image: `${IMG}/why-choose-mri/high-resolution-imaging.webp`,
  },
  {
    title: "Experienced Pathologists",
    description: "Expert team delivering trusted and precise test results.",
    image: `${IMG}/why-choose-mri/experienced-radiologists.webp`,
  },
  {
    title: "Faster & Accurate Reporting",
    description: "Quick, reliable reports to support timely medical decisions.",
    image: `${IMG}/why-choose-mri/accurate-reporting.webp`,
  },
  {
    title: "Patient-friendly Environment",
    description: "A comfortable, caring, and stress-free experience for every patient.",
    image: `${IMG}/why-choose-mri/patient-friendly-environment.webp`,
  },
  {
    title: "NABL Accredited Labs",
    description: "NABL accredited laboratories that assure reliable reports.",
    image: `${IMG}/why-choose-mri/advanced-diagnostic-expertise.webp`,
  },
];

const steps = [
  {
    number: "01",
    title: "Book Appointment",
    description: "Choose a package and book a home collection or centre visit at a convenient time.",
    image: `${IMG}/scan-preparation/icon-book-appointment.svg`,
  },
  {
    number: "02",
    title: "Fast for 10 to 12 Hours",
    description: "Minimum 12 hours fasting is required for the Lipid Profile. Water is allowed.",
    image: `${IMG}/scan-preparation/icon-follow-instructions.svg`,
  },
  {
    number: "03",
    title: "Inform Our Team",
    description: "Tell us about any medicines you take, pregnancy or existing health conditions.",
    image: `${IMG}/scan-preparation/icon-inform-radiologist.svg`,
  },
  {
    number: "04",
    title: "Get Reports Online",
    description: "Access your reports online on WhatsApp or your MDRC dashboard.",
    image: `${IMG}/scan-preparation/icon-carry-previous-reports.svg`,
  },
];

const locations = [
  {
    label: "GURUGRAM - Sec 40",
    title: "Modern Diagnostic & Research Centre, Sector-40, Gurugram",
    address: "1057P, Sector-40, Gurugram, Haryana – 122002",
    image: `${IMG}/mdrc-lab-sector-40-gurugram.webp`,
    alt: "MDRC Sector 40 centre",
  },
  {
    label: "GURGAON - New Railway Road",
    title: "Modern Diagnostic & Research Centre, NRR, Gurugram",
    address: "363-364/4, Sector-12, New Railway Road, Gurugram – 122001, Haryana, India",
    image: `${IMG}/mdrc-lab-new-railway-road-gurugram.webp`,
    alt: "MDRC New Railway Road centre",
  },
];

const services = [
  { name: "PET-CT / SPECT-CT", image: `${IMG}/services/icon-petct.svg` },
  { name: "MRI", image: `${IMG}/services/icon-mri.svg` },
  { name: "CT Scan", image: `${IMG}/services/icon-ct.svg` },
  { name: "X-Ray", image: `${IMG}/services/icon-xray.svg` },
  { name: "Ultrasound", image: `${IMG}/services/icon-ultrasound.svg` },
  { name: "CBCT", image: `${IMG}/services/icon-cbct.svg` },
  { name: "Mammography", image: `${IMG}/services/icon-mammography.svg` },
  { name: "Pathology", image: `${IMG}/services/icon-pathology.svg` },
  { name: "Health Checkups", image: `${IMG}/services/icon-checkup.svg` },
  { name: "Other Services", image: `${IMG}/services/icon-other.svg` },
];

const faqs = [
  {
    question: "What is a full body health checkup?",
    answer:
      "A full body health checkup is a set of tests that assesses your overall health, including your heart, liver, kidneys, thyroid, blood sugar, blood count and vitamin levels. It helps detect health problems early, even before symptoms appear.",
  },
  {
    question: "Which health package should I choose?",
    answer:
      "Modern Niramaya 1.1 is a good basic checkup. Niramaya 1.2 adds Vitamin D, Vitamin B12, HbA1c and urine tests. Niramaya 1.3 and 1.4 are designed for women and men respectively, and the vitamin packages add a complete fat and water soluble vitamin panel. Our team can help you choose.",
  },
  {
    question: "Do I need to fast before the test?",
    answer:
      "Yes. A minimum of 12 hours fasting is required for the Lipid Profile included in these packages. You can drink water during the fasting period.",
  },
  {
    question: "Is home sample collection available?",
    answer: "Yes. Home sample collection is available for these packages in Gurugram. You can also visit our nearest MDRC centre.",
  },
  {
    question: "When will I receive my reports?",
    answer:
      "Reports are shared online on WhatsApp and your MDRC dashboard. The expected reporting time will be communicated to you at the time of booking.",
  },
  {
    question: "Why should I get my vitamin levels tested?",
    answer:
      "Vitamins support energy, immunity, bone health and nerve function. Deficiencies such as low Vitamin D or Vitamin B12 are common and often go unnoticed, so testing helps you and your doctor take timely action.",
  },
  {
    question: "How often should I get a health checkup?",
    answer:
      "Most adults are advised to get a preventive health checkup once a year, or as recommended by their doctor based on age, lifestyle and medical history.",
  },
];

const emptyForm = {
  name: "",
  phone: "",
  email: "",
  pkg: DEFAULT_PACKAGE,
  message: "",
  acceptedTerms: true,
};

const reportInvalid = (input: HTMLInputElement | null, message: string) => {
  if (!input) {
    alert(message);
    return;
  }
  input.setCustomValidity(message);
  input.reportValidity();
  input.focus();
  input.setCustomValidity("");
};

function CallButton() {
  return (
    <a href={PHONE_HREF} className="header-call">
      <img src={`${IMG}/icon-call.webp`} alt="" width={18} height={18} />
      <span className="header-call-number">{PHONE_DISPLAY}</span>
    </a>
  );
}

function PackageCard({ item, onBook }: { item: HealthPackage; onBook: (pkg: string) => void }) {
  return (
    <article className="package-card">
      {item.badge ? <span className="package-badge">{item.badge}</span> : null}
      <h3>{item.name}</h3>
      <p className="package-params">{item.params}</p>
      <ul className="package-list">
        {item.items.map((line) => (
          <li key={line}>
            <span className="check-icon">✓</span> {line}
          </li>
        ))}
      </ul>
      <div className="package-price">
        {item.mrp ? <del>{item.mrp}</del> : null}
        <strong>{item.price}</strong>
      </div>
      <button type="button" className="btn-book package-book" onClick={() => onBook(item.name)}>
        Book Now
      </button>
    </article>
  );
}

function PackageSlider({ onBook }: { onBook: (pkg: string) => void }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef(0);
  const targetRef = useRef(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const updateArrows = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    setAtStart(track.scrollLeft <= 2);
    setAtEnd(track.scrollLeft + track.clientWidth >= track.scrollWidth - 2);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    updateArrows();
    track?.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);
    return () => {
      track?.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
      cancelAnimationFrame(frameRef.current);
    };
  }, [updateArrows]);

  const go = (dir: number) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector(".package-card");
    const size = card ? card.getBoundingClientRect().width + 18 : track.clientWidth;
    const max = track.scrollWidth - track.clientWidth;
    const base = frameRef.current ? targetRef.current : track.scrollLeft;
    const index = Math.round(base / size) + dir;
    const left = Math.max(0, Math.min(max, index * size));

    cancelAnimationFrame(frameRef.current);
    targetRef.current = left;
    const from = track.scrollLeft;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / 350);
      track.scrollLeft = from + (left - from) * (1 - Math.pow(1 - p, 3));
      frameRef.current = p < 1 ? requestAnimationFrame(tick) : 0;
    };
    frameRef.current = requestAnimationFrame(tick);
  };

  return (
    <div className="package-slider">
      <button
        type="button"
        className="package-arrow package-arrow-prev"
        aria-label="Previous packages"
        disabled={atStart}
        onClick={() => go(-1)}
      >
        ‹
      </button>
      <div className="package-track" ref={trackRef} tabIndex={0}>
        {healthPackages.map((item) => (
          <PackageCard item={item} onBook={onBook} key={item.name} />
        ))}
      </div>
      <button
        type="button"
        className="package-arrow package-arrow-next"
        aria-label="Next packages"
        disabled={atEnd}
        onClick={() => go(1)}
      >
        ›
      </button>
    </div>
  );
}

export default function HealthPackageLandingPage() {
  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const termsRef = useRef<HTMLInputElement>(null);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openBooking = (pkg?: string) => {
    const next = pkg && PACKAGES.includes(pkg) ? pkg : DEFAULT_PACKAGE;
    setForm({ ...emptyForm, pkg: next });
    setSubmitted(false);
    setBookingOpen(true);
  };

  const closeBooking = () => {
    setBookingOpen(false);
    setSubmitted(false);
    setForm(emptyForm);
  };

  useEffect(() => {
    if (!bookingOpen) return undefined;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeBooking();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [bookingOpen]);

  const update = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = event.target;
    if (type === "checkbox" && event.target instanceof HTMLInputElement) {
      const acceptedTerms = event.target.checked;
      setForm((current) => ({ ...current, acceptedTerms }));
      return;
    }
    if (name === "name") {
      const cleaned = value.replace(/[^A-Za-z .']/g, "").replace(/\s+/g, " ");
      setForm((current) => ({ ...current, name: cleaned }));
      return;
    }
    if (name === "phone") {
      const digits = value.replace(/\D/g, "").slice(0, 10);
      setForm((current) => ({ ...current, phone: digits }));
      return;
    }
    setForm((current) => ({ ...current, [name]: value }));
  };

  const submitBooking = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = form.name.trim();
    const phone = form.phone.trim();
    const email = form.email.trim();
    if (!/^[A-Za-z][A-Za-z .']{1,59}$/.test(name)) {
      reportInvalid(nameRef.current, "Please enter a valid name using letters only.");
      return;
    }
    if (!/^[6-9]\d{9}$/.test(phone)) {
      reportInvalid(phoneRef.current, "Please enter a valid 10-digit mobile number.");
      return;
    }
    if (!form.acceptedTerms) {
      reportInvalid(termsRef.current, "Please accept the Terms And Conditions.");
      return;
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    const pkg = PACKAGES.includes(form.pkg) ? form.pkg : DEFAULT_PACKAGE;
    const message = form.message.trim();

    setIsSubmitting(true);
    void (async () => {
      try {
        const ok = await postEnquiryWithPlainForm({
          name,
          phone,
          email,
          scan: "Others",
          message: `Package: ${pkg}${message ? `\n${message}` : ""}`,
          terms: "Yes",
        });
        if (ok) setSubmitted(true);
        else alert("Could not submit. Please try again.");
      } catch {
        alert("Could not submit. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    })();
  };

  return (
    <div className="health-landing">
      <header className="site-header">
        <div className="container header-inner">
          <a href={`${SITE_URL}/`} className="logo">
            <img src={`${IMG}/mdrc-logo.webp`} alt="Modern Diagnostic & Research Centre" width={400} height={113} />
          </a>
          <div className="header-actions">
            <button type="button" className="btn-book" onClick={() => openBooking()}>
              Book Now
            </button>
          </div>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="container hero-grid">
            <div className="hero-content">
              <span className="hero-pill">
                <span className="hero-pill-dot" /> Up to 25% OFF on Health Packages
              </span>
              <h1>
                Full Body Health Checkup <span>in Gurugram</span>
              </h1>
              <p className="hero-description">
                Comprehensive health and vitamin packages with up to 106 parameters, home sample collection and accurate reports from NABL accredited labs.
              </p>
              <div className="hero-price">
                <span className="hero-price-label">Packages starting at</span>
                <strong>₹499</strong>
              </div>
              <div className="hero-buttons">
                <button type="button" className="btn-book btn-hero" onClick={() => openBooking()}>
                  Book Your Checkup
                </button>
                <a href="#packages" className="btn-hero-outline">
                  View Packages
                </a>
              </div>
              <div className="hero-trust">
                <div>
                  <span className="check-icon">✓</span> NABL Accredited Labs
                </div>
                <div>
                  <span className="check-icon">✓</span> Home Sample Collection
                </div>
                <div>
                  <span className="check-icon">✓</span> Online Reports
                </div>
              </div>
            </div>
            <div className="hero-visual">
              <div className="hero-image-wrapper">
                <img
                  src={`${IMG}/home-collection/health-checkup-hero-indian.jpg`}
                  alt="Health checkup blood sample collection in Gurugram"
                  width={1152}
                  height={864}
                  fetchPriority="high"
                />
              </div>
              <div className="hero-badge">
                <span className="badge-icon">%</span>
                <div>
                  <strong>Up to 25% OFF</strong>
                  <small>On Health Packages</small>
                </div>
              </div>
              <div className="hero-float hero-float-top">
                <span className="hero-float-number">106</span>
                <div>
                  <strong>Parameters</strong>
                  <small>Complete body coverage</small>
                </div>
              </div>
              <div className="hero-float hero-float-mid">
                <span className="hero-float-icon">✓</span>
                <div>
                  <strong>1 Cr+ Patients</strong>
                  <small>Trusted for 41+ years</small>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="trust-strip">
          <div className="container trust-strip-grid">
            <div className="trust-item">
              <span className="trust-number">41+</span>
              <span className="trust-label">Years of Diagnostic Excellence</span>
            </div>
            <div className="trust-item">
              <span className="trust-number">25+</span>
              <span className="trust-label">Diagnostic Labs</span>
            </div>
            <div className="trust-item">
              <span className="trust-number">1 Cr+</span>
              <span className="trust-label">Patients Served</span>
            </div>
            <div className="trust-item">
              <span className="trust-number">NABL & NABH</span>
              <span className="trust-label">Accredited</span>
            </div>
          </div>
        </section>

        <section className="section" id="packages">
          <div className="container">
            <div className="center-heading">
              <span className="eyebrow">HEALTH PACKAGES</span>
              <h2>Full Body Health Checkup Packages</h2>
              <p>Choose a preventive health package that covers your vital organs, blood sugar, thyroid and more.</p>
            </div>
            <PackageSlider onBook={openBooking} />
          </div>
        </section>

        <section className="section section-light">
          <div className="container">
            <div className="center-heading">
              <span className="eyebrow">VITAMIN PACKAGES</span>
              <h2>Vitamin Packages</h2>
              <p>Full body checkups combined with fat and water soluble vitamin tests for a complete nutritional assessment.</p>
            </div>
            <div className="package-grid">
              {vitaminPackages.map((item) => (
                <PackageCard item={item} onBook={openBooking} key={item.name} />
              ))}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="center-heading">
              <span className="eyebrow">WHY CHOOSE MDRC</span>
              <h2>Why Choose MDRC for Your Health Checkup?</h2>
              <p>Accurate tests, expert care, and convenient service you can trust.</p>
            </div>
            <div className="feature-grid">
              {features.map((feature) => (
                <div className="feature-card" key={feature.title}>
                  <div className="feature-icon">
                    <img src={feature.image} alt="" width={26} height={26} loading="lazy" />
                  </div>
                  <div>
                    <h3>{feature.title}</h3>
                    <p>{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section section-prep">
          <div className="container">
            <div className="prep-content">
              <div className="center-heading">
                <span className="eyebrow">BEFORE YOUR TEST</span>
                <h2>Health Checkup Preparation</h2>
                <p>Follow simple preparation guidelines to ensure smooth and accurate test results.</p>
              </div>
              <div className="steps-grid">
                {steps.map((step) => (
                  <div className="step-card" key={step.number}>
                    <span className="step-number">{step.number}</span>
                    <div className="step-icon">
                      <img src={step.image} alt="" width={28} height={28} loading="lazy" />
                    </div>
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="section section-light">
          <div className="container">
            <div className="center-heading">
              <span className="eyebrow">OUR NETWORK</span>
              <h2>Trusted Diagnostic Network Across Gurugram</h2>
            </div>
            <div className="location-grid">
              {locations.map((location) => (
                <article className="location-card" key={location.label}>
                  <div className="location-image">
                    <img src={location.image} alt={location.alt} loading="lazy" />
                  </div>
                  <div className="location-content">
                    <span className="location-label">{location.label}</span>
                    <h3>{location.title}</h3>
                    <p>{location.address}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="center-heading">
              <span className="eyebrow">DIAGNOSTIC SERVICES</span>
              <h2>Our Imaging Services</h2>
            </div>
            <div className="services-grid">
              {services.map((service) => (
                <button type="button" className="simple-service" key={service.name} onClick={() => openBooking()}>
                  <img className="simple-service-icon" src={service.image} alt="" width={40} height={40} loading="lazy" />
                  <span>{service.name}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="section section-dark">
          <div className="container trust-image-grid">
            <div className="trust-image-wrapper">
              <img src={`${IMG}/why-patients-trust-us.webp`} alt="Patient receiving diagnostic imaging care" loading="lazy" />
            </div>
            <div className="trust-content">
              <span className="eyebrow eyebrow-light">PATIENT EXPERIENCE</span>
              <h2>Why Patients Trust Us</h2>
              <ul className="trust-list">
                <li>
                  <span>✓</span>
                  <p>Advanced diagnostic technology</p>
                </li>
                <li>
                  <span>✓</span>
                  <p>Experienced professionals</p>
                </li>
                <li>
                  <span>✓</span>
                  <p>Patient-focused environment</p>
                </li>
                <li>
                  <span>✓</span>
                  <p>Reliable diagnostic services</p>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container faq-container">
            <div className="center-heading">
              <span className="eyebrow">FREQUENTLY ASKED QUESTIONS</span>
              <h2>Health Checkup FAQs</h2>
            </div>
            {faqs.map((faq) => (
              <details className="faq-item" key={faq.question}>
                <summary>
                  {faq.question} <span className="faq-plus">+</span>
                </summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="final-cta" id="contact">
          <div className="container final-cta-inner">
            <div>
              <h2>Book Your Health Checkup in Gurugram</h2>
              <p>
                Book a health or vitamin package at MDRC India with home sample collection and accurate reports from NABL accredited labs.
              </p>
            </div>
            <div className="final-buttons">
              <button type="button" className="btn-book btn-white-book" onClick={() => openBooking()}>
                Book Now
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer-inner">
          <div className="footer-logo">
            <a href={`${SITE_URL}/`} className="logo">
              <img src={`${IMG}/mdrc-logo.webp`} alt="Modern Diagnostic & Research Centre" width={400} height={113} loading="lazy" />
            </a>
          </div>
          <div className="footer-meta">
            <a className="footer-link" href={`${SITE_URL}/page/privacy-policy`} target="_blank" rel="noopener noreferrer">
              Privacy Policy
            </a>
            <p>©️ 2026, All rights reserved.</p>
          </div>
        </div>
      </footer>

      <div className="mobile-sticky-cta">
        <CallButton />
        <button type="button" className="btn-book" onClick={() => openBooking()}>
          Book Now
        </button>
      </div>

      {bookingOpen ? (
        <div className="booking-overlay" onClick={closeBooking} role="presentation">
          <div
            className="booking-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="booking-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button type="button" className="booking-close" onClick={closeBooking} aria-label="Close booking form">
              ×
            </button>
            {submitted ? (
              <div className="booking-success">
                <h2>Request sent</h2>
                <p>Thank you. Our team will contact you shortly to confirm your appointment.</p>
                <button type="button" className="btn-book" onClick={closeBooking}>
                  Close
                </button>
              </div>
            ) : (
              <div>
                <p className="eyebrow">BOOK APPOINTMENT</p>
                <h2 id="booking-title">Book your health checkup</h2>
                <p className="booking-lead">Share your details and we will help you schedule a home collection or centre visit.</p>
                <form className="booking-form" onSubmit={submitBooking}>
                  <label>
                    <span>
                      Full Name <span className="required-mark">*</span>
                    </span>
                    <input
                      ref={nameRef}
                      name="name"
                      required
                      minLength={2}
                      maxLength={60}
                      autoComplete="name"
                      pattern="[A-Za-z][A-Za-z .']{1,59}"
                      title="Please enter a valid name using letters only."
                      value={form.name}
                      onChange={update}
                    />
                  </label>
                  <label>
                    <span>
                      Mobile Number <span className="required-mark">*</span>
                    </span>
                    <input
                      ref={phoneRef}
                      name="phone"
                      type="tel"
                      required
                      inputMode="numeric"
                      autoComplete="tel"
                      minLength={10}
                      maxLength={10}
                      pattern="[6-9][0-9]{9}"
                      title="Please enter a 10-digit mobile number."
                      value={form.phone}
                      onChange={update}
                    />
                  </label>
                  <label>
                    Email (Optional)
                    <input name="email" type="email" autoComplete="email" value={form.email} onChange={update} />
                  </label>
                  <label className="booking-full">
                    Package
                    <select name="pkg" value={form.pkg} onChange={update}>
                      {PACKAGES.map((pkg) => (
                        <option key={pkg}>{pkg}</option>
                      ))}
                    </select>
                  </label>
                  <label className="booking-full">
                    Message (Optional)
                    <textarea name="message" rows={3} value={form.message} onChange={update} />
                  </label>
                  <label className="booking-terms">
                    <input ref={termsRef} name="terms" type="checkbox" required checked={form.acceptedTerms} onChange={update} />
                    <span>
                      I agree to the{" "}
                      <a href={`${SITE_URL}/page/privacy-policy`} target="_blank" rel="noopener noreferrer">
                        Terms And Conditions
                      </a>
                      .
                    </span>
                  </label>
                  <button type="submit" className="btn-book booking-submit" disabled={isSubmitting}>
                    Submit Request
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
