import type { Metadata } from "next";
import CategoryGrid from "./CategoryGrid";
import { categoriesService } from "@/services/categoriesService";
import { cache } from "react";
import { generateMetadataFromData, getCanonicalUrl } from "@/utils/meta";

type Props = {
  params: Promise<{ slug: string }>;
};

const fetchCategories = cache(async (_slug?: Props) => {
  try {
    const res = await categoriesService.getCategoriesList();
    return res?.data;
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return null;
  }
});

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const data = await fetchCategories();

  return generateMetadataFromData({
    meta_title: data.meta_title,
    meta_description: data.meta_description,
    meta_keywords: data.meta_keywords,
    favicon: data.favicon,
    canonical: getCanonicalUrl(
      `/categories${params.slug ? `/${params.slug}` : ""}`,
    ),
  });
}

export default async function CategoriesPage(_props?: Props) {
  // const params = await props.params;
  const data = await fetchCategories();

  if (!data) {
    return <p>Categories not found.</p>;
  }

  return (
    <>
      <CategoryGrid data={data} />
    </>
  );
}
