const SITE_URL = "https://www.mdrcindia.com";
const PAGE_URL = `${SITE_URL}/lp/imaging/pet-scan-in-gurgaon`;
const TITLE = "PET CT Scan in Gurugram | FDG, PSMA, DOTA, DOPA | MDRC";
const DESCRIPTION =
  "Book a PET CT scan in Gurugram at MDRC. Whole body FDG PET-CT, PSMA, DOTA and DOPA scans with expert radiologists. Prices from ₹16,000. NABL & NABH accredited.";

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
        url: "/assets/images/lp/pet-scan-in-gurgaon/heroSectionImage.webp",
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
    images: ["/assets/images/lp/pet-scan-in-gurgaon/heroSectionImage.webp"],
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
      { url: "/assets/images/lp/pet-scan-in-gurgaon/favicon.png", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    shortcut: "/assets/images/lp/pet-scan-in-gurgaon/favicon.png",
    apple: "/assets/images/lp/pet-scan-in-gurgaon/favicon.png",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "MedicalClinic",
      "@id": `${SITE_URL}/#clinic`,
      name: "Modern Diagnostic & Research Centre",
      url: `${SITE_URL}/`,
      telephone: "+91-8920300300",
      image: `${SITE_URL}/assets/pet-ct-scan.jpg`,
      address: {
        "@type": "PostalAddress",
        streetAddress: "1057P, Sector-40",
        addressLocality: "Gurugram",
        addressRegion: "Haryana",
        postalCode: "122002",
        addressCountry: "IN",
      },
      areaServed: "Gurugram",
    },
    {
      "@type": "MedicalTest",
      name: "PET CT Scan in Gurugram",
      description:
        "A Whole Body FDG PET-CT Scan combines PET (Positron Emission Tomography) and CT (Computed Tomography) to evaluate metabolic activity and internal structures.",
      url: PAGE_URL,
      relevantSpecialty: "Nuclear Medicine",
      provider: { "@id": `${SITE_URL}/#clinic` },
    },
  ],
};

export default function PetScanInGurgaonLayout({
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
