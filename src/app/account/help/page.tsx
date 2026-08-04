// app/Help/page.tsx
import Help from "./Help";
import { generateMetadataFromData, getCanonicalUrl } from "@/utils/meta";

// ✅ Generate metadata
export async function generateMetadata() {
  return generateMetadataFromData({
    canonical: getCanonicalUrl("/account/help"),
  });
}

// ✅ Page Component
const Page = async () => {
  return <Help />;
};

export default Page;
