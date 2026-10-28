import "./health-package.css";

const SITE_URL = "https://www.mdrcindia.com";
const PAGE_URL = `${SITE_URL}/lp/imaging/health-package-in-gurugram`;
const IMG = "/assets/images/lp/health-package-in-gurugram";
const TITLE = "Full Body Health Checkup Packages in Gurugram | Niramaya & Vitamin Packages | MDRC";
const DESCRIPTION =
  "Book full body health checkup and vitamin packages in Gurugram at MDRC. Modern Niramaya packages with up to 106 parameters, home sample collection and online reports.";
const IMAGE = `${IMG}/home-collection/health-checkup-hero-indian.jpg`;

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
        width: 1152,
        height: 864,
        alt: "Health checkup blood sample collection in Gurugram",
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
      medicalSpecialty: "Pathology",
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

export default function HealthPackageLandingLayout({
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
