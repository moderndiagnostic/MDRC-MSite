"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { ChevronRight, Loader2 } from "lucide-react";
import { useCity } from "@/context/CityContext";
import { useDashboard } from "@/context/DashboardContext";

interface PopularCategory {
  ID: string;
  image: string;
  name: string;
  slug: string;
  type: string;
}

export default function MostBookedCheckupCarts() {
  const [slide, setSlide] = useState(0);
  const { cityDetails } = useCity();
  const { homeData, loading } = useDashboard();

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const itemsPerSlide = 4;

  const categories = homeData?.popular_category || [];

  const groupedSlides: PopularCategory[][] = [];

  for (let i = 0; i < categories.length; i += itemsPerSlide) {
    groupedSlides.push(categories.slice(i, i + itemsPerSlide));
  }

  const totalSlides = groupedSlides.length;

  useEffect(() => {
    if (totalSlides <= 1) return;

    const timer = setInterval(() => {
      setSlide((prev) => (prev + 1) % totalSlides);
    }, 5000);

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
      <div className="flex justify-center items-center py-10">
        <Loader2 className="animate-spin text-blue-500" />
      </div>
    );
  }

  if (categories.length === 0) return null;

  return (
    <div className="relative w-full overflow-hidden">
      <div className="overflow-hidden relative py-4">
        {/* SLIDER */}
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
              className="min-w-full grid grid-cols-2 items-start gap-4 px-4"
            >
              {group.map((item, index) => {
                const isBlue = index === 0 || index === 3;

                return (
                  <div
                    key={item.ID}
                    className="rounded-2xl shadow-[0_0_15px_rgba(0,0,0,0.15)] bg-white overflow-hidden flex flex-col"
                  >
                    <Link
                      href={
                        item.type === "category"
                          ? `/category/${cityDetails?.slug}/${item.slug}`
                          : item.type === "item"
                            ? `/tests/${item.slug}/${cityDetails?.slug}`
                            : "#"
                      }
                      className="flex flex-col h-full"
                    >
                      {/* Image */}
                      <div className="flex justify-center items-center h-24 p-2 flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-14 w-auto object-contain"
                        />
                      </div>

                      {/* Footer */}
                      <div
                        className={`${
                          isBlue ? "gradient-blue" : "bg-[#1CC88A]"
                        } text-white px-4 py-3 flex justify-between items-center min-h-[64px]`}
                      >
                        <p className="font-medium text-sm leading-tight break-words">
                          {item.name}
                        </p>

                        <span
                          className={`bg-white ${
                            isBlue ? "tx-blue" : "text-[#1CC88A]"
                          } h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0 ml-2`}
                        >
                          <ChevronRight size={18} />
                        </span>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* DOT INDICATOR */}
        {totalSlides > 1 && (
          <div className="flex justify-center items-center gap-2 mt-6">
            {groupedSlides.map((_, i) =>
              slide === i ? (
                <span
                  key={i}
                  className="bg-gradient-to-b from-[#727070] to-[#C1C1C1] text-white text-[10px] px-2.5 py-1 rounded-full font-medium"
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
    </div>
  );
}
