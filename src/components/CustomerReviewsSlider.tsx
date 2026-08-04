"use client";

import { useState, useEffect, useRef } from "react";
import { useCity } from "@/context/CityContext";
import requests from "@/lib/httpServices";

interface Testimonial {
  name: string;
  city: string;
  rating: string;
  image: string;
  content: string;
  date: string
}

interface City {
  id: string;
  name: string;
  image: string;
}

export default function CustomerReviewsSlider() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [slide, setSlide] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const { cityDetails } = useCity();
  const cityId = cityDetails?.id;
  const loadinRef = useRef(false);

  useEffect(() => {
    if (!cityId) return;

    const fetchTestimonials = async () => {
      if (loadinRef.current) return;
      loadinRef.current = true;
      try {
        setLoading(true);
        const payload = {
          view: "common_section",
          types: "testimonial",
          cityID: cityId,
        };

        const data = await requests.post("/webApi/index.php", payload);

        if (data?.data?.testimonials) {
          setTestimonials(data.data.testimonials);
        }
      } catch (error) {
        console.error("Error fetching testimonial data:", error);
      } finally {
        setLoading(false);
        loadinRef.current = false;
      }
    };

    fetchTestimonials();
  }, [cityId]);

  const totalSlides = testimonials.length;

  // Calculate the average rating dynamically
  const calculateAverageRating = (testimonials: Testimonial[]) => {
    const totalRating = testimonials.reduce(
      (acc, testimonial) => acc + parseFloat(testimonial.rating),
      0,
    );
    return totalRating / testimonials.length;
  };

  const averageRating =
    testimonials.length > 0 ? calculateAverageRating(testimonials) : 0;

  useEffect(() => {
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

  // Function to render dynamic stars based on the rating
  const renderStars = (rating: string) => {
    const fullStars = Math.floor(parseFloat(rating)); // Get whole stars
    const emptyStars = 5 - fullStars; // Remaining empty stars
    return (
      <>
        {"★ ".repeat(fullStars)}
        {"☆ ".repeat(emptyStars)}
      </>
    );
  };

  if (loading) return <div>Loading...</div>;

  return (
    <section className="my-8 px-4">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Testimonials 
        </h2>
        <div className="text-right">
          <p className="text-lg font-semibold text-gray-800">
            {averageRating.toFixed(1)} Out of 5
          </p>
          <div className="text-yellow-400 text-sm">
            {"★ ".repeat(Math.floor(averageRating))}{" "}
            {"☆ ".repeat(5 - Math.floor(averageRating))}
          </div>
        </div>
      </div>

      <div className="overflow-hidden relative">
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${slide * 100}%)` }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {testimonials.map((testimonial, index) => (
            <div key={index} className="min-w-full">
              <div className="bg-white rounded-3xl border-t-2 border-l-2 border-emerald-500 border-r-0 border-b-0 shadow-md p-5 min-h-64 flex flex-col">
                <div className="flex items-center gap-4 mb-3">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="tx-blue font-semibold">{testimonial.name}</p>
                    <div className="text-yellow-400 text-sm">
                      {renderStars(testimonial.rating)}
                    </div>
                  </div>
                </div>

                <p className="text-gray-700 leading-relaxed">
                  <span className="text-4xl text-gray-300 leading-none mr-1">
                    “
                  </span>
                  {testimonial.content}
                </p>
                <p className="mt-auto text-sm text-neutral-500"><i>{testimonial.date}</i></p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center items-center gap-2 mt-4">
          {testimonials.map((_, i) =>
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
