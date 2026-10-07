import "./ultrasound.css";

const SITE_URL = "https://www.mdrcindia.com";
const PAGE_URL = `${SITE_URL}/lp/imaging/ultrasound-test-in-gurgaon`;
const TITLE = "Ultrasound Scan in Gurugram | Abdomen, Pregnancy, Doppler | MDRC";
const DESCRIPTION =
  "Book an ultrasound scan in Gurugram at MDRC. Whole abdomen, KUB, obstetric Level I & II, color Doppler, breast, thyroid and TVS with expert radiologists. Samsung V7 imaging. NABL & NABH accredited.";
const IMAGE = "/assets/images/lp/ultrasound-test-in-gurgaon/ultrasound-patient.jpg";

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
    "ultrasound scan Gurugram",
    "ultrasound Gurgaon",
    "sonography Gurugram",
    "whole abdomen ultrasound",
    "KUB ultrasound",
    "pregnancy scan",
    "Level II anomaly scan",
    "color Doppler",
    "TVS",
    "MDRC ultrasound",
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
    title: "Ultrasound Scan in Gurugram | MDRC",
    description:
      "Safe, radiation-free ultrasound in Gurugram. Abdomen, pregnancy, Doppler, breast, thyroid and TVS scans with experienced radiologists at MDRC.",
    images: [
      {
        url: IMAGE,
        width: 1200,
        height: 630,
        alt: "Indian patient during an ultrasound scan at MDRC Gurugram",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ultrasound Scan in Gurugram | MDRC",
    description:
      "Book abdomen, pregnancy, Doppler and specialised ultrasound scans at MDRC Gurugram. Expert reporting. Samsung V7 technology.",
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
      { url: "/assets/images/lp/ultrasound-test-in-gurgaon/favicon.png", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    shortcut: "/assets/images/lp/ultrasound-test-in-gurgaon/favicon.png",
    apple: "/assets/images/lp/ultrasound-test-in-gurgaon/favicon.png",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "MedicalClinic",
      name: "Modern Diagnostic & Research Centre",
      url: SITE_URL,
      telephone: "+91-8920300300",
      image: `${SITE_URL}/assets/images/lp/ultrasound-test-in-gurgaon/mdrc-logo.webp`,
      medicalSpecialty: "Radiology",
      areaServed: "Gurugram",
      address: [
        {
          "@type": "PostalAddress",
          streetAddress: "1057P, Sector-40",
          addressLocality: "Gurugram",
          addressRegion: "Haryana",
          postalCode: "122002",
          addressCountry: "IN",
        },
        {
          "@type": "PostalAddress",
          streetAddress: "363-364/4, Sector-12, New Railway Road",
          addressLocality: "Gurgaon",
          addressRegion: "Haryana",
          postalCode: "122001",
          addressCountry: "IN",
        },
      ],
    },
    {
      "@type": "MedicalTest",
      name: "Ultrasound Scan in Gurugram",
      description:
        "An ultrasound (sonography) uses high-frequency sound waves to create real-time images of internal organs, pregnancy, blood flow and soft tissues without ionizing radiation.",
      url: PAGE_URL,
      relevantSpecialty: "Radiology",
    },
  ],
};

export default function UltrasoundLandingLayout({
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
