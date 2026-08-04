"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import requests from "@/lib/httpServices";

// Define the blog type to match the API response
type Blog = {
  id: string;
  slug: string;
  name: string;
  short_info: string;
  image: string;
  category: string;
};

export default function BlogsSlider() {
  const [slide, setSlide] = useState<number>(0);
  const [blogs, setBlogs] = useState<Blog[]>([]); // State to store the fetched blogs
  const totalSlides: number = 4;
  const touchStartX = useRef(0); // Track touch start position
  const touchEndX = useRef(0); // Track touch end position

  // Fetch blog data from API
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const payload = {
          view: "blog_list",
          deviceType: "Android",
          search: "",
          page: "0",
        };

        const data = await requests.post("/webApi/index.php", payload);

        if (data.message === "success") {
          setBlogs(data.data.blogList);
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };

    fetchBlogs();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setSlide((prev) => (prev + 1) % totalSlides);
    }, 4000);

    return () => clearInterval(timer);
  }, [totalSlides]);

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
      setSlide((prev) => (prev + 1) % totalSlides);
    } else if (touchEndX.current - touchStartX.current > 50) {
      // Swiped right (previous slide)
      setSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
    }
  };

  return (
    <section className="my-8 px-4">
      {/* Heading */}
      <h2 className="text-center text-xl font-semibold mb-4">Blogs</h2>

      {/* Slider Container with padding for shadow */}
      <div className="overflow-hidden relative px-4 pb-4">
        {/* Slider */}
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${slide * 100}%)` }}
          onTouchStart={handleTouchStart} // Detect touch start
          onTouchMove={handleTouchMove} // Detect touch move
          onTouchEnd={handleTouchEnd} // Detect touch end
        >
          {/* Dynamically render slides based on fetched blogs */}
          {blogs.slice(0, totalSlides).map((blog) => (
            <div key={blog.id} className="min-w-full flex justify-center">
              <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl shadow-gray-300 p-3 mx-2">
                <Link href={`/blog/detail/${blog.slug}`}>
                  <img
                    src={blog.image}
                    alt={blog.name}
                    className="w-full h-48 object-cover rounded-xl"
                  />
                  <p className="text-center tx-blue font-semibold mt-4">
                    {blog.name}
                  </p>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Dots */}
        <div className="flex justify-center items-center gap-2 mt-4">
          {[0, 1, 2, 3].map((i) =>
            slide === i ? (
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
