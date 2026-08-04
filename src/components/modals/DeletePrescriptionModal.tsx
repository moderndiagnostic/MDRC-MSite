"use client";

interface DeletePrescriptionModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
  message?: string;
  primaryColor?: string; // optional for custom color
}

export default function DeletePrescriptionModal({
  isOpen,
  onConfirm,
  onCancel,
  title = "Remove Prescription?",
  message = "Are you sure you want to remove this prescription?",
  primaryColor = "#0074c6",
}: DeletePrescriptionModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/30 pointer-events-auto"
        onClick={onCancel}
      />

      {/* Modal box */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden pointer-events-auto mx-auto">
        <div className="p-6 pb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
          <p className="text-sm text-gray-600">{message}</p>
        </div>

        <div className="px-6 pb-6 pt-3 border-t border-gray-200 flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all flex-1"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-6 py-2.5 text-sm gradient-blue font-normal text-white rounded-xl shadow-sm hover:shadow-md transition-all flex-1"
            style={{ backgroundColor: primaryColor }}
          >
            Yes, remove
          </button>
        </div>
      </div>
    </div>
  );
}
