// app/Profile/page.tsx
import Profile from "./Profile";
import { generateMetadataFromData, getCanonicalUrl } from "@/utils/meta";

// ✅ Generate metadata
export async function generateMetadata() {
  return generateMetadataFromData({
    canonical: getCanonicalUrl("/account/profile"),
  });
}

// ✅ Page Component
const Page = async () => {
  return <Profile />;
};

export default Page;
