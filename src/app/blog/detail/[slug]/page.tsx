import type { Metadata } from "next";
import BlogDetailClient from "./BlogDetailClient";
import requests from "@/lib/httpServices";
import { cache } from "react";
import { generateMetadataFromData, getCanonicalUrl } from "@/utils/meta";

type Props = {
  params: Promise<{ slug: string }>;
};

const fetchBlogDetail = cache(async (slug: string) => {
  try {
    const res = await requests.post("/webApi/index.php", {
      view: "blog_detail",
      deviceType: "Android",
      detailSlug: slug,
    });
    return res?.data;
  } catch (error) {
    console.error("Failed to fetch blog detail:", error);
    return null;
  }
});

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const data = await fetchBlogDetail(params.slug);

  if (!data) {
    return { title: "Blog Detail", description: "" };
  }

  return generateMetadataFromData({
    meta_title: data.meta_title,
    meta_description: data.meta_description,
    meta_keywords: data.meta_keywords,
    favicon: data.favicon,
    canonical: getCanonicalUrl(`/blog/detail/${params.slug}`),
    openGraphImage: data.blogDetail?.image,
    type: "article",
  });
}

export default async function Page(props: Props) {
  const params = await props.params;
  const data = await fetchBlogDetail(params.slug);

  if (!data) {
    return (
      <p className="min-h-96 text-center flex items-center justify-center p-4">
        Blog not found.
      </p>
    );
  }

  return (
    <>
      <BlogDetailClient data={data} />
    </>
  );
}
