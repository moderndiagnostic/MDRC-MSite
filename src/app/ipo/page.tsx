// app/ipo/page.tsx
import IPOPage from "./IPOPage";
import { generateMetadataFromData, getCanonicalUrl } from "@/utils/meta";
import { ipoService } from "@/services/ipoService";

async function fetchIPOData() {
  try {
    const response = await ipoService.getDocuments("IPO");
    return response;
  } catch (error) {
    console.error("Error fetching IPO data:", error);
    return null;
  }
}

// ✅ Generate metadata
export async function generateMetadata() {
  const data = await fetchIPOData();
  const metaInput = data?.data?.other || {};

  return generateMetadataFromData({
    meta_title:
      metaInput.title || "IPO Documents - Modern Diagnostic & Research Centre",
    meta_description: metaInput.description || "",
    canonical: getCanonicalUrl("/ipo"),
  });
}

// ✅ Page Component
const Page = async () => {
  const data = await fetchIPOData();
  const serverData = data?.data || {};
  return <IPOPage serverData={serverData} />;
};

export default Page;
