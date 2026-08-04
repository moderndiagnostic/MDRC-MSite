"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface tabProps {
  itemTabs: { tabName: string; tabDesc: string }[];
  itemName: string;
}

export default function ParametersAccordion({ itemTabs, itemName }: tabProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // first open
 if (!Array.isArray(itemTabs) || itemTabs.length === 0) {
    return null;
  }
  return (
    <div className="w-full bg-[#f8fafc] py-4">
      {/* Header */}
      <div className="mb-2 px-4">
        <h2 className="text-2xl font-semibold text-gray-800">
          List of Parameters
        </h2>
        <p className=" text-gray-500 mt-0.5">{itemName}</p>
      </div>

      {/* Accordion list */}
      <div className="border border-gray-200 rounded-lg overflow-hidden m-2">
        {itemTabs.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className="border-b last:border-b-0 border-gray-200"
            >
              <button
                type="button"
                onClick={() =>
                  setOpenIndex((prev) => (prev === index ? null : index))
                }
                className="w-full flex items-center justify-between px-4 py-2.5 bg-[#f8fafc] hover:bg-[#f1f5f9]"
              >
                <span className="text-xs font-semibold text-[#0074c6] text-left">
                  {item.tabName}
                </span>
                <ChevronDown
                  className={`h-4 w-4 text-gray-500 transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-4 pb-3 pt-2 bg-white text-sm leading-relaxed text-gray-700">
                  <div
                    className="text-gray-500 mb-1"
                    dangerouslySetInnerHTML={{ __html: item.tabDesc }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
