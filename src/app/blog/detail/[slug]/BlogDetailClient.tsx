"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Edit,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
} from "lucide-react";
import FaqAccordion from "@/components/FaqAccordion";
import requests from "@/lib/httpServices";

type BlogDetailClientProps = {
  data: any;
};

export default function BlogDetailClient({ data }: BlogDetailClientProps) {
  const [relatedBlogs, setRelatedBlogs] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [schema, setSchema] = useState<string | null>(null);

  const blog = data?.blogDetail;

  useEffect(() => {
    if (!blog) return;

    if (Array.isArray(data.categories)) setCategories(data.categories);

    if (data.meta_schema) {
      setSchema(data.meta_schema.replace(/<script.*?>|<\/script>/g, ""));
    }

    const fetchRelatedBlogs = async (blogId: string) => {
      try {
        const res = await requests.post("/webApi/index.php", {
          view: "blog_list",
          deviceType: "Android",
          relatedBlogId: blogId,
          page: 0,
        });
        setRelatedBlogs((res?.data?.blogList || []).slice(0, 10));
      } catch (error) {
        console.error("Error fetching related blogs:", error);
      }
    };

    fetchRelatedBlogs(blog.id);

    window.scrollTo({ top: 0, behavior: "auto" });
  }, [blog]);

  if (!blog) return null;

  return (
    <div>
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: schema }}
        />
      )}

      {/* <section className="w-full">
        <div className="px-6 py-3 text-sm text-gray-400">
          Home <span className="mx-1">{">"}</span> Blog
          <span className="mx-1">{">"}</span> {blog.category}
        </div>
      </section> */}

      <section className="w-full">
        <div className="px-6 py-3 text-sm text-gray-500 flex flex-wrap items-center gap-1">
          <Link href="/" className="hover:text-[#1f73b7] tx-blue transition">
            Home
          </Link>

          <span>{">"}</span>

          <Link
            href="/blog"
            className="hover:text-[#1f73b7] tx-blue transition"
          >
            Blogs
          </Link>

          <span>{">"}</span>

          <span>{blog?.category}</span>
        </div>
      </section>

      <article className="max-w-md mx-auto px-4 py-6 space-y-6">
        <h1 className="text-xl font-semibold text-gray-800 leading-snug">
          {blog.name}
        </h1>

        <div className="rounded-xl overflow-hidden">
          <Image
            src={blog.image}
            alt={blog.name || "blog image"}
            width={400}
            height={220}
            className="w-full h-56 object-cover"
          />
        </div>

        <div
          className="text-sm text-gray-600 space-y-4 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: blog.detail }}
        />

        {/* Tags */}
        {blog?.tags_array?.length > 0 && (
          <div>
            <p className="text-base font-semibold text-gray-700 mb-3">
              Related Tags
            </p>

            <div className="flex gap-3 flex-wrap">
              {blog?.tags_array?.map((tag: any) => (
                <Link
                  key={tag?.id}
                  href={`/blog/tag/${tag?.slug}`}
                  className="px-5 py-2 text-sm font-medium rounded-xl border border-tx-green tx-green w-max"
                >
                  {tag?.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Categories */}
        {categories.length > 0 && (
          <div className="space-y-3">
            <p className="text-base font-semibold text-gray-700">
              Blog Category
            </p>

            <div className="space-y-2">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/blog/category/${cat.slug}`}
                  className="flex items-center justify-between bg-[#1f73b7] text-white px-4 py-3 rounded-md hover:bg-[#185a8d]"
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
                className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center"
              >
                <Icon className="h-5 w-5 text-gray-600" />
              </div>
            ))}
          </div>
        </div> */}
      </article>

      {/* Related Blogs */}
      <section className="px-4 py-6 space-y-6">
        <h2 className="text-xl font-semibold text-gray-800 text-center">
          Related Blogs
        </h2>

        {relatedBlogs.map((b) => (
          <div
            key={b.id}
            className="bg-white rounded-xl shadow-md overflow-hidden"
          >
            <Link href={`/blog/detail/${b.slug}`}>
              <Image
                src={b.image}
                alt={b.name}
                width={400}
                height={200}
                className="w-full h-44 object-cover"
              />

              <div className="p-4">
                <h3 className="tx-blue font-semibold text-base">{b.name}</h3>
                <p className="text-sm text-gray-600 mt-2">{b.short_info}</p>
                {/* <span className="tx-green text-sm font-medium mt-2 inline-block">
                  Read More
                </span> */}
              </div>

              <div className="bg-linear-to-r from-[#19B37A] to-[#0FAE70] text-white flex items-center justify-between px-4 py-3">
                <span className="text-sm">{b.category}</span>
              </div>
            </Link>
          </div>
        ))}
      </section>

      <FaqAccordion pageType="blog" />
    </div>
  );
}
