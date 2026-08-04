// app/about-us/page.tsx
import AboutPageClient from "./AboutPageClient";
import { generateMetadataFromData, getCanonicalUrl } from "@/utils/meta";

export async function generateMetadata() {
  return generateMetadataFromData({
    meta_title:
      "The Story of Modern Diagnostic - Your Trusted Healthcare Provider",
    meta_description:
      "Discover the story behind Modern Diagnostic and how we are dedicated to providing exceptional pathology, radiology, and imaging services.",
    meta_keywords:
      "about us, MDRC India, pathology services, radiology services, imaging services, team, mission, values",
    canonical: getCanonicalUrl("/about-us"),
  });
}

export default function AboutPageWrapper(props: any) {
  return <AboutPageClient {...props} />;
}
