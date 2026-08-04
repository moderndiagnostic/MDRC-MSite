// app/Booking/page.tsx
import Booking from "./Booking";
import { generateMetadataFromData, getCanonicalUrl } from "@/utils/meta";

// ✅ Generate metadata
export async function generateMetadata() {
  return generateMetadataFromData({
    canonical: getCanonicalUrl("/account/bookings"),
  });
}

// ✅ Page Component
const Page = async () => {
  return <Booking />;
};

export default Page;
