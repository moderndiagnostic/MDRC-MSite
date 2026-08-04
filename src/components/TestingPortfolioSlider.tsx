"use client";

import { useState, useRef } from "react";

const slides = [
  {
    title: "Imaging",
    image: "https://www.mdrcindia.com/images/sl-1.png",
  },
  {
    title: "Pathology",
    image: "https://www.mdrcindia.com/images/sl-2.png",
  },
  {
    title: "High end Pathology",
    image: "https://www.mdrcindia.com/images/sl-3.png",
  },
  {
    title: "Radiology",
    image: "https://www.mdrcindia.com/images/sl-4.png",
  },
  {
    title: "Laboratory",
    image: "https://www.mdrcindia.com/images/sl-5.png",
  },
];

export default function TestingPortfolioSlider() {
  const [active, setActive] = useState(2); // shows 3/4 like screenshot
  const touchStartX = useRef(0); // Track touch start position
  const touchEndX = useRef(0); // Track touch end position

  // Handle touch start (touch start event)
  const handleTouchStart = (e: any) => {
    touchStartX.current = e.touches[0].clientX; // Capture the initial touch position
  };

  // Handle touch move (touch move event)
  const handleTouchMove = (e: any) => {
    touchEndX.current = e.touches[0].clientX; // Capture the final touch position
  };

  // Handle touch end (touch end event)
  const handleTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > 50) {
      // Swiped left (next slide)
      setActive((prev) => (prev + 1) % slides.length);
    } else if (touchEndX.current - touchStartX.current > 50) {
      // Swiped right (previous slide)
      setActive((prev) => (prev - 1 + slides.length) % slides.length);
    }
  };

  return (
    <section className="px-4 py-8">
      {/* Heading */}
      <h2 className="mb-4 text-center text-lg font-semibold text-gray-700">
        Our vast array of testing portfolio caters to
      </h2>

      {/* Slider */}
      <div
        className="relative overflow-hidden rounded-2xl shadow-md  "
        onTouchStart={handleTouchStart} // Detect touch start
        onTouchMove={handleTouchMove} // Detect touch move
        onTouchEnd={handleTouchEnd} // Detect touch end
      >
        <img
          src={slides[active].image}
          alt={slides[active].title}
          className="h-56 w-full object-cover"
        />

        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Title */}
        <div className="absolute bottom-4 left-0 right-0 text-center">
          <p className="text-lg font-semibold text-white">
            {slides[active].title}
          </p>
        </div>
      </div>

      {/* Pagination - DOTS WITH COUNTER */}
      <div className="mt-4 flex items-center justify-center gap-2">
        {slides.map((_, i) =>
          active === i ? (
            <span
              key={i}
              className="bg-gradient-to-b from-[#727070] to-[#C1C1C1] text-white text-xs px-2 py-1 rounded-full font-medium"
            >
              {i + 1}/{slides.length}
            </span>
          ) : (
            <button
              key={i}
              onClick={() => setActive(i)}
              className="h-2 w-2 rounded-full bg-gray-300"
            />
          ),
        )}
      </div>
    </section>
  );
}
