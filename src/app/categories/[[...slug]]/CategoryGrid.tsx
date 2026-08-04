"use client";

import Link from "next/link";
import { useCity } from "@/context/CityContext";
import { useEffect, useState } from "react";
import { categoryItem, useCategories } from "@/hooks/useCategories";
import { ChevronLeftIcon } from "lucide-react";

type CategoriesClientProps = {
  data: any;
};

export default function CategoryGrid({ data }: CategoriesClientProps) {
  const { cityDetails } = useCity();
  const [schema, setSchema] = useState<string | null>(null);
  const { categoriesItems, loading } = useCategories();
  const categories = categoriesItems || {};

  useEffect(() => {
    if (!categories) return;
    if (data.meta_schema) {
      setSchema(data.meta_schema.replace(/<script.*?>|<\/script>/g, ""));
    }
  }, [categories]);

  if (loading || !categories) {
    return <div className="text-center py-10">Loading Categories...</div>;
  }

  return (
    <div>
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: schema }}
        />
      )}

      {categories.length > 0 ? (
        <section className="my-8 px-4">
          <div className="flex items-center gap-2 mb-6">
            <Link href={`/`}>
              <ChevronLeftIcon className="size-7" />
            </Link>
            <h2 className="text-lg font-semibold text-gray-800">
              Popular Health Checkup Categories
            </h2>
          </div>

          {/* Grid Layout: 3 items per row for mobile */}
          <div className="grid grid-cols-3 gap-x-3 gap-y-8">
            {categories.length === 0 && (
              <p className="text-center col-span-3 text-gray-500">
                No categories available.
              </p>
            )}
            {categories.map((category: categoryItem) => (
              <Link
                href={`/category/${cityDetails?.slug}/${category.slug}`}
                key={category.id}
                className="flex flex-col items-center group"
              >
                {/* Card Style: Consistent with the Condition grid */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 h-22 w-24 flex items-center justify-center transition-all active:scale-95 overflow-hidden">
                  {category.image ? (
                    <img
                      src={category.image}
                      alt={category.name}
                      className="h-10 w-10 object-contain"
                    />
                  ) : (
                    /* Fallback for items with empty image strings like 'Body Checkup' */
                    <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <span className="text-[10px] text-gray-400">No Icon</span>
                    </div>
                  )}
                </div>

                {/* Label Style */}
                <p className="mt-2 text-sm text-gray-700 text-center font-medium leading-tight line-clamp-2 px-1">
                  {category.name}
                </p>
              </Link>
            ))}
          </div>
        </section>
      ) : (
        <p className="text-center col-span-3 my-10 text-gray-500">
          No categories available.
        </p>
      )}
    </div>
  );
}
