"use client";

import requests from "@/lib/httpServices";
import { useEffect, useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { applyClientMeta } from "@/utils/applyClientMeta";

interface Doctor {
  id: string;
  name: string;
  category: string;
  image: string;
  department?: string;
  experience?: string;
}

const DoctorsSlider = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [index, setIndex] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const loadinRef = useRef(false);
  const metaAppliedRef = useRef(false);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    if (loadinRef.current) return;
    loadinRef.current = true;
    try {
      setLoading(true);
      const response = await requests.post("/webApi/index.php", {
        view: "our_doctors",
      });
      const data = response.data;

      setDoctors(response.data.doctors || []);
      if (response.data.doctors && response.data.doctors.length > 0) {
        setIndex(0); // Reset index when new data loads
      }
      if (!metaAppliedRef.current) {
        applyClientMeta({
          title: data.meta_title,
          description: data.meta_description,
          keywords: data.meta_keyword,
          favicon: data.favicon,
          schema: data.meta_schema,
        });

        metaAppliedRef.current = true;
      }

    } catch (err: any) {
      setError(err.message || "Failed to fetch doctors");
      console.error("API Error:", err);
    } finally {
      setLoading(false);
      loadinRef.current = false;
    }
  };

  const prev = () =>
    setIndex((prev) => (prev === 0 ? doctors.length - 1 : prev - 1));

  const next = () =>
    setIndex((prev) => (prev === doctors.length - 1 ? 0 : prev + 1));

  const doctor = doctors[index];

  // Handle touch start (touch start event)
  const handleTouchStart = (e: any) => {
    touchStartX.current = e.touches[0].clientX;
  };

  // Handle touch move (touch move event)
  const handleTouchMove = (e: any) => {
    touchEndX.current = e.touches[0].clientX;
  };

  // Handle touch end (touch end event)
  const handleTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > 50) {
      // Swiped left (next slide)
      next();
    } else if (touchEndX.current - touchStartX.current > 50) {
      // Swiped right (previous slide)
      prev();
    }
  };

  if (loading) {
    return (
      <section className="px-4 py-10 flex items-center justify-center min-h-[500px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </section>
    );
  }

  if (error || doctors.length === 0) {
    return (
      <section className="px-4 py-10">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || "No doctors found"}</p>
          <button
            onClick={fetchDoctors}
            className="px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-all duration-300"
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="px-4 py-10">
      {/* Header */}
      <div className="mb-16 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-800 ">Our Doctors</h2>

        <div className="flex gap-3">
          <button onClick={prev} className="tx-green hover:opacity-70">
            <ChevronLeft size={28} />
          </button>
          <button onClick={next} className="tx-green hover:opacity-70">
            <ChevronRight size={28} />
          </button>
        </div>
      </div>

      {/* Card */}
      <div
        className="relative"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Image */}
        <div className="absolute bottom-[150px] left-1/2 -translate-x-1/2 z-10">
          <div className="h-50 w-50 rounded-full overflow-hidden">
            <img
              src={doctor.image || "/assets/images/doctor/doctor-dy.svg"}
              alt={doctor.name}
              className="h-full w-full object-contain rounded-full "
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "/assets/images/doctor/doctor-dy.svg";
              }}
            />
          </div>
        </div>

        {/* Content Card */}
        <div className="rounded-3xl bg-white pt-30 pb-8 px-6 text-center shadow-[0_0_15px_rgba(0,0,0,0.15)]  ">
          <h3 className="text-xl font-semibold tx-green">{doctor.name}</h3>

          <p className="mt-2 text-gray-600 text-sm">{doctor.category}</p>

          <Link href="/our-doctors">
            <button className="mt-3 inline-flex items-center justify-center rounded-[10px] border border-emerald-500 px-4 py-1 font-medium tx-green hover:bg-emerald-500 hover:text-white transition-all duration-300">
              Read More
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default DoctorsSlider;
