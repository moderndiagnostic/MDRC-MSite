// app/reach-us/page.tsx
import ReachUsComponent from "./ReachUs";
import { generateMetadataFromData, getCanonicalUrl } from "@/utils/meta";
import { ReachUsApiResponse } from "@/hooks/useReachUs";
import { reachUsService } from "@/services/reachUsService";

async function fetchReachUsData(): Promise<ReachUsApiResponse> {
  try {
    const response = await reachUsService.getAddresses();
    console.log(response,'response');
    
    return response;
  } catch (error) {
    console.error("Error fetching Reach Us data:", error);
    return true as any;
  }
}

export async function generateMetadata() {
  const data = await fetchReachUsData();
  const metaInput = data?.result || {};
  return generateMetadataFromData({
    meta_title: metaInput.meta_title,
    meta_description: metaInput.meta_description,
    favicon: metaInput.favicon,
    canonical: getCanonicalUrl("/reach-us"),
  });
}

// Page Component
const ReachUsPage = async () => {
  const data = await fetchReachUsData();

  return <ReachUsComponent serverData={data} />;
};

export default ReachUsPage;
