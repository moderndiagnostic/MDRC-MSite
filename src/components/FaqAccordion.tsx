"use client";

import { useCity } from "@/context/CityContext";
import { Plus, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import requests from "@/lib/httpServices";

interface FaqData {
  title: string;
  answer: string;
}
interface City {
  id: string;
  name: string;
  image: string;
}

interface FaqAccordionProps {
  pageType: string;
  pageSlug?: string;
}

export default function FaqAccordion({
  pageType,
  pageSlug,
}: FaqAccordionProps) {
  const [faqData, setFaqData] = useState<FaqData[]>([]);
  // 1. Added state for the description
  const [faqDescription, setFaqDescription] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { cityDetails } = useCity();
  const cityId = cityDetails?.id;
  const [showFullDesc, setShowFullDesc] = useState(false);
  const loadinRef = useRef(false);

  useEffect(() => {
    if (!cityId) return;

    const fetchFaqData = async () => {
      const apiPageType = pageType === "/" ? "" : pageType;
      if (loadinRef.current) return;
      loadinRef.current = true;
      try {
        setLoading(true);
        const payload = {
          view: "common_section",
          types: "faq",
          cityID: cityId,
          pageType: apiPageType,
          pageSlug: pageSlug ? pageSlug : "",
        };

        const data = await requests.post("/webApi/index.php", payload);

        // Map both faqs and description from the service response
        setFaqData(data?.data?.faqs || []);
        setFaqDescription(data?.data?.faq_description || null);
      } catch (error) {
        console.error("Error fetching FAQ data:", error);
      } finally {
        setLoading(false);
        loadinRef.current = false;
      }
    };

    fetchFaqData();
  }, [pageType, cityId]);

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  if (loading) return <div className="loading-spinner">Loading...</div>;

  if (!pageType?.trim()) return null;
  if (!faqData?.length && !faqDescription) return null;

  return (
    <section className="p-4 bg-gradient-to-b from-[#FFFFFF] to-[#EAEAEA] text-[#424040]">
      {/* 3. Render the description if it exists */}
      {faqDescription && (
        <div className="mb-6">
          <div
            className={`prose max-w-none text-gray-700 transition-all ${
              showFullDesc ? "" : "line-clamp-6"
            }`}
            dangerouslySetInnerHTML={{ __html: faqDescription }}
          />

          <button
            onClick={() => setShowFullDesc((prev) => !prev)}
            className="mt-2 text-sm font-medium tx-green hover:underline"
          >
            {showFullDesc ? "Read less" : "Read more"}
          </button>
        </div>
      )}

      {faqData?.length > 0 && (
        <>
          <h2 className="text-xl font-semibold mb-4 text-center">
            Frequently Asked Questions
          </h2>

          {faqData.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md p-4 mb-3"
              onClick={() => toggle(index)}
            >
              <div className="flex justify-between items-start cursor-pointer">
                <p className="font-medium text-sm">{faq.title}</p>
                <span className="text-lg text-gray-500">
                  {openIndex === index ? <X /> : <Plus />}
                </span>
              </div>

              {openIndex === index && (
                <div
                  className="text-sm mt-2 leading-relaxed font-light [&_a]:text-blue-600 [&_a]:font-medium [&_a]:hover:underline"
                  dangerouslySetInnerHTML={{ __html: faq.answer }}
                />
              )}
            </div>
          ))}
        </>
      )}
    </section>
  );
}
