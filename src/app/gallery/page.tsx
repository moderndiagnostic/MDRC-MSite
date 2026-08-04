// app/gallery/page.tsx
import GallerySection from "./GalleryPageClient";
import { generateMetadataFromData, getCanonicalUrl } from "@/utils/meta";
import requests from "@/lib/httpServices";
import { Metadata } from "next";

interface GalleryApiResponse {
  galleryList: any[];
  galleryVideoList: any[];
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  favicon?: string;
  meta_schema?: string;
  openGraphImage?: string;
}

async function fetchGalleryData(): Promise<GalleryApiResponse> {
  try {
    const res = await requests.post("/webApi/index.php", {
      view: "gallery",
    });
    return res.data || {};
  } catch (err) {
    console.error("Failed to fetch gallery data", err);
    return {} as GalleryApiResponse;
  }
}

// ✅ Generate Metadata for Next.js App Router
export async function generateMetadata(): Promise<Metadata> {
  const data = await fetchGalleryData();

  return generateMetadataFromData({
    meta_title: data.meta_title,
    meta_description: data.meta_description,
    meta_keywords: data.meta_keywords,
    favicon: data.favicon,
    canonical: getCanonicalUrl("/gallery"),
    openGraphImage: data.openGraphImage,
  });
}

const GalleryPage = async () => {
  return <GallerySection />;
};

export default GalleryPage;
