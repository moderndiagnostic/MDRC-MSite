import type { Metadata } from "next";
import { generateMetadataFromData, getCanonicalUrl } from "@/utils/meta";
import ItemService from "@/services/item.service";
import { getDeviceType } from "@/utils/device";
import { cookies } from "next/headers";
import PathologyItem from "./PathologyItem";

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

async function fetchItemList(diseaseSlug: string) {
  try {
    const cityData = await getCityFromCookie();
    const body = {
      view: "item_list",
      pageType: "Pathology",
      diseaseSlug,
      cityID: cityData?.id,
      deviceType: getDeviceType(),
    };

    const res = await ItemService.getItemDetail(body);
    if (res?.result) {
      return res.result;
    }
  } catch (error) {
    console.error("Failed to fetch data:", error);
  }
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const citySlug = params.slug?.[1] || "";
  const diseaseSlug = params.slug?.[0] || "";

  const data = await fetchItemList(diseaseSlug);

  return generateMetadataFromData({
    meta_title: data.meta_title || "",
    meta_description: data.meta_description || "",
    meta_keywords: data.meta_keywords || "",
    favicon: data.favicon || "/favicon.ico",
    canonical: getCanonicalUrl(
      `/pathology${diseaseSlug ? `/${diseaseSlug}` : ""}${citySlug ? `/${citySlug}` : ""}`,
    ),
  });
}
export default async function PathologyPage() {
  return (
    <>
      <PathologyItem />
    </>
  );
}
