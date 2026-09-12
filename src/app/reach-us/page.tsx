// app/reach-us/page.tsx
import ReachUsComponent from "./ReachUs";
import { generateMetadataFromData, getCanonicalUrl } from "@/utils/meta";
import { ReachUsApiResponse } from "@/hooks/useReachUs";
import { reachUsService } from "@/services/reachUsService";

// Always fetch from the API at request time so CMS/database updates
// appear on production without waiting for a new deploy/rebuild.
export const dynamic = "force-dynamic";

function parseReachUsResponse(response: unknown): ReachUsApiResponse | null {
  let data: any = response;

  // PHP indent() returns pretty-printed text. Axios sometimes leaves it as a string.
  if (typeof data === "string") {
    const trimmed = data.trim().replace(/^\\+/, "");
    try {
      data = JSON.parse(trimmed);
    } catch {
      console.error("Reach Us API JSON parse failed");
      return null;
    }
  }

  return data?.result ? data : null;
}

async function fetchReachUsData(): Promise<ReachUsApiResponse | null> {
  try {
    const response = await reachUsService.getAddresses();
    const parsed = parseReachUsResponse(response);
    if (!parsed) {
      console.error("Reach Us API returned no result:", response);
      return null;
    }
    return parsed;
  } catch (error) {
    console.error("Error fetching Reach Us data:", error);
    return null;
  }
}

export async function generateMetadata() {
  const data = await fetchReachUsData();
  const metaInput = data?.result;
  return generateMetadataFromData({
    meta_title: metaInput?.meta_title,
    meta_description: metaInput?.meta_description,
    favicon: metaInput?.favicon,
    canonical: getCanonicalUrl("/reach-us"),
  });
}

// Page Component
const ReachUsPage = async () => {
  const data = await fetchReachUsData();

  return <ReachUsComponent serverData={data} />;
};

export default ReachUsPage;
