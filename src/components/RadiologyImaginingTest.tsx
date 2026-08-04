"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useDashboard } from "@/context/DashboardContext";
import { useCity } from "@/context/CityContext";

interface RadiologyTest {
  name: string;
  slug: string;
  short_description: string;
  image: string;
  url: string;
  starting_price?: string | null;
}

const RadiologyImaginingTest = () => {
  const [slide, setSlide] = useState<number>(0);
  const { homeData, loading } = useDashboard();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const tests = homeData?.radiologyAndImagingTest as RadiologyTest[];
  const { cityDetails } = useCity();
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const itemsPerSlide = 2;
  const groupedSlides = [];

  for (let i = 0; i < tests.length; i += itemsPerSlide) {
    groupedSlides.push(tests.slice(i, i + itemsPerSlide));
  }

  const totalSlides = groupedSlides.length;

  useEffect(() => {
    if (totalSlides <= 1) return;
    const timer = setInterval(() => {
      setSlide((prev) => (prev + 1) % totalSlides);
    }, 4000);
    return () => clearInterval(timer);
  }, [totalSlides]);

  const handleTouchStart = (e: any) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchMove = (e: any) => {
    touchEndX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > 50) {
      setSlide((prev) => (prev + 1) % totalSlides);
    } else if (touchEndX.current - touchStartX.current > 50) {
      setSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="animate-spin text-[#0a6baf]" size={40} />
      </div>
    );
  }

  return (
    <section className="mt-8 gradient-light-blue-2 pt-6 px-4">
      {/* Heading */}
      <h2 className="text-center text-xl font-semibold text-gray-800 mb-6">
        Radiology Scans & Imaging Tests
      </h2>

      {/* Slider Container */}
      <div className="overflow-hidden relative px-1 pb-4">
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${slide * 100}%)` }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {groupedSlides.map((group, groupIdx) => (
            <div
              key={groupIdx}
              className="min-w-full grid grid-cols-2 gap-4 px-2"
            >
              {group.map((test, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-[0_0_6px_rgba(0,0,0,0.15)] p-3 flex flex-col items-center text-center justify-between"
                >
                  <div className="flex flex-col items-center">
                    <Link href={`/category/${cityDetails?.slug}/${test.slug}`}>
                      <img
                        src={test.image}
                        alt={test.name}
                        className="h-16 w-auto object-contain mb-4"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "/assets/images/placeholder.png";
                        }}
                      />
                      <p className="tx-light-blue font-medium text-sm line-clamp-2 leading-tight">
                        {test.name}
                      </p>
                    </Link>
                    {/* Price Logic: Only show if price exists and is not empty */}
                    {test.starting_price && test.starting_price !== "" && (
                      <p className="text-gray-600 text-xs mt-1">
                        {test.starting_price}
                      </p>
                    )}

                    <div className="text-xs mt-2">
                      <p
                        className={
                          expandedIndex === groupIdx * itemsPerSlide + index
                            ? ""
                            : "line-clamp-1"
                        }
                      >
                        {test.short_description}
                      </p>

                      {test.short_description &&
                        test.short_description.length > 40 && (
                          <button
                            className="text-green-800 text-[10px] font-medium mt-1"
                            onClick={() =>
                              setExpandedIndex(
                                expandedIndex ===
                                  groupIdx * itemsPerSlide + index
                                  ? null
                                  : groupIdx * itemsPerSlide + index,
                              )
                            }
                          >
                            {expandedIndex === groupIdx * itemsPerSlide + index
                              ? "Read Less"
                              : "Read More"}
                          </button>
                        )}
                    </div>
                  </div>

                  <Link
                    href={`/category/${cityDetails?.slug}/${test.slug}`}
                    className="w-full"
                  >
                    <button className="mt-3 w-full border border-emerald-500 tx-green rounded-lg px-2 py-1.5 text-[10px] font-bold hover:bg-emerald-50 transition-colors uppercase">
                      VIEW MORE
                    </button>
                  </Link>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Dots / Pagination */}
        {totalSlides > 1 && (
          <div className="flex justify-center items-center gap-2 mt-6">
            {groupedSlides.map((_, i) =>
              slide === i ? (
                <span
                  key={i}
                  className="bg-gradient-to-b from-[#727070] to-[#C1C1C1] text-white text-[10px] px-2 py-0.5 rounded-full font-medium"
                >
                  {i + 1}/{totalSlides}
                </span>
              ) : (
                <span
                  key={i}
                  onClick={() => setSlide(i)}
                  className="h-2 w-2 rounded-full cursor-pointer bg-gray-300"
                />
              ),
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default RadiologyImaginingTest;
