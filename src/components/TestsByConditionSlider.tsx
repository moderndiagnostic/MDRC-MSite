"use client";

import { useCity } from "@/context/CityContext";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";

const ITEMS_PER_SLIDE = 6;

export default function TestsByConditionSlider({
  diseases = [],
}: {
  diseases: any[];
}) {
  const [active, setActive] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const { cityDetails } = useCity();

  const totalSlides = Math.ceil(diseases.length / ITEMS_PER_SLIDE);

  useEffect(() => {
    setActive(0);
  }, [diseases]);

  const handleTouchStart = (e: any) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: any) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > 50) {
      setActive((prev) => (prev + 1) % totalSlides);
    } else if (touchEndX.current - touchStartX.current > 50) {
      setActive((prev) => (prev - 1 + totalSlides) % totalSlides);
    }
  };

  if (!diseases.length) return null;

  return (
    <section className="my-8 ">
      <div className="flex justify-between  mb-4 mx-6">
        <h2 className="text-lg font-semibold leading-tight text-gray-800">
          Test By Condition
        </h2>

        <Link href="/health-risk">
          <button className="text-md tx-light-blue font-semibold flex items-center gap-1">
            VIEW ALL
            <ChevronRight size={20} />
          </button>
        </Link>
      </div>

      {/* Slider */}
      <div className="overflow-hidden relative">
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${active * 100}%)` }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {Array.from({ length: totalSlides }).map((_, slideIndex) => (
            <div key={slideIndex} className="min-w-full px-3">
              <div className="grid grid-cols-3 gap-x-3 gap-y-4">
                {diseases
                  .slice(
                    slideIndex * ITEMS_PER_SLIDE,
                    slideIndex * ITEMS_PER_SLIDE + ITEMS_PER_SLIDE,
                  )
                  .map((item: any, index: number) => (
                    <div key={index} className="flex flex-col items-center">
                      <Link
                        href={`/diseases/${cityDetails?.slug}/${item.slug}`}
                      >
                        {/* ICON BOX (UNCHANGED) */}
                        <div className="gradient-light-gray rounded-2xl shadow-sm h-22 w-24 flex items-center justify-center">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-10"
                          />
                        </div>

                        {/* LABEL (UNCHANGED) */}
                        <p className="mt-1 text-sm text-gray-700 text-center">
                          {item.name}
                        </p>
                      </Link>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>

        {/* DOTS + COUNTER (UNCHANGED) */}
        <div className="flex justify-center items-center gap-2 mt-3">
          {Array.from({ length: totalSlides }).map((_, i) =>
            active === i ? (
              <span
                key={i}
                className="bg-gradient-to-b from-[#727070] to-[#C1C1C1]
 text-white text-xs px-2 py-1 rounded-full font-medium"
              >
                {i + 1}/{totalSlides}
              </span>
            ) : (
              <span
                key={i}
                onClick={() => setActive(i)}
                className="h-2 w-2 rounded-full cursor-pointer bg-gray-300"
              />
            ),
          )}
        </div>
      </div>
    </section>
  );
}
