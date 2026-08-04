import type { Metadata } from "next";
import { generateMetadataFromData, getCanonicalUrl } from "@/utils/meta";
import ItemService from "@/services/item.service";
import { getDeviceType } from "@/utils/device";
import { cookies } from "next/headers";
import FullBodyCheckupPage from "./PremiumHealthCheckup";

type Props = {
  params: Promise<{ slug: string }>;
};

async function getCityFromCookie() {
  try {
    const cookieStore = await cookies();
    const cityCookie = cookieStore.get("cityDetail")?.value;
    return cityCookie ? JSON.parse(cityCookie) : null;
  } catch {
    return null;
  }
}

async function fetchItemList() {
  try {
    const cityData = await getCityFromCookie();
    const body = {
      view: "item_list",
      pageType: "Popular Package",
      cityID: cityData?.id,
      deviceType: getDeviceType(),
    };

    const res = await ItemService.getItemDetail(body);

    if (res?.result) {
      return res.result;
    }
  } catch (error) {
    console.error("Failed to fetch diseases data:", error);
  }
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const citySlug = params.slug?.[0] || "";

  const data = await fetchItemList();

  return generateMetadataFromData({
    meta_title: data.meta_title || "",
    meta_description: data.meta_description || "",
    meta_keywords: data.meta_keywords || "",
    favicon: data.favicon || "/favicon.ico",
    canonical: getCanonicalUrl(
      `/premium-health-checkup${citySlug ? `/${citySlug}` : ""}`,
    ),
  });
}
export default async function DiseasesPage() {
  return (
    <>
      <FullBodyCheckupPage />
    </>
  );
}
