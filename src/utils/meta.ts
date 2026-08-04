// utils/meta.ts
import { Metadata } from "next";

interface MetaDataInput {
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  meta_schema?: string;
  favicon?: string;
  canonical?: string;
  openGraphImage?: string;
  type?: "website" | "article";
  siteName?: string;
}

const DEFAULT_TITLE = "Best Diagnostic Lab & Pathology Services - MDRC India";
const DEFAULT_DESCRIPTION =
  "best diagnostic centre, MRI, CT-Scan, ultrasound centre, X-Ray, mammography, PFT test, LFT test, neurology lab, molecular diagnostics, oncogenomics, ultrasound gurgaon, diabetes test, diabetes screening, HBA1C test, hematology and coagulation, complete heart lab, NABL lab gurgaon";
const DEFAULT_KEYWORDS =
  "Best Pathology Lab in India. We are one of the leading provider of  Diagnostic Services in India by using World Class machines in Radiology as well as Pathology. 3T MRI, 128 Slice Dual Source CT Scan, Ultrasound, Genetic Labs, Automated Lab";

export function generateMetadataFromData(data: MetaDataInput): Metadata {
  const metadata: Metadata = {
    title: data.meta_title || DEFAULT_TITLE,
    description: data.meta_description || DEFAULT_DESCRIPTION,
    keywords: data.meta_keywords || DEFAULT_KEYWORDS,
    icons: {
      icon: data.favicon || "/favicon.ico",
    },
    alternates: {
      canonical: data.canonical,
    },
    openGraph: {
      title: data.meta_title || DEFAULT_TITLE,
      description: data.meta_description || DEFAULT_DESCRIPTION,
      images: data.openGraphImage ? [{ url: data.openGraphImage }] : [],
      type: data.type || "website",
      siteName: data.siteName || "Modern Diagnostic & Research Centre",
    },
  };

  // Add Twitter card metadata
  if (data.meta_title || data.meta_description || data.openGraphImage) {
    metadata.twitter = {
      card: "summary_large_image",
      title: data.meta_title || DEFAULT_TITLE,
      description: data.meta_description || DEFAULT_DESCRIPTION,
      images: data.openGraphImage ? [data.openGraphImage] : [],
    };
  }

  // Add structured data if available
  if (data.meta_schema) {
    metadata.other = {
      "application/ld+json": data.meta_schema,
    };
  }

  return metadata;
}

export function getCanonicalUrl(path: string) {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "https://www.mdrcindia.com";
  return `${baseUrl}${path}`;
}
