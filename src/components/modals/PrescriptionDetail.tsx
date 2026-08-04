"use client";

import Image from "next/image";
import { X } from "lucide-react";

interface PrescriptionDetailProps {
  open: boolean;
  onClose: () => void;
  fileUrl: string;
}

const PrescriptionDetail = ({
  open,
  onClose,
  fileUrl,
}: PrescriptionDetailProps) => {
  if (!open || !fileUrl) return null;

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="relative w-full max-w-md bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>

          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800">
              Prescription
            </h3>
          </div>

          {/* Image Content */}
          <div className="p-4">
            <div className="rounded bg-gray-50">
              <Image
                src={fileUrl}
                alt="Prescription"
                width={600}
                height={800}
                className="w-full h-full object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrescriptionDetail;
