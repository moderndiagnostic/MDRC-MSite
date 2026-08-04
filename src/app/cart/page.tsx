// app/Cart/page.tsx
import Cart from "./Cart";
import { generateMetadataFromData, getCanonicalUrl } from "@/utils/meta";

export async function generateMetadata() {
  return generateMetadataFromData({
    canonical: getCanonicalUrl("/cart"),
  });
}

// ✅ Page Component
const Page = async () => {
  return <Cart />;
};

export default Page;
