"use client";

import { useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";
import { useCity } from "@/context/CityContext";
import requests from "@/lib/httpServices";

interface Tag {
  title: string;
  link: string;
}

interface Section {
  title: string;
  key: string;
  child: Tag[];
}

export default function Tags() {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { cityDetails } = useCity();
  const selectedCity = cityDetails;
  const cityId = cityDetails?.id || selectedCity?.id;

  useEffect(() => {
    // 1. Wait until cityId is available
    if (!cityId) return;

    const cacheKey = `tags_session_${cityId}`;

    // 2. Check Session Storage immediately
    const cachedData = sessionStorage.getItem(cacheKey);
    if (cachedData) {
      try {
        const parsed = JSON.parse(cachedData);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSections(parsed);
          setLoading(false);
          return; // Exit early, no API call needed
        }
      } catch (e) {
        console.error("Cache parse error", e);
      }
    }

    // 3. If no cache, Fetch from API
    const fetchTags = async () => {
      try {
        setLoading(true);
        const response = await requests.post("/webApi/index.php", {
          view: "common_section",
          types: "tags",
          cityID: cityId,
        });

        // Use the exact data path from your working code: data.data.tags
        const tagsArray = response?.data?.tags;

        if (tagsArray && Array.isArray(tagsArray)) {
          // Store in session for next time
          sessionStorage.setItem(cacheKey, JSON.stringify(tagsArray));
          setSections(tagsArray);
        }
      } catch (error) {
        console.error("Error fetching tags data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, [cityId]);

  const toggleSection = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // If loading and we have no data yet, show nothing.
  // If we have data (from cache), this won't trigger, and user sees tags instantly.
  if (loading && sections.length === 0) return null;
  if (sections.length === 0) return null;

  return (
    <div className="divide-y divide-gray-300">
      {sections.map((section, index) => (
        <div key={index}>
          <button
            onClick={() => toggleSection(index)}
            className="flex w-full items-center justify-between py-3 text-sm font-semibold tracking-wide text-[#424040]"
          >
            <span className="uppercase text-left">{section.title}</span>
            <ChevronRight
              className={`h-4 w-4 text-gray-600 transition-transform ${openIndex === index ? "rotate-90" : ""
                }`}
            />
          </button>

          {openIndex === index && (
            <div className="pb-3 text-sm">
              <ul
                className={`${section.title === "Our Presence" ||
                  section.title === "Test by Risk"
                  ? "flex flex-wrap gap-3 gap-y-2"
                  : "space-y-2"
                  }`}
              >
                {section.child.map((tag, tagIndex) => (
                  <li
                    key={tagIndex}
                    className={`${(section.title === "Our Presence" || section.title === "Test by Risk") && tagIndex !== section.child.length - 1
                        ? "border-r pr-3 border-neutral-300"
                        : ""
                      }`}
                  >
                    <a
                      href={tag.link}
                      className={`hover:text-green-500 text-[#424040] transition-colors ${section.title === "Our Presence" ? "text-sm" : ""
                        }`}
                    >
                      {tag.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
