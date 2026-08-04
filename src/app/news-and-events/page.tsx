"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";
import requests from "@/lib/httpServices";

/* ===== TYPE ===== */
type News = {
  id: string;
  slug: string;
  name: string;
  short_info: string;
  image: string;
  category: string;
};

export default function NewsPage() {
  const [news, setNews] = useState<News[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [sort, setSort] = useState("latest");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [initialLoading, setInitialLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasFetchedOnce, setHasFetchedOnce] = useState(false);

  /* ===== FETCH NEWS ===== */
  const fetchNews = async (pageNo: number, reset = false) => {
    try {
      pageNo === 0 ? setInitialLoading(true) : setLoadingMore(true);

      const res = await requests.post("/webApi/index.php", {
        view: "news_list",
        deviceType: "Android",
        search: debouncedSearch,
        page: pageNo,
        sort_by: sort === "oldest" ? "old" : "latest",
      });

      const newsList: News[] = res?.data?.newsList || [];

      setNews((prev) => (reset ? newsList : [...prev, ...newsList]));

      if (newsList.length === 0) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("News API Error:", error);
      setHasMore(false);
    } finally {
      setInitialLoading(false);
      setLoadingMore(false);
      setHasFetchedOnce(true);
    }
  };

  useEffect(() => {
    setPage(0);
    setHasMore(true);
    setHasFetchedOnce(false);
    fetchNews(0, true);
  }, [sort, debouncedSearch]);

  const loadMore = () => {
    if (loadingMore || !hasMore) return;

    const nextPage = page + 1;
    setPage(nextPage);
    fetchNews(nextPage);
  };

  return (
    <div className="space-y-6">
      {/* ===== HEADER ===== */}
      <section className="w-full">
        <div className="px-6 py-3 text-sm text-gray-400">
          Home <span className="mx-1">{">"}</span> News
        </div>

        <section className="grid">
          <div className="gradient-blue p-4">
            <h2 className="mb-3 font-semibold text-white text-lg">
              News and Events
            </h2>
            <p className="text-white mb-3">
              Latest medical news and healthcare events you can trust.
            </p>
          </div>
        </section>

        {/* ===== SEARCH & SORT ===== */}
        <div className="flex justify-between gap-3 px-6 py-4">
          {/* Search */}
          <div className="relative w-full">
            <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Search news..."
              onChange={(e) => setDebouncedSearch(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-1 focus:ring-gradient-blue-2"
            />
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-medium text-gradient-blue-2 shadow-sm focus:outline-none focus:ring-1 focus:ring-gradient-blue-2"
            >
              <option value="latest">Latest</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>
        </div>
      </section>

      {/* ===== NEWS LIST ===== */}
      <section className="px-4 py-6">
        <div className="space-y-6">
          {news.map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.25)] overflow-visible "
            >
              <Link
                href={`/news-and-events/detail/${item.slug}`}
                onClick={() => {
                  sessionStorage.setItem("newsId", item.id);
                }}
              >
                {/* Image */}
                <Image
                  src={item.image}
                  alt={item.name}
                  width={400}
                  height={200}
                  className="w-full h-44 object-cover p-4 rounded-2xl"
                />

                {/* Content */}
                <div className="p-4">
                  <h3 className="tx-blue font-semibold text-base">
                    {item.name}
                  </h3>

                  {/* 3-line limit */}
                  <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                    {item.short_info}
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>
        {/* Load More Button */}
        {hasFetchedOnce && !initialLoading && hasMore && (
          <div className="w-full text-center">
            <button
              onClick={loadMore}
              disabled={loadingMore}
              className={`mt-6 mb-4 py-2 px-6 rounded text-[#189ED3] border font-medium shadow
              ${
                loadingMore
                  ? "border-gray-400 cursor-not-allowed"
                  : "border-[#189ED3]"
              }`}
            >
              {loadingMore ? "Loading..." : "Load More"}
            </button>
          </div>
        )}
        {!hasMore && page > 1 && (
          <p className="text-center py-6 text-gray-400">
            You’ve reached the end
          </p>
        )}
      </section>
    </div>
  );
}
