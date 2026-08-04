"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useCity } from "@/context/CityContext";

export default function PopularHealthCheckupSlider({
  category = [],
}: {
  category: any[];
}) {
  const slideWidth = 70;
  const total = category.length;
  const slides = [...category, ...category, ...category];
  const [index, setIndex] = useState(total);
  const { cityDetails } = useCity();

  const startX = useRef(0);
  const endX = useRef(0);
  const timer = useRef<NodeJS.Timeout | null>(null);

  const startAutoPlay = () => {
    stopAutoPlay();
    timer.current = setInterval(() => {
      setIndex((prev) => prev + 1);
    }, 3000);
  };

  const stopAutoPlay = () => {
    if (timer.current) clearInterval(timer.current);
  };

  useEffect(() => {
    if (!total) return;
    startAutoPlay();
    return stopAutoPlay;
  }, [total]);

  useEffect(() => {
    if (!total) return;

    if (index >= total * 2) {
      setIndex(total);
    }
    if (index <= total - 1) {
      setIndex(total * 2 - 1);
    }
  }, [index, total]);

  const onTouchStart = (e: React.TouchEvent) => {
    stopAutoPlay();
    startX.current = e.touches[0].clientX;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    endX.current = e.touches[0].clientX;
  };

  const onTouchEnd = () => {
    const diff = startX.current - endX.current;

    if (diff > 50) setIndex((prev) => prev + 1);
    if (diff < -50) setIndex((prev) => prev - 1);

    startAutoPlay();
  };

  if (!total) return null;

  return (
    <div className="my-8">
      {/* Header (UNCHANGED) */}
      <div className="flex justify-between mb-0">
        <h2 className="text-lg font-semibold leading-tight text-gray-800">
          Popular Health Checkup
          <br />
          Categories
        </h2>

        <Link href="/categories">
          <button className="text-md tx-light-blue font-semibold flex items-center gap-1">
            VIEW ALL
            <ChevronRight size={20} />
          </button>
        </Link>
      </div>

      {/* Slider (UNCHANGED) */}
      <div className="relative overflow-hidden py-6">
        <div
          className="flex gap-4 transition-transform duration-500 ease-out"
          style={{
            transform: `translateX(-${index * slideWidth}%)`,
          }}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {slides.map((item, i) => (
            <Link
              key={i}
              href={`/category/${cityDetails?.slug}/${item.slug}`}
              className="shrink-0"
              style={{ width: "70%" }}
            >
              <div className="bg-white rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.15)] px-4 py-3 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full flex items-center justify-center">
                  <img src={item.image} alt={item.name} className="h-8 w-8" />
                </div>
                <p className="font-semibold tx-blue">{item.name}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom fade (UNCHANGED) */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-white to-transparent" />
      </div>
    </div>
  );
}
