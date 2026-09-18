import "./mri-scan.css";

const SITE_URL = "https://www.mdrcindia.com";
const PAGE_URL = `${SITE_URL}/lp/imaging/mri-scan-in-gurgaon`;
const TITLE = "Advanced MRI Scan in Gurugram | MDRC";
const DESCRIPTION =
  "Book an advanced MRI scan in Gurugram at MDRC. 3T MRI technology, expert radiologists, NABL & NABH accredited centres in Sector-40 and New Railway Road.";

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
    "MRI scan Gurugram",
    "3T MRI",
    "MDRC",
    "MRI Gurgaon",
    "PET-CT",
    "CT Scan",
    "diagnostic centre Sector 40",
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
        url: "/assets/images/lp/mri-scan-in-gurgaon/siemens-3t-mri-machine-gurugram.jpg",
        width: 1200,
        height: 630,
        alt: "Advanced MRI Scan in Gurugram at MDRC",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/assets/images/lp/mri-scan-in-gurgaon/siemens-3t-mri-machine-gurugram.jpg"],
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
      { url: "/assets/images/lp/mri-scan-in-gurgaon/mdrc-favicon.png", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    shortcut: "/assets/images/lp/mri-scan-in-gurgaon/mdrc-favicon.png",
    apple: "/assets/images/lp/mri-scan-in-gurgaon/mdrc-favicon.png",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "MedicalClinic",
  name: "Modern Diagnostic & Research Centre",
  url: SITE_URL,
  image: `${SITE_URL}/assets/images/lp/mri-scan-in-gurgaon/siemens-3t-mri-machine-gurugram.jpg`,
  telephone: "+91-8920300300",
  medicalSpecialty: "Diagnostic Radiology",
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
      addressLocality: "Gurugram",
      addressRegion: "Haryana",
      postalCode: "122001",
      addressCountry: "IN",
    },
  ],
};

export default function MriScanGurugramLayout({
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
