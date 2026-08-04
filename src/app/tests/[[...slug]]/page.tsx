export const dynamic = "force-dynamic";

import { Metadata } from "next";
import ItemService from "@/services/item.service";
import { getDeviceType } from "@/utils/device";
import { generateMetadataFromData, getCanonicalUrl } from "@/utils/meta";
import { cookies } from "next/headers";
import TestDetailPage from "./TestDetailClient";

type Props = {
  params: Promise<{ slug: string[] }>;
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

async function fetchItemDetail(itemSlug: string) {
  try {
    const cityData = await getCityFromCookie();
    const body = {
      view: "item_detail",
      userID: "",
      deviceType: getDeviceType(),
      userPhone: "",
      cityID: cityData?.id,
      itemSlug,
    };

    const res = await ItemService.getItemDetail(body);

    if (res?.result) {
      return res.result;
    }
  } catch (error) {
    console.error("Failed to fetch item detail:", error);
  }
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const citySlug = params.slug?.[1] || "";
  const itemSlug = params.slug?.[0] || "";

  const data = await fetchItemDetail(itemSlug);

  const canonicalUrl = citySlug
    ? getCanonicalUrl(`/tests/${citySlug}/${itemSlug}`)
    : getCanonicalUrl(`/tests/${itemSlug}`);

  return generateMetadataFromData({
    meta_title: data?.meta_title,
    meta_description: data?.meta_description,
    meta_keywords: data?.meta_keyword,
    meta_schema: data?.meta_schema,
    favicon: data?.favicon,
    canonical: canonicalUrl,
  });
}

// export default function Page() {
//   return (
//     <>
//       <TestDetailPage />
//     </>
//   );
// }

export default async function Page({ params }: Props) {
  const resolvedParams = await params;
  const itemSlug = resolvedParams.slug?.[0] || "";

  const data = await fetchItemDetail(itemSlug);  

  return <TestDetailPage data={data} itemSlug={itemSlug} />;
}
