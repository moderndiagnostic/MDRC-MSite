"use client";

import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { postEnquiryWithPlainForm } from "@/lib/postLandingEnquiryBrowser";

const SITE_URL = "https://www.mdrcindia.com";
const PHONE_DISPLAY = "8920 300 300";
const PHONE_HREF = "tel:+918920300300";
const IMG = "/assets/images/lp/all-scans";
const DEFAULT_SCAN = "MRI";

const SCAN_TYPES = ["MRI", "PET-CT / SPECT-CT", "CT Scan", "Ultrasound", "CBCT", "Mammography", "X-Ray", "Others"];

const scans = [
  {
    title: "MRI Scan",
    description: "3T wide-bore MRI for brain, spine, joints, abdomen and vascular studies.",
    image: `${IMG}/services/icon-mri.svg`,
  },
  {
    title: "CT Scan",
    description: "128 slice CT for head, chest, abdomen, PNS, KUB and CT coronary angiography.",
    image: `${IMG}/services/icon-ct.svg`,
  },
  {
    title: "PET-CT Scan",
    description: "Whole body FDG, PSMA, DOTA and DOPA PET-CT for cancer diagnosis and staging.",
    image: `${IMG}/services/icon-petct.svg`,
  },
  {
    title: "SPECT Scan",
    description: "Functional 3D imaging of heart, brain and bone activity using a gamma camera.",
    image: `${IMG}/services/icon-petct.svg`,
  },
  {
    title: "Ultrasound & Doppler",
    description: "Abdomen, pelvis, pregnancy, colour Doppler and high-resolution ultrasound scans.",
    image: `${IMG}/services/icon-ultrasound.svg`,
  },
  {
    title: "Digital X-Ray",
    description: "Quick digital X-ray imaging of chest, bones, joints, spine and abdomen.",
    image: `${IMG}/services/icon-xray.svg`,
  },
  {
    title: "Mammography",
    description: "Breast imaging for screening and early detection of breast conditions.",
    image: `${IMG}/services/icon-mammography.svg`,
  },
  {
    title: "CBCT",
    description: "3D dental and TMJ imaging, OPG and cephalograms for dental planning.",
    image: `${IMG}/services/icon-cbct.svg`,
  },
  {
    title: "Bone Densitometry (DEXA)",
    description: "Bone density testing to assess osteoporosis and fracture risk.",
    image: `${IMG}/services/icon-other.svg`,
  },
];

const features = [
  {
    title: "All Scans Under One Roof",
    description: "3T MRI, 128 slice CT, PET-CT, SPECT, ultrasound, X-ray and more at one centre.",
    image: `${IMG}/why-choose-mri/3t-mri-technology.webp`,
  },
  {
    title: "High-resolution Imaging",
    description: "Crystal-clear, high-resolution images for accurate diagnosis.",
    image: `${IMG}/why-choose-mri/high-resolution-imaging.webp`,
  },
  {
    title: "Experienced Radiologists",
    description: "Expert radiologists delivering trusted and precise interpretations.",
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
    title: "NABH Accredited Centres",
    description: "NABH accredited imaging centres that assure reliable reports.",
    image: `${IMG}/why-choose-mri/advanced-diagnostic-expertise.webp`,
  },
];

const steps = [
  {
    number: "01",
    title: "Book Appointment",
    description: "Schedule your scan at a convenient time before you visit the centre.",
    image: `${IMG}/scan-preparation/icon-book-appointment.svg`,
  },
  {
    number: "02",
    title: "Carry Previous Reports with Doctor Prescription",
    description: "Bring previous reports and your doctor’s prescription for the scan.",
    image: `${IMG}/scan-preparation/icon-carry-previous-reports.svg`,
  },
  {
    number: "03",
    title: "Inform the Radiologist",
    description: "Inform the team about pregnancy, implants, allergies or contrast reactions.",
    image: `${IMG}/scan-preparation/icon-inform-radiologist.svg`,
  },
  {
    number: "04",
    title: "Follow Instructions",
    description: "Follow fasting or full-bladder instructions for your scan, if applicable.",
    image: `${IMG}/scan-preparation/icon-follow-instructions.svg`,
  },
];

const doctors = [
  {
    name: "Dr. Devendra Singh Yadav",
    role: "Managing Director",
    image: `${SITE_URL}/uploads/doctor/img_6ab6293222f360.01643474.jpg`,
  },
  {
    name: "Dr. Deepali Yadav",
    role: "Director & Sr. Consultant - Radiology",
    image: `${SITE_URL}/uploads/doctor/img_6ab629eb9d81b8.78874086.jpg`,
  },
  {
    name: "Dr. Nitin Kumar",
    role: "Director & Sr. Consultant - Radiology & Imaging",
    image: `${IMG}/doctors/dr-nitin-kumar-director-sr-consultant-radiology-imaging.webp`,
  },
  {
    name: "Dr. Rashmi Kumari",
    role: "Sr. Consultant Radiologist",
    image: `${IMG}/doctors/dr-rashmi-kumari-sr-consultant-radiologist.webp`,
  },
  {
    name: "Dr. Ankit Kataria",
    role: "Sr. Consultant Radiologist",
    image: `${IMG}/doctors/dr-ankit-kataria-sr-consultant-radiologist.webp`,
  },
  {
    name: "Dr. Garima Yadav",
    role: "Consultant Radiologist",
    image: `${IMG}/doctors/dr-garima-yadav-consultant-radiologist.webp`,
  },
  {
    name: "Dr. Rajat Garg",
    role: "Consultant Radiologist",
    image: `${IMG}/doctors/dr-rajat-garg-consultant-radiologist.webp`,
  },
  {
    name: "Dr. Padma Chauhan",
    role: "Consultant Radiologist",
    image: `${IMG}/doctors/dr-padma-chauhan-consultant-radiologist.webp`,
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
  { name: "PET-CT / SPECT-CT", image: `${IMG}/services/icon-petct.svg`, scan: "PET-CT / SPECT-CT" },
  { name: "MRI", image: `${IMG}/services/icon-mri.svg`, scan: "MRI" },
  { name: "CT Scan", image: `${IMG}/services/icon-ct.svg`, scan: "CT Scan" },
  { name: "X-Ray", image: `${IMG}/services/icon-xray.svg`, scan: "X-Ray" },
  { name: "Ultrasound", image: `${IMG}/services/icon-ultrasound.svg`, scan: "Ultrasound" },
  { name: "CBCT", image: `${IMG}/services/icon-cbct.svg`, scan: "CBCT" },
  { name: "Mammography", image: `${IMG}/services/icon-mammography.svg`, scan: "Mammography" },
  { name: "Pathology", image: `${IMG}/services/icon-pathology.svg`, scan: "Others" },
  { name: "Health Checkups", image: `${IMG}/services/icon-checkup.svg`, scan: "Others" },
  { name: "Other Services", image: `${IMG}/services/icon-other.svg`, scan: "Others" },
];

const faqs = [
  {
    question: "Which radiology scans are available at MDRC Gurugram?",
    answer:
      "MDRC offers MRI, CT, PET-CT, SPECT, Ultrasound and Doppler, Digital X-Ray, Mammography, CBCT and Bone Densitometry (DEXA) scans at its NABH accredited imaging centres in Gurugram.",
  },
  {
    question: "How much does a radiology scan cost in Gurugram?",
    answer:
      "The cost depends on the type of scan, the body part being examined and whether contrast is required. Contact us for the latest scan prices and available packages.",
  },
  {
    question: "Do I need to come empty stomach for my scan?",
    answer:
      "It depends on the scan. Upper abdomen and whole abdomen CT scans require overnight fasting, and some ultrasound and contrast studies may also need fasting. Routine X-rays generally need no preparation. Our team will share specific instructions when you book.",
  },
  {
    question: "When do I need a full bladder?",
    answer:
      "Lower abdomen, whole abdomen, KUB and early pregnancy ultrasound examinations generally require a full bladder. Drink plenty of water 1 to 2 hours before the examination and do not pass urine until the scan.",
  },
  {
    question: "What should I know about contrast scans?",
    answer:
      "Some CT and MRI examinations need contrast. Please bring kidney function reports such as serum creatinine, and inform us about any drug or contrast allergy, diabetes and the medicines you are taking.",
  },
  {
    question: "Can pregnant women undergo X-ray or CT scans?",
    answer:
      "Pregnant women are advised not to undergo X-ray based investigations such as X-ray, OPG, CT scan or mammography. If your clinician requires one, please inform the radiologist about your pregnancy status. A pregnancy ultrasound requires a photo ID, an original signed prescription and, in Haryana, an ABHA ID.",
  },
  {
    question: "When will I receive my scan report?",
    answer:
      "The reporting time depends on the type and complexity of the scan. MDRC provides online reports, and the expected reporting time will be communicated to you at the time of your appointment.",
  },
  {
    question: "Do I need a doctor's prescription?",
    answer:
      "A doctor's prescription is recommended for most scans and is mandatory for pregnancy ultrasound. Please bring your prescription and previous reports to your appointment.",
  },
];

const emptyForm = {
  name: "",
  phone: "",
  email: "",
  scan: DEFAULT_SCAN,
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

export default function AllScansLandingPage() {
  const doctorGrid = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const termsRef = useRef<HTMLInputElement>(null);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openBooking = (scan?: string) => {
    const next = scan && SCAN_TYPES.includes(scan) ? scan : DEFAULT_SCAN;
    setForm({ ...emptyForm, scan: next });
    setSubmitted(false);
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
    const gap = parseFloat(getComputedStyle(grid).gap) || 20;
    const amount = card ? card.getBoundingClientRect().width + gap : 300;
    grid.scrollBy({ left: direction * amount, behavior: "smooth" });
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

    setIsSubmitting(true);
    void (async () => {
      try {
        const ok = await postEnquiryWithPlainForm({
          name,
          phone,
          email,
          scan: form.scan || DEFAULT_SCAN,
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
    <div className="allscans-landing">
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
              <h1>
                Advanced Diagnostic Imaging <span>in Gurugram</span>
              </h1>
              <p className="hero-description">
                MRI, CT, PET-CT, SPECT, Ultrasound, Digital X-Ray, Mammography, CBCT and Bone Densitometry, all under one roof with expert radiologists.
              </p>
              <div className="hero-buttons">
                <button type="button" className="btn-book" onClick={() => openBooking()}>
                  Book Now
                </button>
              </div>
              <div className="hero-trust">
                <div>
                  <span className="check-icon">✓</span> NABH Accredited Imaging
                </div>
                <div>
                  <span className="check-icon">✓</span> Expert Radiologists
                </div>
                <div>
                  <span className="check-icon">✓</span> All Scans Under One Roof
                </div>
              </div>
            </div>
            <div className="hero-visual">
              <div className="hero-image-wrapper">
                <img
                  src={`${IMG}/advanced-mri-scan-gurugram-hero.webp`}
                  alt="Radiology and imaging scans in Gurugram"
                  width={1024}
                  height={1024}
                  fetchPriority="high"
                />
              </div>
              <div className="hero-badge">
                <span className="badge-icon">+</span>
                <div>
                  <strong>3T MRI &amp; 128 Slice CT</strong>
                  <small>Advanced Imaging</small>
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
                <h2>Radiology &amp; Imaging in Gurugram</h2>
              </div>
              <div className="intro-content">
                <p>
                  Our imaging centres in Gurugram are among the NABH accredited imaging centres, which assures reliable reports. From routine X-rays and ultrasounds to advanced MRI, CT, PET-CT and SPECT studies, MDRC offers advanced medical imaging procedures for your health diagnosis, all under one roof.
                </p>
                <p>
                  Every scan is performed in a calm, patient-friendly setting and reported by experienced radiologists. Our <b>SkyraFit 3T MRI has a wide bore (70 cm) gantry</b> that is less claustrophobic, our <b>128 slice CT</b> supports cardiac and vascular studies, and our PET-CT offers FDG, PSMA, DOTA and DOPA protocols, so that treatment decisions are made with confidence.
                </p>
                <div className="content-points">
                  <div className="content-point">
                    <span className="check-icon">✓</span> NABH Accredited Centres
                  </div>
                  <div className="content-point">
                    <span className="check-icon">✓</span> Experienced Radiology Team
                  </div>
                  <div className="content-point">
                    <span className="check-icon">✓</span> Online Reports
                  </div>
                </div>
              </div>
            </div>
            <div className="intro-visual">
              <img
                src={`${IMG}/img/ct-patient.jpg`}
                alt="Indian patient undergoing a radiology scan at MDRC Gurugram"
                width={1600}
                height={900}
                loading="lazy"
              />
            </div>
          </div>
        </section>

        <section className="section section-light">
          <div className="container">
            <div className="center-heading">
              <span className="eyebrow">RADIOLOGY SERVICES</span>
              <h2>Our Radiology Scans</h2>
              <p>Our imaging services cover a wide range of diagnostic needs with advanced technology and expert care.</p>
            </div>
            <div className="mri-scans-grid">
              {scans.map((item) => (
                <article className="mri-scan-card" key={item.title}>
                  <div className="mri-scan-icon">
                    <img src={item.image} alt="" width={52} height={52} loading="lazy" />
                  </div>
                  <div className="mri-scan-content">
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                </article>
              ))}
            </div>
            <div className="section-cta">
              <button type="button" className="btn-book" onClick={() => openBooking()}>
                Book Now
              </button>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="center-heading">
              <span className="eyebrow">WHY CHOOSE MDRC</span>
              <h2>Why Choose Our Imaging Centre?</h2>
              <p>Advanced technology, expert care, and accurate results you can trust.</p>
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

        <section className="section section-blue-light">
          <div className="container">
            <div className="center-heading">
              <span className="eyebrow">BEFORE YOUR SCAN</span>
              <h2>Scan Preparation</h2>
              <p>Follow simple preparation guidelines to ensure a safe, smooth, and accurate scan.</p>
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
        </section>

        <section className="section">
          <div className="container">
            <div className="center-heading">
              <span className="eyebrow">OUR EXPERTS</span>
              <h2>Our Radiologists</h2>
            </div>
            <div className="doctor-slider">
              <button
                type="button"
                className="doctor-arrow doctor-arrow-left"
                aria-label="Previous doctors"
                onClick={() => scrollDoctors(-1)}
              >
                ‹
              </button>
              <div className="doctor-grid" ref={doctorGrid}>
                {doctors.map((doctor) => (
                  <article className="doctor-card" key={doctor.name}>
                    <div className="doctor-photo">
                      <img src={doctor.image} alt={doctor.name} loading="lazy" />
                    </div>
                    <div className="doctor-info">
                      <h3>{doctor.name}</h3>
                      <p>{doctor.role}</p>
                    </div>
                  </article>
                ))}
              </div>
              <button
                type="button"
                className="doctor-arrow doctor-arrow-right"
                aria-label="Next doctors"
                onClick={() => scrollDoctors(1)}
              >
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
              <h2>Our Services</h2>
            </div>
            <div className="services-grid">
              {services.map((service) => (
                <button type="button" className="simple-service" key={service.name} onClick={() => openBooking(service.scan)}>
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
              <h2>Radiology Scan FAQs</h2>
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
              <h2>Need a Radiology Scan in Gurugram?</h2>
              <p>
                Book your scan at MDRC India and get access to advanced diagnostic imaging with experienced radiology professionals.
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
                <h2 id="booking-title">Book your scan</h2>
                <p className="booking-lead">Share your details and we will help you schedule at the nearest MDRC centre.</p>
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
                  <label>
                    Scan Type
                    <select name="scan" value={form.scan} onChange={update}>
                      {SCAN_TYPES.map((type) => (
                        <option key={type}>{type}</option>
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
