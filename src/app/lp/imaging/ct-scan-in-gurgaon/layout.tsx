import "./ct-scan.css";

const SITE_URL = "https://www.mdrcindia.com";
const PAGE_URL = `${SITE_URL}/lp/imaging/ct-scan-in-gurgaon`;
const TITLE = "Best CT Scan Test Price in Gurugram | 128 Slice Cardiac CT | MDRC";
const DESCRIPTION =
  "Get accurate CT scan results in Gurugram at MDRC. GE Revolution EVO 128 Slice Cardiac CT Scanner, certified radiologists, NCCT, CECT, 3D and angiography scans. NABL & NABH accredited.";
const IMAGE = "/assets/images/lp/ct-scan-in-gurgaon/ct-patient.jpg";

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0879b8",
};

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "CT scan Gurugram",
    "CT scan Gurgaon",
    "NCCT head",
    "CECT whole abdomen",
    "CECT chest",
    "NCCT KUB",
    "128 slice CT",
    "CT angiography Gurugram",
    "MDRC CT scan",
  ],
  authors: [{ name: "Modern Diagnostic & Research Centre" }],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: PAGE_URL,
    siteName: "MDRC India",
    title: "CT Scan in Gurugram | MDRC",
    description:
      "Advanced CT scan in Gurugram on a GE Revolution EVO 128 Slice Cardiac CT Scanner. NCCT, CECT, 3D and angiography with experienced radiologists at MDRC.",
    images: [
      {
        url: IMAGE,
        width: 1024,
        height: 576,
        alt: "Indian patient during a CT scan at MDRC Gurugram",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CT Scan in Gurugram | MDRC",
    description:
      "Book NCCT, CECT, 3D and angiography CT scans at MDRC Gurugram. 128 Slice Cardiac CT. Expert reporting.",
    images: [IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large" as const,
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/assets/images/lp/ct-scan-in-gurgaon/favicon.png", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    shortcut: "/assets/images/lp/ct-scan-in-gurgaon/favicon.png",
    apple: "/assets/images/lp/ct-scan-in-gurgaon/favicon.png",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "MedicalClinic",
      "@id": "https://www.mdrcindia.com/#clinic",
      name: "Modern Diagnostic & Research Centre",
      url: SITE_URL,
      telephone: "+91-124-6712000",
      image: `${SITE_URL}/assets/images/lp/ct-scan-in-gurgaon/mdrc-logo.webp`,
      medicalSpecialty: "Radiology",
      areaServed: "Gurugram",
      address: {
        "@type": "PostalAddress",
        streetAddress: "1057P, Sector-40",
        addressLocality: "Gurugram",
        addressRegion: "Haryana",
        postalCode: "122002",
        addressCountry: "IN",
      },
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+91-8920300300",
        contactType: "reservations",
        areaServed: "IN",
        availableLanguage: "English",
      },
    },
    {
      "@type": "MedicalTest",
      name: "CT Scan in Gurugram",
      description:
        "A CT scan uses X-rays and computer technology to create detailed cross-sectional images of organs, bones, blood vessels and soft tissues.",
      url: PAGE_URL,
      relevantSpecialty: "Radiology",
      provider: { "@id": "https://www.mdrcindia.com/#clinic" },
    },
  ],
};

export default function CtLandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
