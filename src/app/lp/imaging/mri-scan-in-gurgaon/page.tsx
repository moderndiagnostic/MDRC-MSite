"use client";

import { useEffect, useRef, useState, type ChangeEvent, type FormEvent, type KeyboardEvent, type RefObject } from "react";

const SITE_URL = "https://www.mdrcindia.com";
const PHONE_DISPLAY = "8920 300 300";
const PHONE_HREF = "tel:8920300300";
const WHATSAPP_MESSAGE = `Hello MDRC Team 👋
I’d like to know more about your diagnostic tests and services. Please assist me.`;
const WHATSAPP_HREF = `https://wa.me/918586988847?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
const IOS_APP = "https://apps.apple.com/in/app/modern-diagnostic-health-app/id6504657715";
const ANDROID_APP = "https://play.google.com/store/apps/details?id=com.mdrcindia.booking";

const SCAN_TYPES = [
  "MRI",
  "PET-CT / SPECT-CT",
  "CT Scan",
  "Ultrasound",
  "CBCT",
  "Mammography",
  "X-Ray",
  "Others",
];

const mriScans = [
  {
    title: "Brain MRI",
    description: "Detailed imaging of the brain and neurological structures.",
    image: "/assets/images/lp/mri-scan-in-gurgaon/mri-scan-icons/brain-mri.png",
  },
  {
    title: "Spine MRI",
    description: "Detailed evaluation of the spine, discs, and surrounding structures.",
    image: "/assets/images/lp/mri-scan-in-gurgaon/mri-scan-icons/spine-mri.png",
  },
  {
    title: "Knee MRI",
    description: "Imaging to assess the knee joint, cartilage, and soft tissues.",
    image: "/assets/images/lp/mri-scan-in-gurgaon/mri-scan-icons/knee-mri.png",
  },
  {
    title: "Shoulder MRI",
    description: "Evaluation of the shoulder joint, muscles, tendons, and ligaments.",
    image: "/assets/images/lp/mri-scan-in-gurgaon/mri-scan-icons/shoulder-mri.png",
  },
  {
    title: "Abdomen MRI",
    description: "Detailed imaging of abdominal organs and soft tissues.",
    image: "/assets/images/lp/mri-scan-in-gurgaon/mri-scan-icons/abdomen-mri.png",
  },
  {
    title: "MR Angiography (MRA)",
    description: "Imaging of blood vessels to assess circulation and vascular conditions.",
    image: "/assets/images/lp/mri-scan-in-gurgaon/mri-scan-icons/mr-angiography-mra.png",
  },
];

const features = [
  {
    title: "3T MRI Technology",
    description: "Advanced 3T MRI technology for superior imaging precision.",
    image: "/assets/images/lp/mri-scan-in-gurgaon/why-choose-mri/3t-mri-technology.png",
  },
  {
    title: "High-resolution Imaging",
    description: "Crystal-clear, high-resolution images for accurate diagnosis.",
    image: "/assets/images/lp/mri-scan-in-gurgaon/why-choose-mri/high-resolution-imaging.png",
  },
  {
    title: "Experienced Radiologists",
    description: "Expert radiologists delivering trusted and precise interpretations.",
    image: "/assets/images/lp/mri-scan-in-gurgaon/why-choose-mri/experienced-radiologists.png",
  },
  {
    title: "Faster & Accurate Reporting",
    description: "Quick, reliable reports to support timely medical decisions.",
    image: "/assets/images/lp/mri-scan-in-gurgaon/why-choose-mri/faster-accurate-reporting.png",
  },
  {
    title: "Patient-friendly Environment",
    description: "A comfortable, caring, and stress-free experience for every patient.",
    image: "/assets/images/lp/mri-scan-in-gurgaon/why-choose-mri/patient-friendly-environment.png",
  },
  {
    title: "Advanced Diagnostic Expertise",
    description: "Cutting-edge diagnostic expertise backed by clinical experience.",
    image: "/assets/images/lp/mri-scan-in-gurgaon/why-choose-mri/advanced-diagnostic-expertise.png",
  },
];

const preparationSteps = [
  {
    number: "01",
    title: "Book Appointment",
    description: "Schedule your MRI at a convenient time before you visit the centre.",
    image: "/assets/images/lp/mri-scan-in-gurgaon/scanning-preparation/book-appointment.svg",
  },
  {
    number: "02",
    title: "Carry Previous Reports with Doctor Prescription",
    description: "Bring previous reports and your doctor’s prescription for the scan.",
    image: "/assets/images/lp/mri-scan-in-gurgaon/scanning-preparation/carry-previous-reports.svg",
  },
  {
    number: "03",
    title: "Inform the Radiologist",
    description: "Inform the team about implants or medical devices.",
    image: "/assets/images/lp/mri-scan-in-gurgaon/scanning-preparation/inform-the-radiologist.svg",
  },
  {
    number: "04",
    title: "Follow Instructions",
    description: "Follow fasting instructions, if applicable.",
    image: "/assets/images/lp/mri-scan-in-gurgaon/scanning-preparation/follow-instructions.svg",
  },
];

const doctors = [
  { name: "Dr. Devendra Singh Yadav", role: "Managing Director", image: "https://www.mdrcindia.com/uploads/doctor/img_6ab6293222f360.01643474.jpg" },
  { name: "Dr. Deepali Yadav", role: "Director & Sr. Consultant - Radiology", image: "https://www.mdrcindia.com/uploads/doctor/img_6ab629eb9d81b8.78874086.jpg" },
  { name: "Dr. Nitin Kumar", role: "Director & Sr. Consultant - Radiology & Imaging", image: "https://www.mdrcindia.com/uploads/doctor/img_6ab629c50e8631.06714162.jpg" },
  { name: "Dr. Rashmi Kumari", role: "Sr. Consultant Radiologist", image: "https://www.mdrcindia.com/uploads/doctor/img_6ab629adb09171.37034093.jpg" },
  { name: "Dr. Ankit Kataria", role: "Sr. Consultant Radiologist", image: "https://www.mdrcindia.com/uploads/doctor/img_6ab62b65e9e178.76656913.jpg" },
  { name: "Dr. Rajat Garg", role: "Consultant Radiologist", image: "https://www.mdrcindia.com/uploads/doctor/img_6ab62b43e47b16.91390783.jpg" },
  { name: "Dr. Padma Chauhan", role: "Consultant Radiologist", image: "https://www.mdrcindia.com/uploads/doctor/img_6ab62b30207909.87842987.jpg" },
];

const locations = [
  {
    label: "GURUGRAM - Sec 40",
    badge: "3T MRI Centre",
    title: "Modern Diagnostic & Research Centre, Sector-40",
    address: "1057P, Sector-40, Gurugram, Haryana – 122002",
    timing: "7:00 AM – 8:00 PM",
    tags: ["3T MRI", "NABL & NABH", "7 AM – 8 PM"],
    image: "/assets/images/lp/mri-scan-in-gurgaon/centres/mdrc-sector-40-3t-mri-centre.jpg",
    imagePosition: "center center",
  },
  {
    label: "GURUGRAM - New Railway Road",
    badge: "Diagnostic Hub",
    title: "Modern Diagnostic & Research Centre, NRR",
    address: "363-364/4, Sector-12, New Railway Road, Gurugram – 122001",
    timing: "Open 24×7",
    tags: ["Advanced Imaging", "NABL Accredited", "Open 24×7"],
    image: "/assets/images/lp/mri-scan-in-gurgaon/centres/mdrc-new-railway-road-centre.jpg",
    imagePosition: "center center",
  },
];

const services = [
  { name: "PET-CT / SPECT-CT", image: "/assets/images/lp/mri-scan-in-gurgaon/services/pet-ct-spect-ct.svg", scan: "PET-CT / SPECT-CT" },
  { name: "MRI", image: "/assets/images/lp/mri-scan-in-gurgaon/services/mri.svg", scan: "MRI" },
  { name: "CT Scan", image: "/assets/images/lp/mri-scan-in-gurgaon/services/ct-scan.svg", scan: "CT Scan" },
  { name: "Ultrasound", image: "/assets/images/lp/mri-scan-in-gurgaon/services/ultrasound.svg", scan: "Ultrasound" },
  { name: "X-Ray", image: "/assets/images/lp/mri-scan-in-gurgaon/services/x-ray.svg", scan: "X-Ray" },
  { name: "CBCT", image: "/assets/images/lp/mri-scan-in-gurgaon/services/cbct.svg", scan: "CBCT" },
  { name: "Mammography", image: "/assets/images/lp/mri-scan-in-gurgaon/services/mammography.svg", scan: "Mammography" },
  { name: "Pathology", image: "/assets/images/lp/mri-scan-in-gurgaon/services/pathology.svg", scan: "Others" },
  { name: "Health Checkups", image: "/assets/images/lp/mri-scan-in-gurgaon/services/health-checkups.svg", scan: "Others" },
  { name: "Other Services", image: "/assets/images/lp/mri-scan-in-gurgaon/services/other-services.svg", scan: "Others" },
];

const faqs = [
  {
    question: "What is an MRI scan?",
    answer:
      "An MRI (Magnetic Resonance Imaging) scan is an advanced, non-invasive imaging test that uses magnetic fields and radio waves to create detailed images of organs, tissues, joints, the brain, spine, and other parts of the body. It helps doctors detect and evaluate a wide range of medical conditions.",
  },
  {
    question: "How much does an MRI cost in Gurugram?",
    answer:
      "The cost of an MRI scan in Gurugram depends on the body part being examined, the type of MRI, and whether contrast is required. At MDRC India, MRI scan prices vary by examination. Contact us for the latest MRI scan price and available packages.",
  },
  {
    question: "How long does an MRI take?",
    answer:
      "Most MRI scans take approximately 20 to 60 minutes, depending on the body part being examined and the type of scan. More complex or contrast-enhanced MRI examinations may take longer.",
  },
  {
    question: "Is MRI painful?",
    answer:
      "No. An MRI scan is generally painless and non-invasive. You will need to remain still while the scan is performed. Some patients may find the enclosed space uncomfortable, but our team helps make the procedure as comfortable as possible.",
  },
  {
    question: "Can I eat before an MRI?",
    answer:
      "It depends on the type of MRI you are having. Some MRI scans require no special preparation, while certain examinations or contrast-enhanced scans may require fasting. Our team will provide you with specific preparation instructions before your appointment.",
  },
  {
    question: "Is MRI safe?",
    answer:
      "MRI is considered a safe imaging technique because it does not use ionizing radiation, unlike X-rays and CT scans. However, because MRI uses a strong magnetic field, you should inform the radiology team about any implants, metal devices, or other relevant medical information before the scan.",
  },
  {
    question: "When will I receive my MRI report?",
    answer:
      "The reporting time depends on the type and complexity of the MRI examination. MDRC India aims to provide reports promptly, and the expected reporting time will be communicated to you at the time of your appointment.",
  },
  {
    question: "Do I need a doctor's prescription?",
    answer:
      "A doctor's prescription or referral may be recommended depending on the MRI examination and your medical requirements. It is best to consult your doctor to determine whether an MRI is appropriate and which type of scan is required.",
  },
];

const emptyForm = {
  name: "",
  phone: "",
  email: "",
  scan: "MRI",
  message: "",
  acceptedTerms: true,
};

type BookingForm = typeof emptyForm;

const LANDING_ENQUIRY_API = "/lp/imaging/mri-scan-in-gurgaon/enquiry";

export default function MriScanGurugramPage() {
  const doctorGrid = useRef<HTMLDivElement>(null);
  const mriSlider = useRef<HTMLDivElement>(null);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingScan, setBookingScan] = useState("MRI");
  const [form, setForm] = useState<BookingForm>(emptyForm);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openBooking = (nextScan: string) => {
    setBookingScan(SCAN_TYPES.includes(nextScan) ? nextScan : "MRI");
    setBookingOpen(true);
  };

  const closeBooking = () => setBookingOpen(false);

  const scrollSlider = (sliderRef: RefObject<HTMLDivElement | null>, direction: number, cardSelector: string) => {
    const grid = sliderRef.current as HTMLDivElement | null;
    if (!grid) return;
    const card = grid.querySelector(cardSelector);
    const gap = parseFloat(getComputedStyle(grid).gap) || 18;
    const amount = card ? card.getBoundingClientRect().width + gap : 300;
    const maxScroll = grid.scrollWidth - grid.clientWidth;

    if (direction > 0 && grid.scrollLeft >= maxScroll - 8) {
      grid.scrollTo({ left: 0, behavior: "smooth" });
    } else if (direction < 0 && grid.scrollLeft <= 8) {
      grid.scrollTo({ left: maxScroll, behavior: "smooth" });
    } else {
      grid.scrollBy({ left: direction * amount, behavior: "smooth" });
    }
  };

  const scrollMri = (direction: number) => scrollSlider(mriSlider, direction, ".mri-scan-card");
  const scrollDoctors = (direction: number) => scrollSlider(doctorGrid, direction, ".doctor-card");

  useEffect(() => {
    const setupAutoScroll = (
      sliderRef: RefObject<HTMLDivElement | null>,
      cardSelector: string,
      intervalMs: number,
    ) => {
      const slider = sliderRef.current;
      if (!slider) return () => {};

      let isPaused = false;
      let resumeTimeout: ReturnType<typeof setTimeout> | undefined;

      const pause = () => {
        isPaused = true;
        clearTimeout(resumeTimeout);
      };

      const unpause = () => {
        isPaused = false;
      };

      const resumeLater = () => {
        clearTimeout(resumeTimeout);
        resumeTimeout = setTimeout(() => {
          isPaused = false;
        }, 2500);
      };

      slider.addEventListener("mouseenter", pause);
      slider.addEventListener("mouseleave", unpause);
      slider.addEventListener("touchstart", pause, { passive: true });
      slider.addEventListener("touchend", resumeLater, { passive: true });

      const timer = setInterval(() => {
        if (isPaused) return;
        const card = slider.querySelector(cardSelector);
        const gap = parseFloat(getComputedStyle(slider).gap) || 18;
        const amount = card ? card.getBoundingClientRect().width + gap : 300;
        const maxScroll = slider.scrollWidth - slider.clientWidth;

        if (slider.scrollLeft >= maxScroll - 10) {
          slider.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          slider.scrollBy({ left: amount, behavior: "smooth" });
        }
      }, intervalMs);

      return () => {
        clearInterval(timer);
        clearTimeout(resumeTimeout);
        slider.removeEventListener("mouseenter", pause);
        slider.removeEventListener("mouseleave", unpause);
        slider.removeEventListener("touchstart", pause);
        slider.removeEventListener("touchend", resumeLater);
      };
    };

    const cleanupMri = setupAutoScroll(mriSlider, ".mri-scan-card", 3200);
    const cleanupDoctors = setupAutoScroll(doctorGrid, ".doctor-card", 3800);

    return () => {
      cleanupMri();
      cleanupDoctors();
    };
  }, []);

  useEffect(() => {
    if (!bookingOpen) return undefined;
    setForm({ ...emptyForm, scan: bookingScan });
    setSubmitted(false);
    document.body.style.overflow = "hidden";
    const onKey = (event: globalThis.KeyboardEvent) => {
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
      const checked = event.target.checked;
      setForm((current) => ({ ...current, acceptedTerms: checked }));
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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = form.name.trim();
    const cleanPhone = form.phone.replace(/\D/g, "");

    if (!/^[A-Za-z][A-Za-z .']{1,59}$/.test(trimmedName)) {
      alert("Please enter a valid name using letters only.");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (!form.acceptedTerms) {
      alert("Please accept the Terms And Conditions.");
      return;
    }

    const fd = new FormData();
    fd.append("method", "landing_page_enquiry");
    fd.append("name", trimmedName);
    fd.append("phone", cleanPhone);
    fd.append("email", form.email.trim());
    fd.append("scan", form.scan);
    fd.append("message", form.message.trim());
    fd.append("terms", "Yes");

    setIsSubmitting(true);
    fetch(LANDING_ENQUIRY_API, {
      method: "POST",
      body: fd,
      credentials: "same-origin",
    })
      .then((res) => res.json())
      .then((res: { RESULT?: string; error_msg?: string }) => {
        if (String(res.RESULT || "").toUpperCase() === "OK") {
          setSubmitted(true);
          return;
        }
        alert(res.error_msg || "Could not submit. Please try again.");
      })
      .catch(() => {
        alert("Could not submit. Please try again.");
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <div className="mri-landing-page">
      <div className="app-shell">
      <header className="site-header">
        <div className="container header-inner">
          <a href={SITE_URL} className="logo" aria-label="Modern Diagnostic & Research Centre">
            <img src="/assets/images/lp/mri-scan-in-gurgaon/modern-diagnostic-research-centre-logo.png" alt="Modern Diagnostic & Research Centre" />
          </a>
          <div className="header-actions">
            <button type="button" className="btn-book" onClick={() => openBooking("MRI")}>
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
                Advanced MRI Scan <span>in Gurugram</span>
              </h1>
              <p className="hero-description">
                High-precision MRI imaging with advanced 3T technology and expert radiologists. Trusted for fast, dependable results.
              </p>
              <div className="hero-buttons">
                <button type="button" className="btn-book hero-primary-btn" onClick={() => openBooking("MRI")}>
                  Book Scan Now
                </button>
                <a href={PHONE_HREF} className="hero-call-btn">
                  <img src="/assets/images/lp/mri-scan-in-gurgaon/phone-call-icon.png" alt="" />
                  <span>{PHONE_DISPLAY}</span>
                </a>
              </div>
              <div className="hero-trust">
                <div className="hero-trust-item">
                  <span className="check-icon">✓</span> 3T MRI Technology
                </div>
                <div className="hero-trust-item">
                  <span className="check-icon">✓</span> Expert Radiologists
                </div>
                <div className="hero-trust-item">
                  <span className="check-icon">✓</span> Advanced Imaging
                </div>
              </div>
            </div>
            <div className="hero-visual">
              <div className="hero-image-wrapper">
                <img
                  src="/assets/images/lp/mri-scan-in-gurgaon/siemens-3t-mri-machine-gurugram.jpg"
                  alt="3T MRI Machine at MDRC Gurugram"
                  width="700"
                  height="600"
                />
              </div>
              <div className="hero-badge">
                <span className="badge-icon">3T</span>
                <div>
                  <strong>3T MRI Technology</strong>
                  <small>Ultra-Clear Advanced Imaging</small>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="trust-strip" aria-label="MDRC diagnostic credentials">
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
                <h2>MRI Scan in Gurugram</h2>
              </div>
              <div className="intro-content">
                <p>
                  Get access to advanced MRI scanning in Gurugram with high-quality imaging and accurate diagnostic support. MRI uses powerful magnetic fields and radio waves to create detailed images of organs, tissues, joints, and other structures inside the body.
                </p>
                <p>
                  At MDRC, every scan is performed in a calm, patient-friendly setting and reported by experienced radiologists. Whether your doctor has advised a brain, spine, joint, abdomen, or vascular study, Our SkyraFit <strong>3T MRI has wide bore (70 Cm) gantry, which is less claustrophobic</strong> for patients. It can take comfortably take obese patients. Its 64 channels deliver high resolution images for clear answers, so that treatment decisions are made with confidence. MRI does not use any ionising radiations.
                </p>
                <div className="content-points">
                  <div className="content-point">
                    <span className="check-icon">✓</span> Advanced MRI Technology
                  </div>
                  <div className="content-point">
                    <span className="check-icon">✓</span> Experienced Radiology Team
                  </div>
                  <div className="content-point">
                    <span className="check-icon">✓</span> Patient-focused Experience
                  </div>
                </div>
              </div>
            </div>
            <div className="intro-visual">
              <img src="/assets/images/lp/mri-scan-in-gurgaon/patient-undergoing-mri-scan.jpg" alt="Patient undergoing an MRI scan at MDRC" />
            </div>
          </div>
        </section>

        <section className="section section-light">
          <div className="container">
            <div className="center-heading">
              <span className="eyebrow">MRI SERVICES</span>
              <h2>Other MRI Scans</h2>
              <p>Our MRI services cover a wide range of diagnostic imaging needs with advanced technology and expert care.</p>
            </div>
            <div className="mri-slider">
              <button
                type="button"
                className="slider-arrow mri-arrow-left"
                aria-label="Previous MRI scans"
                onClick={() => scrollMri(-1)}
              >
                ‹
              </button>
              <div className="mri-scans-slider" ref={mriSlider}>
                {mriScans.map((scan) => (
                  <article
                    className="mri-scan-card"
                    key={scan.title}
                    onClick={() => openBooking("MRI")}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e: KeyboardEvent<HTMLElement>) => {
                      if (e.key === "Enter" || e.key === " ") openBooking("MRI");
                    }}
                  >
                    <div className="mri-scan-icon">
                      <img src={scan.image} alt="" />
                    </div>
                    <div className="mri-scan-content">
                      <h3>{scan.title}</h3>
                      <p>{scan.description}</p>
                    </div>
                  </article>
                ))}
              </div>
              <button
                type="button"
                className="slider-arrow mri-arrow-right"
                aria-label="Next MRI scans"
                onClick={() => scrollMri(1)}
              >
                ›
              </button>
            </div>
            <div className="section-cta">
              <button type="button" className="btn-book" onClick={() => openBooking("MRI")}>
                Book Now
              </button>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="center-heading">
              <span className="eyebrow">WHY CHOOSE MDRC</span>
              <h2>Why Choose Our MRI Centre?</h2>
              <p>Advanced technology, expert care, and accurate results you can trust.</p>
            </div>
            <div className="feature-grid">
              {features.map((feature) => (
                <div className="feature-card" key={feature.title}>
                  <div className="feature-icon">
                    <img src={feature.image} alt="" />
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
              <span className="eyebrow">BEFORE YOUR MRI</span>
              <h2>MRI Scan Preparation</h2>
              <p>Follow simple preparation guidelines to ensure a safe, smooth, and accurate scan.</p>
            </div>
            <div className="steps-grid">
              {preparationSteps.map((step) => (
                <div className="step-card" key={step.number}>
                  <span className="step-number">{step.number}</span>
                  <div className="step-icon">
                    <img src={step.image} alt="" />
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
                    <img
                      src={location.image}
                      alt={location.title}
                      style={{ objectPosition: location.imagePosition || "center center" }}
                    />
                    {location.badge && (
                      <span className="location-img-badge">{location.badge}</span>
                    )}
                  </div>
                  <div className="location-content">
                    <div className="location-meta-row">
                      <span className="location-label">{location.label}</span>
                      <span className="location-status">
                        <span className="status-dot"></span>
                        Open Today
                      </span>
                    </div>
                    <h3>{location.title}</h3>
                    <address className="location-address">
                      <svg className="location-pin-icon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                        <circle cx="12" cy="9" r="2.5" />
                      </svg>
                      <span>{location.address}</span>
                    </address>
                    {location.tags && (
                      <div className="location-tags">
                        {location.tags.map((tag) => (
                          <span key={tag} className="location-tag">
                            ✓ {tag}
                          </span>
                        ))}
                      </div>
                    )}
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
                <button
                  type="button"
                  className="simple-service"
                  key={service.name}
                  onClick={() => openBooking(service.scan)}
                >
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
              <img src="/assets/images/lp/mri-scan-in-gurgaon/patient-diagnostic-imaging-care.jpg" alt="Patient receiving diagnostic imaging care at MDRC" />
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
              <h2>MRI Scan FAQs</h2>
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
              <h2>Need an MRI Scan in Gurugram?</h2>
              <p>
                Book your MRI scan at MDRC India and get access to advanced diagnostic imaging with experienced radiology professionals.
              </p>
            </div>
            <div className="final-buttons">
              <button type="button" className="btn-book btn-white-book" onClick={() => openBooking("MRI")}>
                Book Now
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer-inner">
          <div className="footer-logo">
            <a href={SITE_URL} className="logo">
              <img src="/assets/images/lp/mri-scan-in-gurgaon/modern-diagnostic-research-centre-logo.png" alt="Modern Diagnostic & Research Centre" />
            </a>
          </div>
          <div className="footer-meta">
            <a className="footer-link" href={`${SITE_URL}/page/privacy-policy`} target="_blank" rel="noopener noreferrer">
              Privacy Policy
            </a>
            <p>© 2026, All rights reserved. Modern Diagnostic & Research Centre Limited.</p>
          </div>
        </div>
      </footer>

      <nav className="mobile-sticky-cta" aria-label="Quick contact actions">
        <a href={PHONE_HREF} className="sticky-btn sticky-call" aria-label="Call MDRC">
          <img src="/assets/images/lp/mri-scan-in-gurgaon/phone-call-icon.png" alt="" />
          <span>{PHONE_DISPLAY}</span>
        </a>
        <a href={WHATSAPP_HREF} className="sticky-btn sticky-whatsapp" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp MDRC">
          <img src="/assets/images/lp/mri-scan-in-gurgaon/whatsapp-icon.png" alt="" />
          <span>WhatsApp</span>
        </a>
      </nav>
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
                <div className="success-check" aria-hidden="true">
                  <span>✓</span>
                </div>
                <h2>Thank you!</h2>
                <p>
                  Your scan booking request has been sent successfully. Our team will contact you shortly to confirm your appointment.
                </p>
                <div className="app-download">
                  <strong>Download our MDRC India Health App</strong>
                  <div className="app-links">
                    <a className="app-link" href={IOS_APP} target="_blank" rel="noopener noreferrer">
                      Download on iOS
                    </a>
                    <a className="app-link" href={ANDROID_APP} target="_blank" rel="noopener noreferrer">
                      Get it on Android
                    </a>
                  </div>
                </div>
                <button type="button" className="btn-book" onClick={closeBooking}>
                  Done
                </button>
              </div>
            ) : (
              <>
                <p className="eyebrow">BOOK APPOINTMENT</p>
                <h2 id="booking-title">Book your scan</h2>
                <p className="booking-lead">
                  Share your details and we will help you schedule at the nearest MDRC centre.
                </p>
                <form className="booking-form" onSubmit={handleSubmit}>
                  <label>
                    <span>
                      Full Name <span style={{ color: "#dc2626", fontWeight: "700" }}>*</span>
                    </span>
                    <input
                      name="name"
                      value={form.name}
                      onChange={update}
                      placeholder="Enter your name"
                      required
                      autoComplete="name"
                    />
                  </label>
                  <label>
                    <span>
                      Phone Number <span style={{ color: "#dc2626", fontWeight: "700" }}>*</span>
                    </span>
                    <input
                      name="phone"
                      type="tel"
                      inputMode="numeric"
                      pattern="[0-9]{10}"
                      maxLength={10}
                      value={form.phone}
                      onChange={update}
                      placeholder="10-digit mobile number"
                      required
                      title="Please enter a valid 10-digit mobile number"
                      autoComplete="tel"
                    />
                  </label>
                  <label>
                    Email (Optional)
                    <input
                      name="email"
                      type="email"
                      inputMode="email"
                      value={form.email}
                      onChange={update}
                      placeholder="yourname@gmail.com"
                      autoComplete="email"
                    />
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
                    <textarea
                      name="message"
                      rows={3}
                      value={form.message}
                      onChange={update}
                      placeholder="Any specific instructions or doctor's prescription details..."
                    />
                  </label>
                  <label className="booking-terms booking-full">
                    <input
                      type="checkbox"
                      name="acceptedTerms"
                      checked={form.acceptedTerms}
                      onChange={update}
                    />
                    <span className="booking-terms-box" aria-hidden="true" />
                    <span className="booking-terms-text">
                      I agree to the{" "}
                      <a
                        href={`${SITE_URL}/page/privacy-policy`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(event) => event.stopPropagation()}
                      >
                        Terms &amp; Conditions
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
    </div>
  );
}
