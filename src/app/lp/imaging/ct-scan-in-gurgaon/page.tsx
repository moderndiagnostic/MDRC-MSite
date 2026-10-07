"use client";

import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { postEnquiryWithPlainForm } from "@/lib/postLandingEnquiryBrowser";

const SITE_URL = "https://www.mdrcindia.com";
const PHONE_DISPLAY = "8920 300 300";
const PHONE_HREF = "tel:+918920300300";
const WHATSAPP_MESSAGE = `Hello MDRC Team 👋
I’d like to know more about your diagnostic tests and services. Please assist me.`;
const WHATSAPP_HREF = `https://wa.me/918586988847?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
const IMG = "/assets/images/lp/ct-scan-in-gurgaon";

const SCAN_TYPES = [
  "CT Scan",
  "NCCT Head",
  "CECT Whole Abdomen",
  "CECT Chest",
  "NCCT PNS",
  "NCCT KUB",
  "NCCT Orbit",
  "3D CT Pelvis",
  "CECT KUB",
  "CECT KUB / CT Urography",
  "Coronary CT Angiography",
  "PET-CT",
  "MRI",
  "Ultrasound",
  "CBCT",
  "Mammography",
  "X-Ray",
  "Others",
];

const scans = [
  {
    title: "NCCT Head",
    description: "Non-contrast CT for detailed imaging of the head.",
    image: `${IMG}/ct-head.svg`,
    scan: "NCCT Head",
  },
  {
    title: "CECT Whole Abdomen",
    description: "Contrast CT of the whole abdomen for organs and soft tissues.",
    image: `${IMG}/ct-abdomen.svg`,
    scan: "CECT Whole Abdomen",
  },
  {
    title: "CECT Chest",
    description: "Contrast CT of the chest for lungs and surrounding structures.",
    image: `${IMG}/ct-chest.svg`,
    scan: "CECT Chest",
  },
  {
    title: "NCCT PNS",
    description: "Coronal and axial CT of the paranasal sinuses.",
    image: `${IMG}/ct-pns.svg`,
    scan: "NCCT PNS",
  },
  {
    title: "NCCT KUB",
    description: "Non-contrast CT of the kidneys, ureters and bladder.",
    image: `${IMG}/ct-kub.svg`,
    scan: "NCCT KUB",
  },
  {
    title: "Others",
    description: "Other specialised CT studies, including orbit, 3D imaging and angiography.",
    image: `${IMG}/service-other.svg`,
    scan: "Others",
  },
];

const features = [
  {
    title: "128 Slice Cardiac CT",
    description: "GE Revolution EVO scanner for fast, ultra-clear images of your anatomy.",
    image: `${IMG}/ct-slice.svg`,
  },
  {
    title: "High-resolution Imaging",
    description: "Detailed cross-sectional views of organs, bones, vessels and soft tissues.",
    image: `${IMG}/feature-resolution.png`,
  },
  {
    title: "Certified Radiologists",
    description: "Professionally trained radiologists with years of experience in diagnostic imaging.",
    image: `${IMG}/feature-radiologists.png`,
  },
  {
    title: "Accurate & Timely Reports",
    description: "Clear reports to help you and your doctor make healthcare decisions.",
    image: `${IMG}/feature-reporting.png`,
  },
  {
    title: "Fast, Comfortable Scanning",
    description: "Most scans take well under an hour, with staff focused on your comfort.",
    image: `${IMG}/feature-patient.png`,
  },
  {
    title: "NCCT, 3D & Angiography",
    description: "Basic NCCT, 3D scans and angiography available in the same facility.",
    image: `${IMG}/ct-dose.svg`,
  },
];

const steps = [
  {
    number: "01",
    title: "Book Appointment",
    description: "Schedule your CT scan at a convenient time before you visit the centre.",
    image: `${IMG}/prep-book.svg`,
  },
  {
    number: "02",
    title: "Carry Previous Reports with Doctor Prescription",
    description: "Bring previous reports and your doctor’s prescription for the scan.",
    image: `${IMG}/prep-reports.svg`,
  },
  {
    number: "03",
    title: "Share Medical History",
    description: "Tell the team if you are pregnant, have kidney problems, or have had a reaction to contrast dye.",
    image: `${IMG}/prep-history.svg`,
  },
  {
    number: "04",
    title: "Follow Contrast Instructions",
    description: "Contrast scans may need a few hours of fasting. Wear loose clothing and remove jewellery or belts.",
    image: `${IMG}/prep-instructions.svg`,
  },
];

const doctors = [
  { name: "Dr. Devendra Singh Yadav", role: "Managing Director", image: `${IMG}/doctor-devendra.jpg` },
  { name: "Dr. Deepali Yadav", role: "Director & Sr. Consultant - Radiology", image: `${IMG}/doctor-deepali.jpg` },
  { name: "Dr. Nitin Kumar", role: "Director & Sr. Consultant - Radiology & Imaging", image: `${IMG}/doctor-nitin.jpg` },
  { name: "Dr. Rashmi Kumari", role: "Sr. Consultant Radiologist", image: `${IMG}/doctor-rashmi.jpg` },
  { name: "Dr. Ankit Kataria", role: "Sr. Consultant Radiologist", image: `${IMG}/doctor-ankit.jpg` },
  { name: "Dr. Rajat Garg", role: "Consultant Radiologist", image: `${IMG}/doctor-rajat.jpg` },
  { name: "Dr. Padma Chauhan", role: "Consultant Radiologist", image: `${IMG}/doctor-padma.jpg` },
];

const locations = [
  {
    label: "GURUGRAM - Sec 40",
    title: "Modern Diagnostic & Research Centre, Sector-40, Gurugram",
    address: "1057P, Sector-40, Gurugram, Haryana – 122002",
    image: `${IMG}/lab-sector40.jpg`,
    tags: ["NABL & NABH", "7:00 AM – 8:00 PM"],
  },
  {
    label: "GURGAON - New Railway Road",
    title: "Modern Diagnostic & Research Centre, NRR, Gurgaon",
    address: "363-364/4, Sector-12, New Railway Road, Gurgaon – 122001, Haryana, India",
    image: `${IMG}/lab-nrr.jpg`,
    tags: ["CT Scan Available", "NABL & NABH", "Open 24×7"],
  },
];

const services = [
  { name: "PET-CT", image: `${IMG}/service-petct.svg`, scan: "PET-CT" },
  { name: "MRI", image: `${IMG}/service-mri.svg`, scan: "MRI" },
  { name: "CT Scan", image: `${IMG}/service-ct.svg`, scan: "CT Scan" },
  { name: "Ultrasound", image: `${IMG}/service-ultrasound.svg`, scan: "Ultrasound" },
  { name: "X-Ray", image: `${IMG}/service-xray.svg`, scan: "X-Ray" },
  { name: "CBCT", image: `${IMG}/service-cbct.svg`, scan: "CBCT" },
  { name: "Mammography", image: `${IMG}/service-mammo.svg`, scan: "Mammography" },
  { name: "Pathology", image: `${IMG}/service-pathology.svg`, scan: "CT Scan" },
  { name: "Health Checkups", image: `${IMG}/service-checkup.svg`, scan: "CT Scan" },
  { name: "Other Services", image: `${IMG}/service-other.svg`, scan: "CT Scan" },
];

const faqs = [
  {
    question: "What is a CT scan and how does it work?",
    answer:
      "A CT (Computed Tomography) scan is a non-invasive imaging test that uses X-rays and advanced computer technology to create detailed cross-sectional images of the body. It helps doctors examine internal organs, bones, blood vessels and tissues to detect injuries or medical conditions.",
  },
  {
    question: "Is a CT scan safe?",
    answer:
      "CT scans are generally safe, but they use a small amount of ionizing radiation. The exposure is carefully controlled and kept within safe limits. Your doctor will recommend a CT scan only when the benefits outweigh any potential risks. Pregnant women should inform their doctor beforehand.",
  },
  {
    question: "How should I prepare for a CT scan at MDRC?",
    answer:
      "Preparation depends on the type of CT scan. For scans requiring contrast dye, you may need to fast for a few hours. Wear loose, comfortable clothing and remove metal objects such as jewellery or belts. The diagnostic team will share specific instructions before the procedure.",
  },
  {
    question: "How long does a CT scan take?",
    answer:
      "Most CT scans are quick, usually lasting 10 to 30 minutes depending on the area being examined and whether contrast dye is used. In most cases, you can return to your normal activities immediately after the scan.",
  },
  {
    question: "What can I expect during the procedure?",
    answer:
      "You will lie on a motorized table that slides into the CT scanner, which is shaped like a large ring. The machine rotates around you while capturing images. The process is painless, though you may be asked to hold your breath for a few seconds. If contrast dye is used, you might feel a brief warm sensation or a metallic taste, which is normal and temporary.",
  },
];

const emptyForm = {
  name: "",
  phone: "",
  email: "",
  scan: "CT Scan",
  message: "",
  acceptedTerms: true,
};

export default function CtLandingPage() {
  const doctorGrid = useRef<HTMLDivElement>(null);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingScan, setBookingScan] = useState("CT Scan");
  const [form, setForm] = useState(emptyForm);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openBooking = (nextScan: string) => {
    setBookingScan(SCAN_TYPES.includes(nextScan) ? nextScan : "CT Scan");
    setBookingOpen(true);
  };

  const closeBooking = () => {
    setBookingOpen(false);
    setSubmitted(false);
    setForm(emptyForm);
  };

  const scrollDoctors = (direction: number) => {
    const grid = doctorGrid.current;
    if (!grid) return;
    const card = grid.querySelector(".doctor-card");
    const gap = parseFloat(getComputedStyle(grid).gap) || 18;
    const amount = card ? card.getBoundingClientRect().width + gap : 300;
    grid.scrollBy({ left: direction * amount, behavior: "smooth" });
  };

  useEffect(() => {
    if (!bookingOpen) return undefined;
    setForm({ ...emptyForm, scan: bookingScan });
    setSubmitted(false);
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeBooking();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [bookingOpen, bookingScan]);

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
    if (!/^[A-Za-z][A-Za-z .']{1,59}$/.test(name)) {
      alert("Please enter a valid name using letters only.");
      return;
    }
    if (!/^[6-9]\d{9}$/.test(phone)) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      alert("Please enter a valid email address.");
      return;
    }
    if (!form.acceptedTerms) {
      alert("Please accept the Terms And Conditions.");
      return;
    }

    setIsSubmitting(true);
    void (async () => {
      try {
        const ok = await postEnquiryWithPlainForm({
          name,
          phone,
          email: form.email.trim(),
          scan: form.scan || "CT Scan",
          message: form.message.trim(),
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
    <div className="ct-landing">
      <header className="site-header">
        <div className="container header-inner">
          <a href={SITE_URL} className="logo" aria-label="Modern Diagnostic & Research Centre">
            <img src={`${IMG}/mdrc-logo.webp`} alt="Modern Diagnostic & Research Centre" />
          </a>
          <div className="header-actions">
            <button type="button" className="btn-book" onClick={() => openBooking("CT Scan")}>
              Book Now
            </button>
            <a href={PHONE_HREF} className="header-call">
              <img src={`${IMG}/call.png`} alt="" />
              <span>{PHONE_DISPLAY}</span>
            </a>
            <a href={WHATSAPP_HREF} className="header-whatsapp" target="_blank" rel="noopener noreferrer">
              <img src={`${IMG}/whatsapp.png`} alt="" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="container hero-grid">
            <div className="hero-content">
              <h1>
                Advanced CT Scan <span>in Gurugram</span>
              </h1>
              <p className="hero-description">
                High-quality, detailed imaging on a GE Revolution EVO 128 Slice Cardiac CT Scanner, with an ultra-low radiation dose and reports by experienced radiologists.
              </p>
              <div className="hero-buttons">
                <button type="button" className="btn-book" onClick={() => openBooking("CT Scan")}>
                  Book Now
                </button>
              </div>
              <div className="hero-trust">
                <div>
                  <span className="check-icon">✓</span> 128 Slice Cardiac CT
                </div>
                <div>
                  <span className="check-icon">✓</span> Expert Radiologists
                </div>
                <div>
                  <span className="check-icon">✓</span> NCCT, 3D & Angiography
                </div>
              </div>
            </div>
            <div className="hero-visual">
              <div className="hero-image-wrapper">
                <img src={`${IMG}/ct-machine.jpg`} alt="Indian patient on a CT scanner at MDRC Gurugram" width={1400} height={1050} />
              </div>
              <div className="hero-badge">
                <span className="badge-icon">+</span>
                <div>
                  <strong>CT Scan</strong>
                  <small>128 Slice Imaging</small>
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

        <section className="section">
          <div className="container intro-grid">
            <div className="intro-copy">
              <div className="section-heading">
                <h2>CT Scan in Gurugram</h2>
              </div>
              <div className="intro-content">
                <p>
                  Modern Diagnostic & Research Centre (MDRC) provides advanced CT scan services for high-quality, detailed imaging that supports a precise medical diagnosis. Scans are performed on a GE Revolution EVO 128 Slice Cardiac CT Scanner, which uses an ultra-low dose of radiation and captures fast, ultra-clear images.
                </p>
                <p>
                  A CT (Computed Tomography) scan is a non-invasive imaging test that combines X-rays with computer technology to produce cross-sectional images of the body. It shows organs, bones, blood vessels and soft tissues with outstanding clarity, and is widely used to detect and guide treatment of medical conditions.
                </p>
                <div className="content-points">
                  <div className="content-point">
                    <span className="check-icon">✓</span> 128 Slice Cardiac CT
                  </div>
                  <div className="content-point">
                    <span className="check-icon">✓</span> Ultra-low Dose
                  </div>
                  <div className="content-point">
                    <span className="check-icon">✓</span> Expert Radiology Team
                  </div>
                </div>
              </div>
            </div>
            <div className="intro-visual">
              <img src={`${IMG}/ct-patient.jpg`} alt="Indian patient undergoing a CT scan at MDRC Gurugram" />
            </div>
          </div>
        </section>

        <section className="section section-light">
          <div className="container">
            <div className="center-heading">
              <span className="eyebrow">CT SCAN SERVICES</span>
              <h2>CT Scans We Offer</h2>
              <p>Head, chest, abdomen, sinus and KUB studies, along with other specialised CT scans at our Gurugram centre.</p>
            </div>
            <div className="scans-grid">
              {scans.map((item) => (
                <button type="button" className="scan-card" key={item.title} onClick={() => openBooking(item.scan)}>
                  <div className="scan-icon">
                    <img src={item.image} alt="" />
                  </div>
                  <div className="scan-content">
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                </button>
              ))}
            </div>
            <div className="section-cta">
              <button type="button" className="btn-book" onClick={() => openBooking("CT Scan")}>
                Book Now
              </button>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="center-heading">
              <span className="eyebrow">WHY CHOOSE MDRC</span>
              <h2>Why Choose MDRC for CT Scan in Gurugram?</h2>
              <p>128 slice imaging, expert radiologists, and accurate reports you can trust.</p>
            </div>
            <div className="feature-grid">
              {features.map((feature) => (
                <article className="feature-card" key={feature.title}>
                  <div className="feature-icon">
                    <img src={feature.image} alt="" />
                  </div>
                  <div>
                    <h3>{feature.title}</h3>
                    <p>{feature.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section section-blue-light">
          <div className="container">
            <div className="center-heading">
              <span className="eyebrow">BEFORE YOUR CT SCAN</span>
              <h2>CT Scan Preparation</h2>
              <p>Preparation depends on the scan. The MDRC team will share exact instructions when you book.</p>
            </div>
            <div className="steps-grid">
              {steps.map((step) => (
                <article className="step-card" key={step.number}>
                  <span className="step-number">{step.number}</span>
                  <div className="step-icon">
                    <img src={step.image} alt="" />
                  </div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="center-heading">
              <span className="eyebrow">OUR EXPERTS</span>
              <h2>Our Radiologists</h2>
            </div>
            <div className="doctor-slider">
              <button type="button" className="doctor-arrow doctor-arrow-left" aria-label="Previous doctors" onClick={() => scrollDoctors(-1)}>
                ‹
              </button>
              <div className="doctor-grid" ref={doctorGrid}>
                {doctors.map((doctor) => (
                  <article className="doctor-card" key={doctor.name}>
                    <div className="doctor-photo">
                      <img src={doctor.image} alt={doctor.name} />
                    </div>
                    <div className="doctor-info">
                      <h3>{doctor.name}</h3>
                      <p>{doctor.role}</p>
                    </div>
                  </article>
                ))}
              </div>
              <button type="button" className="doctor-arrow doctor-arrow-right" aria-label="Next doctors" onClick={() => scrollDoctors(1)}>
                ›
              </button>
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
                    <img src={location.image} alt={location.title} />
                  </div>
                  <div className="location-content">
                    <div className="location-top">
                      <span className="location-label">{location.label}</span>
                      <span className="location-open">
                        <span className="location-open-dot" />
                        Open Today
                      </span>
                    </div>
                    <h3>{location.title}</h3>
                    <address className="location-address">
                      <svg className="location-pin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <path d="M12 21s7-7.2 7-12a7 7 0 1 0-14 0c0 4.8 7 12 7 12z" />
                        <circle cx="12" cy="9" r="2.2" />
                      </svg>
                      <span>{location.address}</span>
                    </address>
                    <div className="location-meta">
                      {location.tags.map((tag) => (
                        <span className="location-chip" key={tag}>
                          <span className="location-chip-check">✓</span> {tag}
                        </span>
                      ))}
                    </div>
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
              <h2>Our Services</h2>
            </div>
            <div className="services-grid">
              {services.map((service) => (
                <button type="button" className="simple-service" key={service.name} onClick={() => openBooking(service.scan)}>
                  <img className="simple-service-icon" src={service.image} alt="" />
                  <span>{service.name}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="section section-dark">
          <div className="container trust-image-grid">
            <div className="trust-image-wrapper">
              <img src={`${IMG}/patient-trust.jpeg`} alt="Patient receiving diagnostic imaging care" />
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

        <section className="section" id="faq">
          <div className="container faq-container">
            <div className="center-heading">
              <span className="eyebrow">FREQUENTLY ASKED QUESTIONS</span>
              <h2>CT Scan FAQs</h2>
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
              <h2>Need a CT Scan in Gurugram?</h2>
              <p>Book NCCT, CECT, 3D and angiography scans on a 128 Slice Cardiac CT Scanner with experienced radiologists at MDRC.</p>
            </div>
            <div className="final-buttons">
              <button type="button" className="btn-book btn-white-book" onClick={() => openBooking("CT Scan")}>
                Book Now
              </button>
              <a href={PHONE_HREF} className="header-call">
                <img src={`${IMG}/call.png`} alt="" />
                <span>{PHONE_DISPLAY}</span>
              </a>
              <a href={WHATSAPP_HREF} className="header-whatsapp" target="_blank" rel="noopener noreferrer">
                <img src={`${IMG}/whatsapp.png`} alt="" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer-inner">
          <div className="footer-logo">
            <a href={SITE_URL} className="logo">
              <img src={`${IMG}/mdrc-logo.webp`} alt="Modern Diagnostic & Research Centre" />
            </a>
          </div>
          <div className="footer-meta">
            <a className="footer-link" href={`${SITE_URL}/page/privacy-policy`} target="_blank" rel="noopener noreferrer">
              Privacy Policy
            </a>
            <p>© 2026 All right reserved. Modern Diagnostic & Research Centre Limited.</p>
          </div>
        </div>
      </footer>

      <div className="mobile-sticky-cta">
        <a href={PHONE_HREF} className="header-call">
          <img src={`${IMG}/call.png`} alt="" />
          <span>{PHONE_DISPLAY}</span>
        </a>
        <button type="button" className="btn-book" onClick={() => openBooking("CT Scan")}>
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
              <>
                <p className="eyebrow">BOOK APPOINTMENT</p>
                <h2 id="booking-title">Book your scan</h2>
                <p className="booking-lead">Share your details and we will help you schedule at the nearest MDRC centre.</p>
                <form className="booking-form" onSubmit={submitBooking}>
                  <label>
                    <span className="field-label is-required">Full Name</span>
                    <input name="name" required autoComplete="name" value={form.name} onChange={update} />
                  </label>
                  <label>
                    <span className="field-label is-required">Phone Number</span>
                    <input name="phone" type="tel" required autoComplete="tel" value={form.phone} onChange={update} />
                  </label>
                  <label>
                    <span className="field-label">Email (Optional)</span>
                    <input name="email" type="email" autoComplete="email" value={form.email} onChange={update} />
                  </label>
                  <label>
                    <span className="field-label">Scan Type</span>
                    <select name="scan" value={form.scan} onChange={update}>
                      {SCAN_TYPES.map((type) => (
                        <option key={type}>{type}</option>
                      ))}
                    </select>
                  </label>
                  <label className="booking-full">
                    <span className="field-label">Message (Optional)</span>
                    <textarea name="message" rows={3} value={form.message} onChange={update} />
                  </label>
                  <label className="booking-terms booking-full">
                    <input type="checkbox" name="terms" checked={form.acceptedTerms} onChange={update} required />
                    <span>
                      I agree to the{" "}
                      <a href={`${SITE_URL}/page/privacy-policy`} target="_blank" rel="noopener noreferrer">
                        Terms And Conditions
                      </a>
                    </span>
                  </label>
                  <button type="submit" className="btn-book booking-submit" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit Request"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
