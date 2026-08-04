// app/career/page.tsx
import CareerPageClient from "./CareerPageClient";
import { generateMetadataFromData, getCanonicalUrl } from "@/utils/meta";
import type { Metadata } from "next";
import { careerService } from "@/services/careerService";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const response: any = await careerService.getCareerList();
    const data = response.data ?? response;

    const meta_title = data?.meta_title || "Careers at Modern Diagnostic";
    const meta_description =
      data?.meta_description ||
      "Join the Modern Diagnostic team. Explore current openings and be part of our journey in healthcare.";
    const meta_keywords =
      data?.meta_keywords ||
      "career, jobs, openings, Modern Diagnostic, healthcare, pathology, radiology, diagnostics";

    const canonical = getCanonicalUrl("/career");

    return generateMetadataFromData({
      meta_title,
      meta_description,
      meta_keywords,
      canonical,
      openGraphImage: data?.other?.section_image || "/favicon.ico",
      type: "website",
    });
  } catch (error) {
    console.error("Failed to fetch career metadata:", error);
    return generateMetadataFromData({
      meta_title: "Careers at Modern Diagnostic",
      meta_description:
        "Join the Modern Diagnostic team. Explore current openings and be part of our journey in healthcare.",
      canonical: getCanonicalUrl("/career"),
      type: "website",
    });
  }
}

export default async function CareerPageWrapper() {
  const response: any = await careerService.getCareerList();
  const initialData = response.data ?? response;

  return <CareerPageClient initialData={initialData} />;
}
