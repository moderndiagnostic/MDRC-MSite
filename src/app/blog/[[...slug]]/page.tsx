// app/blog/page.tsx
import type { Metadata } from "next";
import BlogPageClient from "./BlogPageClient";
import requests from "@/lib/httpServices";
import { cache } from "react";
import { generateMetadataFromData, getCanonicalUrl } from "@/utils/meta";

type BlogListData = {
  meta_title?: string;
  meta_description?: string;
  favicon?: string;
  blogList: any[];
  categories?: any[];
};

type Props = {
  params: Promise<{ slug: string[] }>;
};

const fetchBlogList = cache(
  async (
    filterBy?: string,
    filterValue?: string,
  ): Promise<BlogListData | null> => {
    try {
      const res = await requests.post("/webApi/index.php", {
        view: "blog_list",
        deviceType: "Android",
        page: 0,
        sort_by: "latest",
        filter_by: filterBy ?? "",
        filter_value: filterValue ?? "",
      });
      return res?.data || null;
    } catch (error) {
      console.error("Failed to fetch blog list:", error);
      return null;
    }
  },
);

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const filterBy = params?.slug?.[0];
  const filterValue = params?.slug?.[1];

  const data = await fetchBlogList(filterBy, filterValue);

  if (!data) {
    return {
      title: "Modern Diagnostic Blog",
      description: "Latest health and diagnostic blogs",
    };
  }

  return generateMetadataFromData({
    meta_title: data.meta_title || "Modern Diagnostic Blog",
    meta_description:
      data.meta_description || "Latest health and diagnostic blogs",
    favicon: data.favicon,
    canonical: getCanonicalUrl(
      `/blog${filterBy ? `/${filterBy}` : ""}${filterValue ? `/${filterValue}` : ""}`,
    ),
    type: "website",
  });
}

export default async function Page(props: Props) {
  const params = await props.params;
  const filterBy = params?.slug?.[0];
  const filterValue = params?.slug?.[1];

  const data = await fetchBlogList(filterBy, filterValue);

  if (!data) {
    return <p>No blogs found.</p>;
  }

  return <BlogPageClient initialData={data} />;
}
