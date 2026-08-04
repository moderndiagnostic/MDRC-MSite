import type { Metadata } from "next";
import { cache } from "react";
import { generateMetadataFromData, getCanonicalUrl } from "@/utils/meta";
import DiseaseGrid from "./HealthRiskGrid";
import { diseasesService } from "@/services/diseasesService";

type Props = {
  params: Promise<{ slug: string }>;
};

const fetchDisease = cache(async (_slug?: Props) => {
  try {
    const res = await diseasesService.getDiseasesList();
    return res?.data;
  } catch (error) {
    console.error("Failed to fetch diseases:", error);
    return null;
  }
});

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const data = await fetchDisease();

  return generateMetadataFromData({
    meta_title: data.meta_title,
    meta_description: data.meta_description,
    meta_keywords: data.meta_keywords,
    favicon: data.favicon,
    canonical: getCanonicalUrl(
      `/health-risk${params.slug ? `/${params.slug}` : ""}`,
    ),
  });
}

export default async function DiseasesPage(_props?: Props) {
  // const params = await props.params;
  const data = await fetchDisease();

  return (
    <>
      <DiseaseGrid />
    </>
  );
}
