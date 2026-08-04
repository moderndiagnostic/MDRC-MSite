"use client";

import { Upload, X } from "lucide-react";
import BottomSheet from "../ui/BottomSheet";
import { useId, useRef, useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  onUpload: (file: File) => void; // Changed to single File based on your API screenshot
  primaryColor?: string;
  cartItems: any
};

export default function PrescriptionSheet({
  open,
  onClose,
  onUpload,
  primaryColor = "#0074c6",
  cartItems
}: Props) {
  const titleId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const addFiles = (newFiles: File[]) => {
    // Keeping local state as array for UI, but API takes one
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const onDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const dropped = Array.from(e.dataTransfer.files || []);
    if (dropped.length) addFiles(dropped);
  };

  const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(e.target.files || []);
    if (picked.length) addFiles(picked);
  };

  const upload = () => {
    if (!files.length) return;
    // Pass the first file to the handler
    onUpload(files[0]);
    setFiles([]);
    if (inputRef.current) inputRef.current.value = "";
    onClose();
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      titleId={titleId}
      maxHeightClassName="max-h-[75vh]"
    >
      <div className="px-4 pt-3 pb-3 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <p id={titleId} className="text-base font-semibold text-gray-900">
            Upload Prescription
          </p>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-2 rounded-xl hover:bg-gray-100 text-gray-700"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      <div className="px-4 py-4 pb-24 overflow-y-auto max-h-[calc(75vh-160px)]">
        <div
          className={[
            "border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition",
            dragActive
              ? "bg-blue-50 border-blue-400"
              : "bg-white border-gray-300",
          ].join(" ")}
          onClick={() => inputRef.current?.click()}
          onDragEnter={onDrag}
          onDragLeave={onDrag}
          onDragOver={onDrag}
          onDrop={onDrop}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*,.pdf"
            onChange={onPick}
            className="hidden"
          />
          <div
            className="mx-auto w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{ backgroundColor: "rgba(0,116,198,0.10)" }}
          >
            <Upload style={{ color: primaryColor }} />
          </div>
          <p className="mt-3 text-sm font-semibold text-gray-900">
            Drop prescription here or click to browse
          </p>
          <p className="mt-1 text-xs text-gray-500">JPG, PNG and GIF supported</p>
        </div>

        {files.length > 0 && (
          <div className="mt-4">
            <p className="text-xs font-semibold text-gray-700 mb-2">
              Selected file
            </p>
            <div className="space-y-2">
              {files.map((f, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center text-xs text-gray-700 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2"
                >
                  <span>
                    {f.name}{" "}
                    <span className="text-gray-400">
                      ({(f.size / 1024).toFixed(1)} KB)
                    </span>
                  </span>
                  <X
                    size={14}
                    className="cursor-pointer text-red-500"
                    onClick={() => removeFile(i)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 px-5 py-2 rounded-md border border-gray-300 text-gray-700 text-sm"
          >
            Cancel
          </button>
          <button
            onClick={upload}
            disabled={!files.length}
            className="flex-1 px-6 py-2 rounded-md text-white text-sm font-semibold disabled:bg-gray-400"
            style={{ backgroundColor: primaryColor }}
          >
            Upload
          </button>
        </div>
      </div>
    </BottomSheet>
  );
}
