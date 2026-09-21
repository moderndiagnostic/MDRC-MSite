import "./pet-scan.css";

const SITE_URL = "https://www.mdrcindia.com";
const PAGE_URL = `${SITE_URL}/lp/imaging/pet-ct-scan-in-gurgaon`;
const TITLE = "PET CT Scan in Gurugram | FDG, PSMA, DOTA, DOPA | MDRC";
const DESCRIPTION =
  "Book a PET CT scan in Gurugram at MDRC. Whole body FDG PET-CT, PSMA, DOTA and DOPA scans with expert radiologists. NABL & NABH accredited centres in Sector-40 and New Railway Road.";

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
    "PET CT scan Gurugram",
    "PET CT scan Gurgaon",
    "FDG PET CT",
    "PSMA scan",
    "DOTA PET scan",
    "DOPA scan",
    "PET CT scan price",
    "whole body PET CT",
    "MDRC PET CT",
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
    title: TITLE,
    description: DESCRIPTION,
    images: [
      {
        url: "/assets/images/lp/pet-scan-in-gurgaon/pet-ct-scanner-gurugram.webp",
        width: 1200,
        height: 630,
        alt: "Advanced PET-CT Scan in Gurugram at MDRC",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/assets/images/lp/pet-scan-in-gurgaon/pet-ct-scanner-gurugram.webp"],
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
      { url: "/assets/images/lp/pet-scan-in-gurgaon/mdrc-favicon.png", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    shortcut: "/assets/images/lp/pet-scan-in-gurgaon/mdrc-favicon.png",
    apple: "/assets/images/lp/pet-scan-in-gurgaon/mdrc-favicon.png",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "MedicalClinic",
  name: "Modern Diagnostic & Research Centre",
  url: SITE_URL,
  image: `${SITE_URL}/assets/images/lp/pet-scan-in-gurgaon/pet-ct-scanner-gurugram.webp`,
  telephone: "+91-8920300300",
  medicalSpecialty: "Nuclear Medicine",
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
};

export default function PetScanGurugramLayout({
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
