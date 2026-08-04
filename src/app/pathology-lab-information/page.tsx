// app/pathology-lab-information/page.tsx
import PathologyLabInfo from "./PathologyLabInfo";
import { generateMetadataFromData, getCanonicalUrl } from "@/utils/meta";

export async function generateMetadata() {
  return generateMetadataFromData({
    meta_title:
      "Best Pathology Lab Information for Optimal Health | Modern Diagnostic",
    meta_description:
      "Discover the power of knowledge with Modern Diagnostic & Research Centre Pathology Lab Information. Get clear insights into your health through simple and accurate details about our advanced pathology services. Start your wellness journey here.",
    meta_keywords:
      "Pathology Lab, Lab Tests, Modern Diagnostic, Health Insights, Medical Reports, Diagnostic Services, Pathology Information, Clinical Tests, Comprehensive Diagnostics",
    canonical: getCanonicalUrl("/pathology-lab-information"),
  });
}

// ✅ Page Component
const Page = async () => {
  return <PathologyLabInfo />;
};

export default Page;
