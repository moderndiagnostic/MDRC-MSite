import "./all-scans.css";

const SITE_URL = "https://www.mdrcindia.com";
const PAGE_URL = `${SITE_URL}/lp/imaging/all-scans`;
const IMG = "/assets/images/lp/all-scans";
const TITLE = "Radiology Scans in Gurugram | MRI, CT, PET-CT, Ultrasound, X-Ray | MDRC";
const DESCRIPTION =
  "Book MRI, CT, PET-CT, SPECT, Ultrasound, Digital X-Ray, Mammography, CBCT and Bone Densitometry scans in Gurugram at MDRC's NABH accredited imaging centres with expert radiologists.";
const IMAGE = `${IMG}/advanced-mri-scan-gurugram-hero.webp`;

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0879b8",
};

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
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
        url: IMAGE,
        width: 1024,
        height: 1024,
        alt: "Radiology and imaging scans in Gurugram",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [IMAGE],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [{ url: `${IMG}/favicon.png`, type: "image/png" }, { url: "/favicon.ico" }],
    shortcut: `${IMG}/favicon.png`,
    apple: `${IMG}/favicon.png`,
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
      image: `${SITE_URL}${IMG}/mdrc-logo.webp`,
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
          addressLocality: "Gurugram",
          addressRegion: "Haryana",
          postalCode: "122001",
          addressCountry: "IN",
        },
      ],
    },
  ],
};

export default function AllScansLandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  );
}
