"use client";

import React from "react";
import Link from "next/link";
import { useDiseases } from "@/hooks/useDiseases";
import { useCity } from "@/context/CityContext";
import { ChevronLeftIcon } from "lucide-react";

const DiseaseGrid: React.FC = () => {
  const { diseasesItems: diseases, loading } = useDiseases();
  const { cityDetails } = useCity();

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <section className="my-8 px-4">
      <div className="flex items-center gap-2 mb-6">
        <Link href={`/`}>
          <ChevronLeftIcon className="size-7" />
        </Link>
        <h2 className="text-lg font-semibold text-gray-800">
          Test By Condition
        </h2>
      </div>
      {/* Grid Layout: 
          grid-cols-3 ensures 3 items per row on mobile 
      */}
      <div className="grid grid-cols-3 gap-x-3 gap-y-8">
        {diseases.map((disease) => (
          <Link
            href={`/diseases/${cityDetails?.slug}/${disease.slug}`}
            key={disease.id}
            className="flex flex-col items-center group"
          >
            {/* Card Style from the second code */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 h-22 w-24 flex items-center justify-center transition-all active:scale-95">
              {disease.image && (
                <img
                  src={disease.image || ""}
                  alt={disease.name || "Test by Condition"}
                  className="h-10 w-10 object-contain"
                />
              )}
            </div>

            {/* Label Style */}
            <p className="mt-2 text-sm text-gray-700 text-center font-medium leading-tight line-clamp-2">
              {disease.name}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default DiseaseGrid;
