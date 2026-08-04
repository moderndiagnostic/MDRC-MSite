// app/Family/page.tsx
import Family from "./Family";
import { generateMetadataFromData, getCanonicalUrl } from "@/utils/meta";

// ✅ Generate metadata
export async function generateMetadata() {
  return generateMetadataFromData({
    canonical: getCanonicalUrl("/account/Family"),
  });
}

// ✅ Page Component
const Page = async () => {
  return <Family />;
};

export default Page;
