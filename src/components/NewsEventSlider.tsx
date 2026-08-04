"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import requests from "@/lib/httpServices"; // Adjust path based on your folder structure

// Define the shape of the API data
interface NewsItem {
  id: string;
  slug: string;
  name: string;
  short_info: string;
  image: string;
}

export default function NewsEventSlider() {
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [slide, setSlide] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  const totalSlides: number = newsList.length;
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Fetch data from API
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await requests.post("/webApi/index.php", {
          view: "news_list",
          deviceType: "Android",
          page: "0",
        });

        if (response.msgCode === "1" && response.data?.newsList) {
          setNewsList(response.data.newsList);
        }
      } catch (error) {
        console.error("Failed to fetch news:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  // Auto-slide logic
  useEffect(() => {
    if (totalSlides === 0) return;

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

  if (loading || totalSlides === 0) {
    return <div className="text-center my-8">Loading News...</div>;
  }

  return (
    <section className="my-8 px-4">
      <h2 className="text-center text-xl font-semibold mb-4">
        News and Events
      </h2>

      <div className="overflow-hidden relative px-4 pb-4">
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${slide * 100}%)` }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {newsList.map((item) => (
            <div key={item.id} className="min-w-full flex justify-center">
              <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl shadow-gray-300 p-3 mx-2">
                {/* Dynamic Link using slug */}
                <Link href={`/news-and-events/detail/${item.slug}`}>
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-48 object-cover rounded-xl"
                  />
                  <p className="tx-blue text-xl font-medium mt-6 line-clamp-1">
                    {item.name}
                  </p>
                  <p className="text-sm pt-3 line-clamp-3">{item.short_info}</p>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Dots */}
        <div className="flex justify-center items-center gap-2 mt-4">
          {newsList.map((_, i) =>
            slide === i ? (
              <span
                key={i}
                className="bg-gradient-to-b from-[#727070] to-[#C1C1C1] text-white text-xs px-2 py-1 rounded-full font-medium"
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
      </div>
    </section>
  );
}
