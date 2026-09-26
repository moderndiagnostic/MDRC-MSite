// app/career/CareerPageClient.tsx
"use client";
import { useState, useEffect } from "react";
import {
  ChevronsLeft,
  ChevronsRight,
  ChevronRight,
  ChevronUp,
} from "lucide-react";
import ApplyJobModal from "@/components/modals/ApplyJobModal";
import { useCareer } from "@/hooks/useCareer";

const CareerPageClient = ({ initialData }: { initialData?: any }) => {
  const { jobs, other, loading, error } = useCareer({ initialData });

  const [careerExpanded, setCareerExpanded] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState("");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  if (loading || error) return null;

  const toggleCareer = () => setCareerExpanded(!careerExpanded);
  const toggleJob = (index: number) =>
    setActiveIndex(activeIndex === index ? null : index);

  return (
    <div className="w-full">
      {/* CareerTop Section */}
      <div
        className="w-full px-4 py-6"
        style={{
          background: "linear-gradient(to right, #1160A5, #189ED3)",
        }}
      >
        <div className="max-w-md mx-auto text-white">
          <h1 className="text-xl font-semibold mb-2">{other?.heading}</h1>
          <p className="text-sm leading-relaxed mb-3">
            {other?.description}
            {!careerExpanded && "..."}
          </p>

          {careerExpanded && (
            <p className="text-sm leading-relaxed mb-3">{other?.description}</p>
          )}

          <button
            onClick={toggleCareer}
            className="text-sm font-medium underline flex items-center gap-1"
          >
            {careerExpanded ? "Read Less" : "Read More"}
            <span className="text-base">
              {careerExpanded ? (
                <ChevronsLeft size={16} strokeWidth={2.25} />
              ) : (
                <ChevronsRight size={16} strokeWidth={2.25} />
              )}
            </span>
          </button>
        </div>
      </div>

      {/* CareerPerspective Section */}
      <div className="w-full mt-2">
        <img
          src={other?.section_image}
          alt="Clinic to patient perspective"
          className="w-full object-cover rounded-xl pt-4"
        />
        <h1 className="text-xl mt-4 font-semibold px-4">
          {other?.section_heading}
        </h1>
        <p className="text-sm leading-relaxed px-4 py-4">
          {other?.section_description}
        </p>

        <div
          className="w-full"
          style={{
            background: "linear-gradient(to right,#DEFFF2, #ffffff)",
          }}
        >
          <div className="px-4 mt-2 py-3 mb-4">
            <h3 className="text-green-600">Job</h3>
            <h1 className="text-xl font-semibold">Current Openings</h1>
          </div>
        </div>
      </div>

      {/* JobAccordion Section */}
      <div className="space-y-4 px-4 mb-5">
        {jobs.map((job, index) => {
          const isOpen = activeIndex === index;
          return (
            <div
              key={job.id}
              className="rounded-xl overflow-hidden shadow-md border border-gray-200"
            >
              <button
                onClick={() => toggleJob(index)}
                className="w-full bg-[#0A5C9E] text-white px-4 py-3 flex justify-between items-center text-left"
              >
                <div>
                  <p className="text-sm font-semibold leading-snug">
                    {job.title}
                  </p>
                  <p className="text-xs mt-1">{job.posts}</p>
                </div>
                <span className="flex-shrink-0 ml-2">
                  {isOpen ? (
                    <ChevronUp size={20} strokeWidth={2.25} />
                  ) : (
                    <ChevronRight size={20} strokeWidth={2.25} />
                  )}
                </span>
              </button>

              {isOpen && (
                <div className="bg-white px-4 py-4 text-sm text-gray-700">
                  <p className="font-semibold mb-3">{job.openTitle}</p>

                  {/* API HTML */}
                  <div
                    className="mb-4"
                    dangerouslySetInnerHTML={{
                      __html: job.description,
                    }}
                  />

                  <button
                    onClick={() => {
                      setSelectedJob(job.title);
                      setShowModal(true);
                    }}
                    className="w-full bg-[#0A5C9E] text-white py-2 rounded-md font-medium"
                  >
                    Apply Now
                  </button>
                </div>
              )}

              <ApplyJobModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                jobTitle={selectedJob}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CareerPageClient;
