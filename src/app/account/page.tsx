// app/account/page.tsx
import MyDashboard from "./AccontClient";
import { generateMetadataFromData, getCanonicalUrl } from "@/utils/meta";

export async function generateMetadata() {
  return generateMetadataFromData({
    meta_title: "",
    meta_description: "",
    meta_keywords: "",
    favicon: "",
    canonical: getCanonicalUrl("/account"),
  });
}

// ✅ Page Component
const Page = async () => {
  return <MyDashboard />;
};

export default Page;
