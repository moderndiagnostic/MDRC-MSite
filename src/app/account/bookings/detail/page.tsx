// app/BookingDetail/page.tsx
import BookingDetail from "./BookingDetail";
import { generateMetadataFromData, getCanonicalUrl } from "@/utils/meta";

// ✅ Generate metadata
export async function generateMetadata() {
  return generateMetadataFromData({
    canonical: getCanonicalUrl("/account/bookings/detail"),
  });
}

// ✅ Page Component
const Page = async () => {
  return <BookingDetail />;
};

export default Page;
