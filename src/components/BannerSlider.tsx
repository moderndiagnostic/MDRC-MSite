"use client";

import { useEffect, useState, useRef } from "react";

interface BannerItem {
  ID: string;
  image: string;
  itemID?: string;
  page?: string;
}

interface BannerSliderProps {
  banners: BannerItem[];
}

export default function BannerSlider({ banners }: BannerSliderProps) {
  const [index, setIndex] = useState(0);
  const [loadedStatus, setLoadedStatus] = useState<boolean[]>(
    new Array(banners.length).fill(false),
  );

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  /* ✅ AUTO SLIDE */
  // useEffect(() => {
  //   if (!banners.length) return;

  //   const interval = setInterval(() => {
  //     setIndex((prev) => (prev + 1) % banners.length);
  //   }, 4000);

  //   return () => clearInterval(interval);
  // }, [banners.length]);

  /* Reset shimmer when banners change */
  useEffect(() => {
    setLoadedStatus(new Array(banners.length).fill(false));
    setIndex(0);
  }, []);

  const handleImageLoad = (i: number) => {
    setLoadedStatus((prev) => {
      const next = [...prev];
      next[i] = true;
      return next;
    });
  };

  const handleTouchStart = (e: any) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: any) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > 50) {
      setIndex((prev) => (prev + 1) % banners.length);
    } else if (touchEndX.current - touchStartX.current > 50) {
      setIndex((prev) => (prev - 1 + banners.length) % banners.length);
    }
  };

  if (!banners.length) return null;

  return (
    <>
      <div className="relative overflow-hidden mb-0">
        {/* SHIMMER CSS */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
            @keyframes shimmerSweep {
              0% { transform: translateX(-100%) skewX(-20deg); }
              100% { transform: translateX(100%) skewX(-20deg); }
            }
            .shimmer-wrapper {
              position: absolute;
              inset: 0;
              background-color: #E0E0E0;
              overflow: hidden;
              z-index: 21;
            }
            .shimmer-beam {
              position: absolute;
              inset: 0;
              background: linear-gradient(to right, transparent, rgba(255,255,255,0.6), transparent);
              animation: shimmerSweep 1.5s infinite linear;
            }
          `,
          }}
        />

        {/* SLIDES */}
        <div
          className="flex transition-transform duration-700 ease-in-out relative banner-skeleton z-20"
          style={{ transform: `translateX(-${index * 100}%)` }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {banners.map((item, i) => (
            // <div key={item.ID ?? i} className="min-w-full relative mb-0">
            //   {!loadedStatus[i] && (
            //     <div className="shimmer-wrapper">
            //       <div className="shimmer-beam" />
            //     </div>
            //   )}

            //   <img
            //     src={item.image}
            //     alt={`banner-${i}`}
            //     onLoad={() => handleImageLoad(i)}
            //     className={`w-full p-3 pb-5 h-auto object-cover transition-opacity duration-500 z-10  ${
            //       loadedStatus[i] ? "opacity-100" : "opacity-0"
            //     }`}
            //   />
            // </div>

            <div key={item.ID ?? i} className="min-w-full mb-0 p-3 ">
              <div className="relative overflow-hidden">
                {/* Wrap the item.page inside an anchor link */}
                {item?.page ? (
                  <a href={item.page} rel="noopener noreferrer">
                    <img
                      src={item.image}
                      alt={`banner-${i}`}
                      onLoad={() => handleImageLoad(i)}
                      className="w-full h-auto object-cover transition-opacity duration-500"
                    />
                  </a>
                ) : (
                  // If item.page is not available, just display the image without a link
                  <img
                    src={item.image}
                    alt={`banner-${i}`}
                    onLoad={() => handleImageLoad(i)}
                    className="w-full h-auto object-cover transition-opacity duration-500"
                  />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* DOTS */}
        <div className="w-full gradient-blue pt-4 pb-3 -mt-5">
          <div className="flex justify-center gap-2">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`h-2 cursor-pointer w-2 rounded-full ${
                  index === i
                    ? "bg-white"
                    : "border border-white bg-transparent opacity-70"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
