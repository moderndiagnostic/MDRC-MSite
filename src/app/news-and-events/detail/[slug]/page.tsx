"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
} from "lucide-react";

import requests from "@/lib/httpServices";

export default function NewsDetailPage() {
  const { slug } = useParams<{ slug: string }>();

  const [news, setNews] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  /* ---------- NEWS DETAIL ---------- */
  const resolveNewsAndFetchDetail = async () => {
    try {

      const detailRes = await requests.post("/webApi/index.php", {
        view: "news_detail",
        deviceType: "Android",
        detailSlug: slug,
      });

      const newsData = detailRes?.data?.newsDetail?.[0];
      const categoryData = detailRes?.data?.categories;

      if (newsData) {
        setNews(newsData);
      }

      if (Array.isArray(categoryData)) {
        setCategories(categoryData);
      }
    } catch (error) {
      console.error("News detail fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    resolveNewsAndFetchDetail();
  }, [slug]);

  if (loading) return null;
  if (!news) return null;

  const tags = news.tags ? news.tags.split(",").filter(Boolean) : [];

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <section className="w-full">
        <div className="px-6 pt-3 text-sm text-gray-400">
          Home <span className="mx-1">{">"}</span> News
          <span className="mx-1">{">"}</span> {news.category}
        </div>
      </section>

      <article className="max-w-md mx-auto px-4 pb-6 space-y-6">
        <h1 className="text-xl font-semibold text-gray-800 leading-snug">
          {news.name}
        </h1>

        <div className="rounded-xl overflow-hidden">
          <Image
            src={news.image}
            alt={news.name}
            width={400}
            height={220}
            className="w-full h-56 object-cover"
          />
        </div>

        <div
          className="text-sm text-gray-600 space-y-4 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: news.detail }}
        />

        {/* Tags */}
        {tags.length > 0 && (
          <div>
            <p className="text-base font-semibold text-gray-700 mb-3">
              Related Tags
            </p>

            <div className="flex gap-3 flex-wrap">
              {tags.map((tag: string) => (
                <span
                  key={tag}
                  className="px-5 py-2 text-sm font-medium rounded-xl
                  border border-tx-green tx-green w-max"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Categories */}
        {categories.length > 0 && (
          <div className="space-y-3">
            <p className="text-base font-semibold text-gray-700">
              News Category
            </p>

            <div className="space-y-2">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/news-and-events/category/${cat.slug}`}
                  className="flex items-center justify-between
                    bg-[#1f73b7] text-white
                    px-4 py-3 rounded-md
                    hover:bg-[#185a8d]"
                >
                  <span className="text-sm font-medium">{cat.name}</span>
                  <ArrowRight />
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Share */}
        {/* <div className="pt-4">
          <p className="text-base font-semibold text-gray-700 mb-3">Share</p>

          <div className="flex gap-3">
            {[Instagram, Facebook, Linkedin, Twitter].map((Icon, i) => (
              <div
                key={i}
                className="h-10 w-10 rounded-lg bg-gray-100
                flex items-center justify-center"
              >
                <Icon className="h-5 w-5 text-gray-600" />
              </div>
            ))}
          </div>
        </div> */}
      </article>
    </div>
  );
}
