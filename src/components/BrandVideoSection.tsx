"use client";
import { useState, useMemo } from "react";
import { useDashboard } from "@/context/DashboardContext";

export default function BrandVideoSection() {
  const { homeData } = useDashboard();
  const [open, setOpen] = useState(false);

  const videoUrl = homeData?.video_url;

  const videoId = useMemo(() => {
    if (!videoUrl) return null;

    try {
      const url = new URL(videoUrl);
      let id = url.searchParams.get("v");

      if (!id && url.hostname === "youtu.be") {
        id = url.pathname.slice(1);
      }

      return id;
    } catch {
      return null;
    }
  }, [videoUrl]);

  const thumbnail = videoId
    ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
    : null;

  if (!videoUrl) return null; // wait until API loads

  return (
    <>
      <section className="px-4 my-8">
        <div
          onClick={() => setOpen(true)}
          className="cursor-pointer rounded-3xl overflow-hidden h-44 relative"
        >
          {thumbnail && (
            <img
              src={thumbnail}
              alt="Video preview"
              className="w-full h-full object-cover"
            />
          )}

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 bg-black/50 rounded-full flex items-center justify-center">
              <span className="text-white text-4xl">▶</span>
            </div>
          </div>
        </div>
      </section>

      {open && videoId && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="relative w-full max-w-4xl aspect-video">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-2 right-2 text-white text-xl"
            >
              ✕
            </button>

            <iframe
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
              className="w-full h-full"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </>
  );
}
