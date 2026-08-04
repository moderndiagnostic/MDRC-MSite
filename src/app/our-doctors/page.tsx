"use client";
import requests from "@/lib/httpServices";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Doctor {
  id: string;
  name: string;
  category: string;
  image: string;
  department?: string;
  experience?: string;
  description?: string;
}

const DoctorsGrid = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [visibleCount, setVisibleCount] = useState(5);
  const [allDoctorsLoaded, setAllDoctorsLoaded] = useState(false);
  const [sectionData, setSectionData] = useState({
    meta_title: "",
    meta_description: "",
  });

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await requests.post("/webApi/index.php", {
        view: "our_doctors",
      });

      const apiData = response.data.data || response.data; // Handles different nesting structures
      const doctorsData = apiData.doctors || [];

      setDoctors(doctorsData);
      setAllDoctorsLoaded(doctorsData.length <= 5);

      if (apiData.meta_title) {
        setSectionData({
          meta_title: apiData.meta_title,
          meta_description:
            apiData.meta_description ||
            "Meet our team of qualified and trusted doctors",
        });

        // Update Document Head for SEO
        document.title = apiData.meta_title;

        let metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
          metaDesc.setAttribute("content", apiData.meta_description || "");
        } else {
          metaDesc = document.createElement("meta");
          metaDesc.setAttribute("name", "description");
          metaDesc.setAttribute("content", apiData.meta_description || "");
          document.head.appendChild(metaDesc);
        }

        if (apiData.meta_keyword) {
          let metaKey = document.querySelector('meta[name="keywords"]');
          if (metaKey) {
            metaKey.setAttribute("content", apiData.meta_keyword);
          } else {
            metaKey = document.createElement("meta");
            metaKey.setAttribute("name", "keywords");
            metaKey.setAttribute("content", apiData.meta_keyword);
            document.head.appendChild(metaKey);
          }
        }

        if (apiData.favicon) {
          let link: HTMLLinkElement | null =
            document.querySelector("link[rel*='icon']");
          if (link) {
            link.href = apiData.favicon;
          } else {
            const newLink = document.createElement("link");
            newLink.rel = "icon";
            newLink.href = apiData.favicon;
            document.head.appendChild(newLink);
          }
        }
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch doctors");
      console.error("API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    setVisibleCount((prev) => {
      const newCount = prev + 5;
      if (newCount >= doctors.length) {
        setAllDoctorsLoaded(true);
      }
      return newCount;
    });
  };

  const visibleDoctors = doctors.slice(0, visibleCount);

  if (loading) {
    return (
      <div className="min-h-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-100 flex items-center justify-center text-red-500">
        <div className="text-center">
          <p>{error}</p>
          <button
            onClick={fetchDoctors}
            className="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all duration-300"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      {/* Header Section - Dynamic from API */}
      <div className="bg-linear-to-r from-[#0B6FAF] to-[#1BA9E1] py-10 px-6 ">
        <h1 className="text-white text-2xl mb-3 font-semibold">
          {sectionData.meta_title}
        </h1>
        <p className="text-white/90 text-sm mb-2">
          {sectionData.meta_description}
        </p>
      </div>

      {/* Doctors Grid - 1 per row */}
      <div className="mx-auto px-4 py-12">
        <div className="space-y-8 max-w-2xl mx-auto">
          {visibleDoctors.map((doctor, index) => (
            <DoctorCard key={doctor.id || index} doctor={doctor} />
          ))}
        </div>

        {/* Load More Button */}
        {doctors.length > 5 && !allDoctorsLoaded && (
          <div className="text-center mt-12">
            <button
              onClick={loadMore}
              className="px-8 py-3 gradient-green text-white rounded-lg hover:bg-emerald-600 transition-all duration-300 font-medium"
            >
              Load More
            </button>
          </div>
        )}

        {/* All Loaded Message */}
        {allDoctorsLoaded && visibleDoctors.length > 0 && (
          <div className="text-center mt-12">
            {/* <p className="text-gray-500 text-lg">All doctors loaded</p> */}
          </div>
        )}

        {/* No Doctors */}
        {doctors.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No doctors found</p>
          </div>
        )}
      </div>
    </div>
  );
};

interface DoctorCardProps {
  doctor: Doctor;
}

const DoctorCard = ({ doctor }: DoctorCardProps) => {
  const [expanded, setExpanded] = useState(false);

  const toggleDescription = () => {
    setExpanded((prev) => !prev);
  };
  return (
    <div className="relative mx-auto max-w-md mt-32">
      {/* Content Card */}
      <div className="rounded-3xl bg-white pt-10 pb-8 px-6 text-center shadow-[0_0_15px_rgba(0,0,0,0.15)]">
        {/* Image with negative margin to overlap card */}
        <div className="-mt-32 mb-4 mx-auto h-50 w-50 rounded-full overflow-hidden">
          <img
            src={doctor.image || "/assets/images/doctor/doctor-dy.svg"}
            alt={doctor.name}
            className="h-full w-full object-contain rounded-full"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "/assets/images/doctor/doctor-dy.svg";
            }}
          />
        </div>

        <h3 className="text-xl font-semibold tx-green">{doctor.name}</h3>
        <p className="mt-2 text-gray-600 text-sm">{doctor.category}</p>

        {doctor.description && expanded && (
          <div
            className="mt-2 text-gray-600 text-sm"
            dangerouslySetInnerHTML={{ __html: doctor.description }}
          />
        )}

        <div>
          <button
            onClick={toggleDescription}
            className="mt-3 inline-flex items-center justify-center rounded-[10px] border border-emerald-500 px-4 py-1 font-medium tx-green hover:bg-emerald-500 hover:!text-white transition-all duration-300"
          >
            {expanded ? "Show Less" : "Read More"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorsGrid;
