"use client";

import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { postEnquiryWithPlainForm } from "@/lib/postLandingEnquiryBrowser";

const SITE_URL = "https://www.mdrcindia.com";
const PHONE_DISPLAY = "8920 300 300";
const PHONE_HREF = "tel:+918920300300";
const WHATSAPP_MESSAGE = `Hello MDRC Team 👋
I’d like to know more about your diagnostic tests and services. Please assist me.`;
const WHATSAPP_HREF = `https://wa.me/918586988847?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
const IMG = "/assets/images/lp/ultrasound-test-in-gurgaon";

const SCAN_TYPES = [
  "Ultrasound",
  "Whole Abdomen Ultrasound",
  "KUB Ultrasound",
  "Pelvic Ultrasound",
  "Obstetric / Pregnancy Scan",
  "Color Doppler",
  "Breast Ultrasound",
  "Thyroid Ultrasound",
  "TVS (Transvaginal)",
  "Fetal Echocardiography",
  "PET-CT",
  "MRI",
  "CT Scan",
  "CBCT",
  "Mammography",
  "X-Ray",
  "Others",
];

const scans = [
  {
    title: "Whole Abdomen Ultrasound",
    description: "Evaluates liver, gallbladder, pancreas, kidneys, spleen and other abdominal organs.",
    image: `${IMG}/abdomen.svg`,
    scan: "Whole Abdomen Ultrasound",
  },
  {
    title: "KUB Ultrasound",
    description: "Focused imaging of the kidneys, ureters and bladder for stones, swelling and related issues.",
    image: `${IMG}/kub.svg`,
    scan: "KUB Ultrasound",
  },
  {
    title: "Obstetric / Level I & II Scan",
    description: "Pregnancy scans for fetal well-being, growth and anomaly screening, including 2D imaging.",
    image: `${IMG}/obstetric.svg`,
    scan: "Obstetric / Pregnancy Scan",
  },
  {
    title: "Color Doppler",
    description: "Assesses blood flow in fetal, carotid, limb, renal, pelvic and abdominal vessels.",
    image: `${IMG}/doppler.svg`,
    scan: "Color Doppler",
  },
  {
    title: "Breast & Thyroid Ultrasound",
    description: "High-resolution small-parts imaging for breast, thyroid, testis and musculoskeletal evaluation.",
    image: `${IMG}/breast.svg`,
    scan: "Breast Ultrasound",
  },
  {
    title: "Pelvic / TVS Ultrasound",
    description: "Pelvic, transvaginal and follicular studies for reproductive and gynaecological assessment.",
    image: `${IMG}/tvs.svg`,
    scan: "TVS (Transvaginal)",
  },
];

const features = [
  {
    title: "Samsung V7 Ultrasound",
    description: "High-end 2D and 3D imaging with excellent colour sensitivity for precise diagnosis.",
    image: `${IMG}/feature-samsung.png`,
  },
  {
    title: "High-resolution Imaging",
    description: "Crystal-clear real-time images of organs, pregnancy and blood flow.",
    image: `${IMG}/feature-resolution.png`,
  },
  {
    title: "Experienced Team",
    description: "Expert radiologists delivering accurate, trusted ultrasound interpretations.",
    image: `${IMG}/feature-radiologists.png`,
  },
  {
    title: "Faster & Accurate Reporting",
    description: "Quick, reliable reports to support timely medical decisions.",
    image: `${IMG}/feature-reporting.png`,
  },
  {
    title: "Patient-friendly Environment",
    description: "A comfortable, caring, and stress-free experience for every patient.",
    image: `${IMG}/feature-patient.png`,
  },
  {
    title: "Radiation-free Safety",
    description: "No ionizing radiation — suitable for children, adults and pregnancy scans.",
    image: `${IMG}/feature-safety.png`,
  },
];

const steps = [
  {
    number: "01",
    title: "Book Appointment",
    description: "Schedule your ultrasound at a convenient time before you visit the centre.",
    image: `${IMG}/prep-book.svg`,
  },
  {
    number: "02",
    title: "Carry Previous Reports with Doctor Prescription",
    description: "Bring previous reports and your doctor’s prescription. Pregnancy scans also need a photo ID.",
    image: `${IMG}/prep-reports.svg`,
  },
  {
    number: "03",
    title: "Share Medical History",
    description: "Inform the team about pregnancy, recent surgery, implants or any special clinical notes.",
    image: `${IMG}/prep-history.svg`,
  },
  {
    number: "04",
    title: "Follow Fasting / Bladder Instructions",
    description: "Abdomen scans may need fasting. Pelvic, KUB and early pregnancy scans often need a full bladder.",
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
    highlight: "Ultrasound Available",
    tags: ["NABL & NABH", "7:00 AM – 8:00 PM"],
  },
  {
    label: "GURGAON - New Railway Road",
    title: "Modern Diagnostic & Research Centre, NRR, Gurgaon",
    address: "363-364/4, Sector-12, New Railway Road, Gurgaon – 122001, Haryana, India",
    image: `${IMG}/lab-nrr.jpg`,
    tags: ["Ultrasound Available", "NABL & NABH", "Open 24×7"],
  },
];

const services = [
  { name: "Ultrasound", image: `${IMG}/service-ultrasound.svg`, scan: "Ultrasound" },
  { name: "PET-CT", image: `${IMG}/service-petct.svg`, scan: "PET-CT" },
  { name: "MRI", image: `${IMG}/service-mri.svg`, scan: "MRI" },
  { name: "CT Scan", image: `${IMG}/service-ct.svg`, scan: "CT Scan" },
  { name: "X-Ray", image: `${IMG}/service-xray.svg`, scan: "X-Ray" },
  { name: "CBCT", image: `${IMG}/service-cbct.svg`, scan: "CBCT" },
  { name: "Mammography", image: `${IMG}/service-mammo.svg`, scan: "Mammography" },
  { name: "Pathology", image: `${IMG}/service-pathology.svg`, scan: "Ultrasound" },
  { name: "Health Checkups", image: `${IMG}/service-checkup.svg`, scan: "Ultrasound" },
  { name: "Other Services", image: `${IMG}/service-other.svg`, scan: "Ultrasound" },
];

const faqs = [
  {
    question: "What is an ultrasound scan?",
    answer:
      "An ultrasound (sonography) uses high-frequency sound waves to create live images of organs, tissues, pregnancy and blood flow. It does not use X-rays or ionizing radiation, so it is widely used for patients of all ages.",
  },
  {
    question: "Is ultrasound safe?",
    answer:
      "Yes. Ultrasound is considered one of the safest imaging methods because it does not use ionizing radiation. It is commonly used during pregnancy to monitor the baby’s development.",
  },
  {
    question: "What types of ultrasound scans are offered at MDRC?",
    answer:
      "MDRC offers whole abdomen, KUB, pelvic, obstetric Level I & II and anomaly scans, color Doppler, breast ultrasound, transvaginal (TVS), follicular studies and fetal echocardiography, performed on Samsung V7 systems.",
  },
  {
    question: "How should I prepare for an ultrasound?",
    answer:
      "Upper or whole abdomen scans usually require fasting so the gallbladder can be seen clearly. Pelvic, KUB and early pregnancy scans often need a full bladder. Wear loose clothing. The MDRC team will share exact instructions at booking.",
  },
  {
    question: "How long does an ultrasound take?",
    answer: "Most ultrasound examinations take about 15 to 30 minutes, depending on the type of scan and the area being examined.",
  },
  {
    question: "Do I need a prescription for a pregnancy ultrasound?",
    answer:
      "Yes. As per government guidelines, pregnancy ultrasound requires a qualified doctor’s original prescription, a photo ID (such as Aadhaar), and a signed form at the centre.",
  },
  {
    question: "What is a color Doppler scan?",
    answer:
      "Color Doppler is a specialised ultrasound that shows how blood is flowing through veins and arteries. It is used for fetal well-being, carotid vessels, limbs, kidneys, pelvis, testis and abdominal vessels.",
  },
  {
    question: "What are Level I and Level II pregnancy scans?",
    answer:
      "These obstetric scans check fetal growth and well-being and look for congenital anomalies. Level II is commonly called the anomaly scan. 2D remains the gold standard for these scans.",
  },
];

const emptyForm = {
  name: "",
  phone: "",
  email: "",
  scan: "Ultrasound",
  message: "",
  acceptedTerms: true,
};

export default function UltrasoundLandingPage() {
  const doctorGrid = useRef<HTMLDivElement>(null);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingScan, setBookingScan] = useState("Ultrasound");
  const [form, setForm] = useState(emptyForm);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openBooking = (nextScan: string) => {
    setBookingScan(SCAN_TYPES.includes(nextScan) ? nextScan : "Ultrasound");
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
          scan: form.scan || "Ultrasound",
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
    <div className="ultrasound-landing">
      <header className="site-header">
        <div className="container header-inner">
          <a href={SITE_URL} className="logo" aria-label="Modern Diagnostic & Research Centre">
            <img src={`${IMG}/mdrc-logo.webp`} alt="Modern Diagnostic & Research Centre" />
          </a>
          <div className="header-actions">
            <button type="button" className="btn-book" onClick={() => openBooking("Ultrasound")}>
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
                Advanced Ultrasound & Colour Doppler <span>in Gurugram</span>
              </h1>
              <p className="hero-description">
                Safe, radiation-free sonography with high-resolution Samsung V7 imaging, reported by experienced radiologists.
              </p>
              <div className="hero-buttons">
                <button type="button" className="btn-book" onClick={() => openBooking("Ultrasound")}>
                  Book Now
                </button>
              </div>
              <div className="hero-trust">
                <div>
                  <span className="check-icon">✓</span> Samsung V7 Ultrasound
                </div>
                <div>
                  <span className="check-icon">✓</span> Expert Radiologists
                </div>
                <div>
                  <span className="check-icon">✓</span> Abdomen, Pregnancy & Doppler
                </div>
              </div>
            </div>
            <div className="hero-visual">
              <div className="hero-image-wrapper">
                <img src={`${IMG}/ultrasound-machine.jpg`} alt="Ultrasound scan machine for advanced imaging in Gurugram" width={1400} height={1050} />
              </div>
              <div className="hero-badge">
                <span className="badge-icon">+</span>
                <div>
                  <strong>Ultrasound</strong>
                  <small>Radiation-free Imaging</small>
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
            <div>
              <div className="section-heading">
                <h2>Ultrasound Scan in Gurugram</h2>
              </div>
              <div className="intro-content">
                <p>
                  An ultrasound scan, commonly known as sonography, is one of the safest and most frequently prescribed imaging tests. Unlike X-rays or CT scans, ultrasound does not use ionizing radiation. It uses high-frequency sound waves to generate real-time images of your internal organs, pregnancy, blood flow and soft tissues.
                </p>
                <p>
                  At MDRC Gurugram, scans are performed on advanced Samsung V7 ultrasound systems for excellent 2D and 3D imaging. From whole abdomen and KUB studies to obstetric Level I & II scans, color Doppler, breast, thyroid and TVS, every examination is reported by experienced radiologists in a calm, patient-friendly setting.
                </p>
                <div className="content-points">
                  <div className="content-point">
                    <span className="check-icon">✓</span> Radiation-free Technology
                  </div>
                  <div className="content-point">
                    <span className="check-icon">✓</span> Expert Radiology Team
                  </div>
                  <div className="content-point">
                    <span className="check-icon">✓</span> Patient-focused Experience
                  </div>
                </div>
              </div>
            </div>
            <div className="intro-visual">
              <img src={`${IMG}/ultrasound-patient.jpg`} alt="Indian patient with a radiologist during an ultrasound scan at MDRC Gurugram" />
            </div>
          </div>
        </section>

        <section className="section section-light">
          <div className="container">
            <div className="center-heading">
              <span className="eyebrow">ULTRASOUND SERVICES</span>
              <h2>Ultrasound Scans We Offer</h2>
              <p>Our ultrasound services cover abdomen, pregnancy, Doppler, breast, thyroid and specialised sonography.</p>
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
              <button type="button" className="btn-book" onClick={() => openBooking("Ultrasound")}>
                Book Now
              </button>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="center-heading">
              <span className="eyebrow">WHY CHOOSE MDRC</span>
              <h2>Why Choose Our Ultrasound Centre?</h2>
              <p>Advanced sonography, expert care, and accurate results you can trust.</p>
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
              <span className="eyebrow">BEFORE YOUR ULTRASOUND</span>
              <h2>Ultrasound Scan Preparation</h2>
              <p>Follow simple preparation guidelines to ensure a safe, smooth, and accurate scan.</p>
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
                      {location.highlight ? (
                        <span className="location-chip location-chip-highlight">
                          <span className="location-chip-check">✓</span> {location.highlight}
                        </span>
                      ) : null}
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
              <h2>Ultrasound Scan FAQs</h2>
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
              <h2>Need an Ultrasound Scan in Gurugram?</h2>
              <p>Book abdomen, pregnancy, Doppler, breast, thyroid and other ultrasound scans with experienced radiologists at MDRC.</p>
            </div>
            <div className="final-buttons">
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
        <button type="button" className="btn-book" onClick={() => openBooking("Ultrasound")}>
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
