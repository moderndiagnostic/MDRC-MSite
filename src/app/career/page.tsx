// app/career/page.tsx
import CareerPageClient from "./CareerPageClient";
import { generateMetadataFromData, getCanonicalUrl } from "@/utils/meta";
import type { Metadata } from "next";
import { careerService } from "@/services/careerService";

// Fetch at request time so a blocked/failed API during `next build`
// does not fail the whole deploy (CI servers often get Cloudflare 403).
export const dynamic = "force-dynamic";

async function fetchCareerData() {
  try {
    const response: any = await careerService.getCareerList();
    return response?.data ?? response ?? null;
  } catch (error) {
    console.error("Failed to fetch career data:", error);
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  try {
    const data = await fetchCareerData();

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
  const initialData = await fetchCareerData();

  return <CareerPageClient initialData={initialData} />;
}
