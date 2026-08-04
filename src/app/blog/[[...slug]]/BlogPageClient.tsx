"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Edit, Search } from "lucide-react";
import FaqAccordion from "@/components/FaqAccordion";
import requests from "@/lib/httpServices";
import { useParams } from "next/navigation";

type Blog = {
  id: string;
  slug: string;
  name: string;
  short_info: string;
  image: string;
  category: string;
};

type Props = {
  initialData: {
    blogList: Blog[];
    categories?: any[];
    heading?: string;
    title?: string;
  };
};

export default function BlogPageClient({ initialData }: Props) {
  const [blogs, setBlogs] = useState<Blog[]>(initialData.blogList || []);
  const [categories, setCategories] = useState(initialData.categories || []);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [sort, setSort] = useState("latest");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loadingMore, setLoadingMore] = useState(false);
  const params = useParams();
  const filterBy = params?.slug?.[0];
  const filterValue = params?.slug?.[1];

  const fetchBlogs = async (pageNo: number, reset = false) => {
    try {
      setLoadingMore(true);
      const res = await requests.post("/webApi/index.php", {
        view: "blog_list",
        deviceType: "Android",
        search: debouncedSearch,
        page: pageNo,
        sort_by: sort === "oldest" ? "old" : "latest",
        filter_by: filterBy ?? "",
        filter_value: filterValue ?? "",
      });

      const blogList: Blog[] = res?.data?.blogList || [];
      setBlogs((prev) => (reset ? blogList : [...prev, ...blogList]));
      if (res?.data?.categories) setCategories(res.data.categories);

      if (blogList.length === 0) setHasMore(false);
    } catch (error) {
      console.error("Blog API Error:", error);
      setHasMore(false);
    } finally {
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    setPage(0);
    setHasMore(true);
    fetchBlogs(0, true);
  }, [sort, debouncedSearch]);

  const loadMore = () => {
    if (loadingMore || !hasMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    fetchBlogs(nextPage);
  };

  return (
    <div className="space-y-4">
      {/* ===== Header ===== */}
      <section className="w-full">
        <div className="px-6 py-3 text-sm text-gray-400">
          <Link href="/" className="hover:text-[#1f73b7] tx-blue transition">
            Home
          </Link>
          <span className="mx-1">{">"}</span> Blogs
        </div>

        <div className="bg-linear-to-r from-[#0B6FAF] to-[#1BA9E1] py-14 px-6 text-center">
          <p className="text-white/90 text-sm mb-2">{initialData?.heading}</p>

          <h1 className="text-white text-3xl font-semibold">
            {initialData?.title}
          </h1>
        </div>

        {/* Sort/Search */}
        <div className="flex justify-between gap-3 px-4 py-4">
          <div className="relative w-full">
            <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Search blogs..."
              onChange={(e) => setDebouncedSearch(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-700 shadow-sm focus:gradient-blue-2 focus:outline-none focus:ring-1 focus:ring-gradient-blue-2"
            />
          </div>

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

      {/* Blogs List */}
      <section className="px-4 pb-6 space-y-6">
        {blogs.map((blog, i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow-md overflow-hidden"
          >
            <Link href={`/blog/detail/${blog.slug}`}>
              <Image
                src={blog.image}
                alt={blog.name || "blog"}
                width={400}
                height={200}
                className="w-full h-44 object-cover"
              />
              <div className="p-4">
                <h3 className="tx-blue font-semibold text-base">{blog.name}</h3>
                <p className="text-sm text-gray-600 mt-2">{blog.short_info}</p>
                {/* <span className="tx-green text-sm font-medium mt-2 inline-block">
                  Read More
                </span> */}
              </div>
              <div className="bg-linear-to-r from-[#19B37A] to-[#0FAE70] text-white flex justify-between px-4 py-3">
                <span className="text-sm">{blog.category}</span>
              </div>
            </Link>
          </div>
        ))}
        {hasMore && (
          <div className="w-full text-center">
            <button
              onClick={loadMore}
              disabled={loadingMore}
              className={`mt-6 mb-4 py-2 px-6 rounded text-[#189ED3] border font-medium shadow ${
                loadingMore
                  ? "border-gray-400 cursor-not-allowed"
                  : "border-[#189ED3]"
              }`}
            >
              {loadingMore ? "Loading..." : "Load More"}
            </button>
          </div>
        )}

        {!hasMore && blogs.length > 0 && (
          <p className="text-center py-6 text-gray-400">
            You’ve reached the end
          </p>
        )}
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <div className="max-w-md mx-auto px-4 py-3 space-y-6">
          <p className="text-base font-semibold text-gray-700">Blog Category</p>
          <div className="space-y-2">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/blog/category/${cat.slug}`}
                className="flex items-center justify-between bg-[#1f73b7] text-white px-4 py-3 rounded-md hover:bg-[#185a8d]"
              >
                <span className="text-sm font-medium">{cat.name}</span>
                <span className="text-sm font-semibold">
                  <ArrowRight />
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* FAQ */}
      <section className="pb-6">
        <FaqAccordion pageType={""} />
      </section>
    </div>
  );
}
