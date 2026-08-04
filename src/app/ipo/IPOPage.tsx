"use client";
import { useIPO } from "@/hooks/useIPO";
import React, { useState } from "react";

interface IPOPageProps {
  serverData?: any;
}

const IPOPage: React.FC<IPOPageProps> = ({ serverData }) => {
  const { documents, other, loading, error } = useIPO("IPO");
  const [activeQR, setActiveQR] = useState<string | null>(null);

  if (!serverData) return null;

  const handleDocumentClick = (doc: any) => {
    if (doc.qr) setActiveQR(doc.qr);

    if (doc.url) {
      const link = document.createElement("a");
      link.href = doc.url;
      link.download = doc.url.split("/").pop();
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">No document found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* IPO Documents Card */}
      <div className="bg-white rounded-b-2xl shadow-lg overflow-hidden mb-0">
        {/* Header */}
        <div className="bg-gradient-to-b from-[#005C96] to-[#15AEE5] text-white px-5 py-6">
          <h1 className="text-[20px] font-semibold mb-2.5">{other?.title}</h1>
          <p className="text-[15px] leading-[1.5] opacity-95">
            {other?.description}
          </p>
        </div>
        {documents.length > 0 && (
          <div className="px-5 py-6 bg-white m-4 rounded-xl shadow-xl border-gray-100 border">
            <ul className="space-y-0">
              {documents.map((doc: any, index: number) => (
                <li key={index} className="py-2">
                  <button
                    onClick={() => handleDocumentClick(doc)}
                    className="flex items-start bg-[#F5F5F5] text-gray-800 hover:text-[#0066b2] transition-colors px-3 py-[2px] text-left rounded-2xl group"
                  >
                    <span className="w-2 h-2 bg-[#05AF79] rounded-full mr-3 mt-1.5 flex-shrink-0"></span>
                    <span className="text-[15px] leading-[1.4]">
                      {doc.name || "Untitled"}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* QR MODAL */}
      {activeQR && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl relative">
            <button
              onClick={() => setActiveQR(null)}
              className="absolute top-2 right-3 text-gray-500 text-xl"
            >
              ×
            </button>
            <img
              src={activeQR}
              alt="QR Code"
              className="w-64 h-64 object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default IPOPage;
