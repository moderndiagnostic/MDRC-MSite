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
const IMG = "/assets/images/lp/pet-scan-in-gurgaon";

const SCAN_TYPES = [
  "PET-CT / SPECT-CT",
  "MRI",
  "CT Scan",
  "Ultrasound",
  "X-Ray",
  "CBCT",
  "Mammography",
  "Others",
];

const petScans = [
  {
    title: "FDG Whole Body Triple Phase PET-CT",
    description: "Advanced imaging combining metabolic PET with multi-phase diagnostic CT.",
    image: `${IMG}/pet-scan-icons/fdg-triple-phase.svg`,
    scan: "PET-CT / SPECT-CT",
  },
  {
    title: "PSMA Scan",
    description: "PSMA PET-CT for detection, staging and restaging of prostate cancer.",
    image: `${IMG}/pet-scan-icons/psma-scan.svg`,
    scan: "PET-CT / SPECT-CT",
  },
  {
    title: "DOTA PET Scan",
    description: "Specialised imaging designed primarily for neuroendocrine tumours (NETs).",
    image: `${IMG}/pet-scan-icons/dota-pet-scan.svg`,
    scan: "PET-CT / SPECT-CT",
  },
  {
    title: "FDG F18 Whole Body PET-CT",
    description: "Gold-standard whole body FDG PET-CT for cancer staging and monitoring.",
    image: `${IMG}/pet-scan-icons/fdg-whole-body.svg`,
    scan: "PET-CT / SPECT-CT",
  },
  {
    title: "DOPA Scan",
    description: "Specialised PET-CT for movement disorders and selected brain tumours.",
    image: `${IMG}/pet-scan-icons/dopa-scan.svg`,
    scan: "PET-CT / SPECT-CT",
  },
  {
    title: "SPECT-CT",
    description: "Nuclear medicine SPECT-CT for targeted functional imaging studies.",
    image: `${IMG}/pet-scan-icons/spect-ct.svg`,
    scan: "PET-CT / SPECT-CT",
  },
];

const features = [
  {
    title: "Advanced PET-CT Technology",
    description: "Hybrid PET and CT in a single scan for superior diagnostic precision.",
    image: `${IMG}/why-choose-pet/3t-mri-technology.png`,
  },
  {
    title: "High-resolution Imaging",
    description: "Crystal-clear metabolic and anatomical images for accurate diagnosis.",
    image: `${IMG}/why-choose-pet/high-resolution-imaging.png`,
  },
  {
    title: "Expert Nuclear Medicine Team",
    description: "Expert nuclear medicine team delivering trusted and precise interpretations.",
    image: `${IMG}/why-choose-pet/experienced-radiologists.png`,
  },
  {
    title: "Faster & Accurate Reporting",
    description: "Quick, reliable reports to support timely medical decisions.",
    image: `${IMG}/why-choose-pet/faster-accurate-reporting.png`,
  },
  {
    title: "Patient-friendly Environment",
    description: "A comfortable, caring, and stress-free experience for every patient.",
    image: `${IMG}/why-choose-pet/patient-friendly-environment.png`,
  },
  {
    title: "Advanced Diagnostic Expertise",
    description: "Cutting-edge diagnostic expertise backed by clinical experience.",
    image: `${IMG}/why-choose-pet/advanced-diagnostic-expertise.png`,
  },
];

const preparationSteps = [
  {
    number: "01",
    title: "Book Appointment",
    description: "Schedule your PET-CT at a convenient time before you visit the centre.",
    image: `${IMG}/scanning-preparation/book-appointment.svg`,
  },
  {
    number: "02",
    title: "Carry Previous Reports with Doctor Prescription",
    description: "Bring previous reports and your doctor’s prescription for the scan.",
    image: `${IMG}/scanning-preparation/carry-previous-reports.svg`,
  },
  {
    number: "03",
    title: "Share Medical History",
    description: "Inform the team about diabetes, pregnancy, allergies, implants or recent treatments.",
    image: `${IMG}/scanning-preparation/inform-the-radiologist.svg`,
  },
  {
    number: "04",
    title: "Follow Fasting Instructions",
    description: "FDG scans usually need 4–6 hours of fasting. Drink water as advised by the centre.",
    image: `${IMG}/scanning-preparation/follow-instructions.svg`,
  },
];

const doctors = [
  { name: "Dr. Devendra Singh Yadav", role: "Managing Director", image: `${IMG}/doctors/dr-devendra-singh-yadav-managing-director.jpg` },
  { name: "Dr. Deepali Yadav", role: "Director & Sr. Consultant - Radiology", image: "https://www.mdrcindia.com/uploads/doctor/img_6ab269e17ca900.56126854.jpg" },
  { name: "Dr. Nitin Kumar", role: "Director & Sr. Consultant - Radiology & Imaging", image: `${IMG}/doctors/dr-nitin-kumar-director-sr-consultant-radiology-imaging.jpg` },
  { name: "Dr. Rashmi Kumari", role: "Sr. Consultant Radiologist", image: `${IMG}/doctors/dr-rashmi-kumari-sr-consultant-radiologist.jpg` },
  { name: "Dr. Ankit Kataria", role: "Sr. Consultant Radiologist", image: `${IMG}/doctors/dr-ankit-kataria-sr-consultant-radiologist.jpg` },
  { name: "Dr. Rajat Garg", role: "Consultant Radiologist", image: `${IMG}/doctors/dr-rajat-garg-consultant-radiologist.jpg` },
  { name: "Dr. Padma Chauhan", role: "Consultant Radiologist", image: `${IMG}/doctors/dr-padma-chauhan-consultant-radiologist.jpg` },
];

const locations = [
  {
    label: "GURUGRAM - Sec 40",
    badge: "PET-CT Centre",
    title: "Modern Diagnostic & Research Centre, Sector-40, Gurugram",
    address: "1057P, Sector-40, Gurugram, Haryana – 122002",
    tags: ["PET-CT", "NABL & NABH", "7:00 AM – 8:00 PM"],
    image: `${IMG}/centres/mdrc-sector-40-3t-mri-centre.jpg`,
    imagePosition: "center center",
  },
  {
    label: "GURGAON - New Railway Road",
    badge: "Diagnostic Hub",
    title: "Modern Diagnostic & Research Centre, NRR, Gurgaon",
    address: "363-364/4, Sector-12, New Railway Road, Gurgaon – 122001, Haryana, India",
    tags: ["Advanced Imaging", "NABL & NABH", "Open 24×7"],
    image: `${IMG}/centres/mdrc-new-railway-road-centre.jpg`,
    imagePosition: "center center",
  },
];

const services = [
  { name: "PET-CT / SPECT-CT", image: `${IMG}/services/pet-ct-spect-ct.svg`, scan: "PET-CT / SPECT-CT", highlight: "Sec 40 Only" },
  { name: "MRI", image: `${IMG}/services/mri.svg`, scan: "MRI" },
  { name: "CT Scan", image: `${IMG}/services/ct-scan.svg`, scan: "CT Scan" },
  { name: "Ultrasound", image: `${IMG}/services/ultrasound.svg`, scan: "Ultrasound" },
  { name: "X-Ray", image: `${IMG}/services/x-ray.svg`, scan: "X-Ray" },
  { name: "CBCT", image: `${IMG}/services/cbct.svg`, scan: "CBCT" },
  { name: "Mammography", image: `${IMG}/services/mammography.svg`, scan: "Mammography" },
  { name: "Pathology", image: `${IMG}/services/pathology.svg`, scan: "Others" },
  { name: "Health Checkups", image: `${IMG}/services/health-checkups.svg`, scan: "Others" },
  { name: "Other Services", image: `${IMG}/services/other-services.svg`, scan: "Others" },
];

const faqs = [
  {
    question: "What is a PET-CT scan?",
    answer:
      "A PET-CT scan combines PET (Positron Emission Tomography) and CT (Computed Tomography) in one examination. PET shows how tissues and cells are functioning, while CT maps internal anatomy. Together they give doctors a detailed view of metabolic activity and structure, commonly used for cancer and other complex conditions.",
  },
  {
    question: "Why do I need a PET/CT scan?",
    answer:
      "Your doctor may advise PET-CT to detect or stage cancer, check whether treatment is working, look for recurrence, or evaluate selected neurological and metabolic conditions. Because it looks at both structure and cellular activity, it is especially useful when other scans need more clarity.",
  },
  {
    question: "How does PET-CT work?",
    answer:
      "A small amount of radiotracer (most often FDG, a form of sugar) is injected. Active cells, including many cancer cells, take up more tracer. After a rest period, the PET scanner detects this activity and the CT scanner captures anatomy. The images are fused for precise localisation.",
  },
  {
    question: "How long does the test take?",
    answer:
      "Plan for about 2 to 3 hours at the centre. After injection you typically rest for 45–60 minutes while the tracer circulates. The scan itself usually takes 15–30 minutes, depending on the tracer and body area.",
  },
  {
    question: "What happens after the PET scan?",
    answer:
      "You can usually resume normal activity unless the team advises otherwise. Drink extra water to help clear the tracer. Limit close contact with infants and pregnant women for several hours as instructed. Reports are typically available within 24–48 working hours.",
  },
  {
    question: "How do PET scans differ from CT and MRI scans?",
    answer:
      "CT and MRI mainly show anatomy. PET shows function — how tissues are working at a cellular level. PET-CT combines both in one appointment, which is why it is often used for cancer staging and treatment monitoring.",
  },
  {
    question: "What are the risks associated with a PET-CT scan?",
    answer:
      "PET-CT uses a small amount of radiation from the tracer and CT. The dose is kept as low as reasonably possible. Allergic reactions are uncommon. Tell the team if you are pregnant, breastfeeding, diabetic, or have kidney issues before booking.",
  },
  {
    question: "How soon can I see my PET-CT scan report?",
    answer:
      "Most PET-CT reports at MDRC are shared within 24 to 48 working hours. The expected reporting time will be confirmed at your appointment.",
  },
  {
    question: "What is a DOTA PET scan?",
    answer:
      "A DOTA PET-CT is a specialised nuclear medicine scan that uses a DOTA / NOTA tracer. It is primarily used to detect, localise and stage neuroendocrine tumours (NETs), often with higher specificity than FDG PET for these tumours.",
  },
  {
    question: "What are the benefits of DOTA PET-CT scans?",
    answer:
      "DOTA PET-CT can find NETs earlier, map disease more accurately, and help doctors plan surgery, PRRT or other targeted treatment. It also helps assess whether a known neuroendocrine tumour is active.",
  },
  {
    question: "Is a DOTA PET-CT scan safe?",
    answer:
      "Yes. Like other PET-CT studies, it uses a small, controlled amount of radiotracer. Most patients tolerate the procedure well. The nuclear medicine team will review your history and give specific precautions if needed.",
  },
  {
    question: "What do you need to do before a DOTA PET-CT scan?",
    answer:
      "Bring your doctor’s prescription and previous reports. Fasting is often not required for DOTA, but follow the instructions given at booking. Stay well hydrated, wear comfortable clothing without metal, and mention any recent treatments or pregnancy.",
  },
  {
    question: "What happens during a DOTA PET-CT scan?",
    answer:
      "A small tracer injection is given through a vein. After a rest period of about 45–60 minutes, you lie still on the scanner table while PET and CT images are acquired, usually for 15–30 minutes.",
  },
  {
    question: "What do you need to do after the procedure?",
    answer:
      "Drink plenty of fluids, empty your bladder often, and follow any contact precautions given by the centre. You can generally return to normal activity the same day unless advised otherwise.",
  },
];

const emptyForm = {
  name: "",
  phone: "",
  email: "",
  scan: "PET-CT / SPECT-CT",
  message: "",
  acceptedTerms: true,
};

type BookingForm = typeof emptyForm;

const LANDING_ENQUIRY_API = "/lp/imaging/pet-ct-scan-in-gurgaon/enquiry";

export default function PetScanGurugramPage() {
  const doctorGrid = useRef<HTMLDivElement>(null);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingScan, setBookingScan] = useState("PET-CT / SPECT-CT");
  const [form, setForm] = useState<BookingForm>(emptyForm);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openBooking = (nextScan: string) => {
    setBookingScan(SCAN_TYPES.includes(nextScan) ? nextScan : "PET-CT / SPECT-CT");
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

  const scrollDoctors = (direction: number) => scrollSlider(doctorGrid, direction, ".doctor-card");

  useEffect(() => {
    const slider = doctorGrid.current;
    if (!slider) return undefined;

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
      const card = slider.querySelector(".doctor-card");
      const gap = parseFloat(getComputedStyle(slider).gap) || 18;
      const amount = card ? card.getBoundingClientRect().width + gap : 300;
      const maxScroll = slider.scrollWidth - slider.clientWidth;

      if (slider.scrollLeft >= maxScroll - 10) {
        slider.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        slider.scrollBy({ left: amount, behavior: "smooth" });
      }
    }, 3800);

    return () => {
      clearInterval(timer);
      clearTimeout(resumeTimeout);
      slider.removeEventListener("mouseenter", pause);
      slider.removeEventListener("mouseleave", unpause);
      slider.removeEventListener("touchstart", pause);
      slider.removeEventListener("touchend", resumeLater);
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
            <img src={`${IMG}/modern-diagnostic-research-centre-logo.png`} alt="Modern Diagnostic & Research Centre" />
          </a>
          <div className="header-actions">
            <button type="button" className="btn-book" onClick={() => openBooking("PET-CT / SPECT-CT")}>
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
                Advanced PET-CT Scan <span>in Gurugram</span>
              </h1>
              <p className="hero-description">
                High-precision PET-CT imaging that combines metabolic PET and anatomical CT, reported by an expert nuclear medicine physician.
              </p>
              <div className="hero-buttons">
                <button type="button" className="btn-book hero-primary-btn" onClick={() => openBooking("PET-CT / SPECT-CT")}>
                  Book Now
                </button>
                <a href={PHONE_HREF} className="hero-call-btn">
                  <img src={`${IMG}/phone-call-icon.png`} alt="" />
                  <span>{PHONE_DISPLAY}</span>
                </a>
              </div>
              <div className="hero-trust">
                <div className="hero-trust-item">
                  <span className="check-icon">✓</span> Hybrid PET-CT Imaging
                </div>
                <div className="hero-trust-item">
                  <span className="check-icon">✓</span> Expert Nuclear Medicine Team
                </div>
                <div className="hero-trust-item hero-trust-item-center">
                  <span className="check-icon">✓</span> FDG, PSMA, DOTA & DOPA
                </div>
              </div>
            </div>
            <div className="hero-visual">
              <div className="hero-image-wrapper">
                <img
                  src={`${IMG}/pet-ct-scanner-gurugram.webp`}
                  alt="PET-CT scanner for advanced imaging in Gurugram"
                  width="700"
                  height="600"
                />
              </div>
              <div className="hero-badge">
                <span className="badge-icon">+</span>
                <div>
                  <strong>PET-CT</strong>
                  <small>Hybrid Imaging</small>
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
                <h2>PET-CT Scan in Gurugram</h2>
              </div>
              <div className="intro-content">
                <p>
                  A Whole Body FDG PET-CT Scan is a highly reliable, advanced diagnostic imaging test that helps doctors evaluate a wide variety of complex health conditions. This scan brilliantly combines two powerful imaging techniques — PET (Positron Emission Tomography) and CT (Computed Tomography) — to provide a deeply detailed view of your body’s metabolic activity and internal structures, right here in Gurugram.
                </p>
                <p>
                  Because it looks at both physical structure and cellular activity, PET-CT is incredibly versatile. It is primarily used to detect, stage and monitor cancer, assess treatment response, and evaluate selected neurological and other metabolic conditions. At MDRC, every scan is performed in a calm, patient-friendly setting and reported by an expert nuclear medicine physician.
                </p>
                <div className="content-points">
                  <div className="content-point">
                    <span className="check-icon">✓</span> Hybrid PET-CT Technology
                  </div>
                  <div className="content-point">
                    <span className="check-icon">✓</span> Expert Nuclear Medicine Team
                  </div>
                  <div className="content-point">
                    <span className="check-icon">✓</span> Patient-focused Experience
                  </div>
                </div>
              </div>
            </div>
            <div className="intro-visual">
              <img src={`${IMG}/patient-pet-ct-scan.webp`} alt="Radiologist assisting a patient for PET-CT scan at MDRC Gurugram" />
            </div>
          </div>
        </section>

        <section className="section section-light">
          <div className="container">
            <div className="center-heading">
              <span className="eyebrow">PET-CT SERVICES</span>
              <h2>PET-CT Scans We Offer</h2>
              <p>Our PET-CT services cover specialised tracers for oncology, prostate, neuroendocrine and neurological imaging.</p>
            </div>
            <div className="pet-scans-grid">
              {petScans.map((item) => (
                <article
                  className="mri-scan-card pet-scan-card"
                  key={item.title}
                  onClick={() => openBooking(item.scan)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(event: KeyboardEvent<HTMLElement>) => {
                    if (event.key === "Enter" || event.key === " ") openBooking(item.scan);
                  }}
                >
                  <div className="pet-scan-card-top">
                    <div className="mri-scan-icon">
                      <img src={item.image} alt="" />
                    </div>
                    <h3>{item.title}</h3>
                  </div>
                  <p>{item.description}</p>
                </article>
              ))}
            </div>
            <div className="section-cta">
              <button type="button" className="btn-book" onClick={() => openBooking("PET-CT / SPECT-CT")}>
                Book Now
              </button>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="center-heading">
              <span className="eyebrow">WHY CHOOSE MDRC</span>
              <h2>Why Choose Our PET-CT Centre?</h2>
              <p>Advanced hybrid imaging, expert care, and accurate results you can trust.</p>
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
              <span className="eyebrow">BEFORE YOUR PET-CT</span>
              <h2>PET-CT Scan Preparation</h2>
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
                    {location.badge && <span className="location-img-badge">{location.badge}</span>}
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
                  className={`simple-service${service.highlight ? " simple-service-highlight" : ""}`}
                  key={service.name}
                  onClick={() => openBooking(service.scan)}
                >
                  {service.highlight ? <span className="simple-service-badge">{service.highlight}</span> : null}
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
              <img src={`${IMG}/patient-diagnostic-imaging-care.webp`} alt="Patient receiving diagnostic imaging care at MDRC" />
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
              <h2>PET-CT Scan FAQs</h2>
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
              <h2>Need a PET-CT Scan in Gurugram?</h2>
              <p>
                Book FDG, PSMA, DOTA, DOPA and other PET-CT / SPECT-CT scans with experienced nuclear medicine professionals at MDRC.
              </p>
            </div>
            <div className="final-buttons">
              <button type="button" className="btn-book btn-white-book" onClick={() => openBooking("PET-CT / SPECT-CT")}>
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
              <img src={`${IMG}/modern-diagnostic-research-centre-logo.png`} alt="Modern Diagnostic & Research Centre" />
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
          <img src={`${IMG}/phone-call-icon.png`} alt="" />
          <span>{PHONE_DISPLAY}</span>
        </a>
        <a href={WHATSAPP_HREF} className="sticky-btn sticky-whatsapp" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp MDRC">
          <img src={`${IMG}/whatsapp-icon.png`} alt="" />
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
