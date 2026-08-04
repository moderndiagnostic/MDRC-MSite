import { generateMetadataFromData, getCanonicalUrl } from "@/utils/meta";
import { ipoService } from "@/services/ipoService";
import PoliciesPage from "./PoliciesPage";

async function fetchData() {
  try {
    const response = await ipoService.getDocuments("Policies");
    return response;
  } catch (error) {
    console.error("Error fetching Policies data:", error);
    return null;
  }
}

// ✅ Generate metadata
export async function generateMetadata() {
  const data = await fetchData();
  const metaInput = data?.data?.other || {};

  return generateMetadataFromData({
    meta_title:
      metaInput.title || "Policies Documents - Modern Diagnostic & Research Centre",
    meta_description: metaInput.description || "",
    canonical: getCanonicalUrl("/policies"),
  });
}

// ✅ Page Component
const Page = async () => {
  const data = await fetchData();
  const serverData = data?.data || {};
  return <PoliciesPage serverData={serverData} />;
};

export default Page;
