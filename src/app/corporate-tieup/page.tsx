// app/corporate-tieup/page.tsx
import CorporateTieup from "./CorporatePage";
import { generateMetadataFromData, getCanonicalUrl } from "@/utils/meta";

export async function generateMetadata() {
  return generateMetadataFromData({
    meta_title:
      "Corporate Health Tie-Ups | Employee Wellness Programs – Modern Diagnostic",
    meta_description:
      "Partner with Lal PathLabs for customized corporate health checkup programs. Improve employee wellness with reliable diagnostic services across India.",
    meta_keywords:
      "Corporate health checkup, Employee wellness programs, Corporate wellness solutions,  Employee health packages, Corporate tie-ups with diagnostic labs,  Corporate health checkup packages in India, Diagnostic lab for corporate partnerships, Workplace health programs for employees,",
    canonical: getCanonicalUrl("/corporate-tieup"),
  });
}

// ✅ Page Component
const Page = async () => {
  return <CorporateTieup />;
};

export default Page;
