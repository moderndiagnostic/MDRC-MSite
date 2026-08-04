import { Metadata } from "next";
import PageClient from "./PageClient";
import { getCanonicalUrl } from "@/utils/meta";
import requests from "@/lib/httpServices";
import { cache } from "react";

type Props = {
  params: Promise<{ slug: string }>;
};

const fetchPageData = cache(async (slug: string) => {
  const res = await requests.post("/webApi/index.php", {
    view: "page",
    slug,
  });

  const data = await res.data;
  return data?.page?.[0] || null;
});

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const pageData = await fetchPageData(params.slug);

  if (!pageData) return {};

  return {
    title: pageData.meta_title || pageData.page_title,
    alternates: {
      canonical: getCanonicalUrl(`/page/${params.slug}`),
    },
  };
}

export default async function Page(props: Props) {
  const params = await props.params;

  const pageData = await fetchPageData(params.slug);

  if (!pageData) {
    return <div>Page not found</div>;
  }

  return <PageClient pageData={pageData} />;
}
