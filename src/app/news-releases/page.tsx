import { generateMetadataFromData, getCanonicalUrl } from "@/utils/meta";
import { ipoService } from "@/services/ipoService";
import NewsReleasesComponent from "./NewsReleases";

async function fetchData() {
  try {
    const response = await ipoService.getDocuments("News Releases");
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
      metaInput.title ||
      "News Releases Documents - Modern Diagnostic & Research Centre",
    meta_description: metaInput.description || "",
    canonical: getCanonicalUrl("/news-releases"),
  });
}

// ✅ Page Component
const Page = async () => {
  const data = await fetchData();
  const serverData = data?.data || {};
  return <NewsReleasesComponent serverData={serverData} />;
};

export default Page;
