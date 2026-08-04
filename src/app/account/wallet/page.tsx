// app/Wallet/page.tsx
import Wallet from "./Wallet";
import { generateMetadataFromData, getCanonicalUrl } from "@/utils/meta";

// ✅ Generate metadata
export async function generateMetadata() {
  return generateMetadataFromData({
    canonical: getCanonicalUrl("/account/wallet"),
  });
}

// ✅ Page Component
const Page = async () => {
  return <Wallet />;
};

export default Page;
