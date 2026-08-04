"use client";
import {
  X,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
} from "lucide-react";
import { useState, useEffect, useCallback, useRef } from "react";
import requests from "@/lib/httpServices";

type MediaType = "Photos" | "Videos";
type GalleryTab = string;

interface GalleryItem {
  videoUrl: any;
  id: number;
  src: string;
  category?: string;
  type: MediaType;
  videoId?: string;
}

export default function GallerySection() {
  const [mediaType, setMediaType] = useState<MediaType>("Photos");
  const [activeTab, setActiveTab] = useState<GalleryTab>("All");
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [lightbox, setLightbox] = useState({ open: false, index: -1 });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLIFrameElement>(null);
  const [categories, setCategories] = useState<string[]>([]);

  /* ---------- FETCH PHOTOS ---------- */
  const fetchPhotos = async () => {
    const res = await requests.post("/webApi/index.php", {
      view: "gallery",
    });

    const list = res?.data?.galleryList || [];

    return list.map((item: any) => ({
      id: Number(item.id),
      src: item.image,
      category: item.category,
      type: "Photos" as const,
    }));
  };

  /* ---------- FETCH VIDEOS ---------- */
  const fetchVideos = async () => {
    const res = await requests.post("/webApi/index.php", {
      view: "video_gallery",
    });

    const list = res?.data?.galleryVideoList || [];

    // video mapper
    return list.map((item: any) => ({
      id: Number(item.id),
      src: "",
      category: "All",
      type: "Videos" as const,
      videoUrl: item.video_link,
    }));
  };

  /* ---------- LOAD BOTH ---------- */
  useEffect(() => {
    const loadGallery = async () => {
      try {
        const [photos, videos] = await Promise.all([
          fetchPhotos(),
          fetchVideos(),
        ]);

        const allItems = [...photos, ...videos];
        setItems(allItems);

        const uniqueCategories: any = Array.from(
          new Set(photos.map((item: any) => item.category).filter(Boolean)),
        );

        setCategories(["All", ...uniqueCategories]);
      } catch (e) {
        console.error("Gallery fetch failed", e);
      }
    };

    loadGallery();
  }, []);

  /* ---------- FILTER ---------- */
  const filteredItems = items.filter(
    (item) =>
      (activeTab === "All" || item.category === activeTab) &&
      item.type === mediaType,
  );

  const openLightbox = useCallback((index: number) => {
    setCurrentIndex(index);
    setLightbox({ open: true, index });
    document.body.style.overflow = "hidden";
  }, []);

  const closeLightbox = useCallback(() => {
    setLightbox({ open: false, index: -1 });
    setIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.src = videoRef.current.src;
    }
    document.body.style.overflow = "unset";
  }, []);

  const nextImage = useCallback(() => {
    setCurrentIndex((p) => (p + 1) % filteredItems.length);
  }, [filteredItems.length]);

  const prevImage = useCallback(() => {
    setCurrentIndex(
      (p) => (p - 1 + filteredItems.length) % filteredItems.length,
    );
  }, [filteredItems.length]);

  const togglePlay = () => {
    if (!videoRef.current) return;

    videoRef.current.contentWindow?.postMessage(
      JSON.stringify({
        event: "command",
        func: isPlaying ? "pauseVideo" : "playVideo",
      }),
      "*",
    );

    setIsPlaying(!isPlaying);
  };

  const currentItem = filteredItems[currentIndex];

  const getYouTubeThumbnail = (url: string) => {
    const match = url.match(
      /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^&?/]+)/,
    );
    return match ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : "";
  };
  useEffect(() => {
    if (mediaType === "Videos") {
      setActiveTab("All");
    }
  }, [mediaType]);

  /* ================= UI BELOW (UNCHANGED) ================= */

  return (
    <section className="w-full pb-6">
      {/* HEADER */}
      <section className="grid">
        <div className="gradient-blue p-4">
          <h2 className="mb-3 font-semibold text-white">Gallery</h2>
          <p className="text-white mb-3">
            Designed for Care -{" "}
            <i>Visualizing the standard of modern healthcare</i>
          </p>

          <div className="mt-4 mb-2 flex gap-3">
            {(["Photos", "Videos"] as MediaType[]).map((t) => (
              <button
                key={t}
                onClick={() => setMediaType(t)}
                className={`flex-1 rounded-lg border px-3 py-2 text-xs font-medium ${
                  mediaType === t
                    ? "bg-white text-sky-600 border-white shadow-sm"
                    : "border-white/60 text-white/90"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* TABS (Photos only) */}
      {mediaType === "Photos" && (
        <div className="mt-3 mx-4 flex flex-wrap justify-center gap-4 font-semibold">
          {categories.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-1 border-b-2 ${
                activeTab === tab
                  ? "border-tx-green tx-green"
                  : "border-transparent text-gray-500"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      )}

      {/* GRID */}
      <div className="mt-4 grid grid-cols-2 gap-3 mx-4">
        {filteredItems.map((item, index) => (
          <div
            key={item.id}
            onClick={() => openLightbox(index)}
            className="rounded-xl shadow-md overflow-hidden cursor-pointer"
          >
            {item.type === "Photos" ? (
              <img src={item.src} className="h-32 w-full object-cover" />
            ) : (
              <div className="relative h-32 w-full">
                <img
                  src={getYouTubeThumbnail(item.videoUrl)}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <Play className="w-10 h-10 text-white" />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* LIGHTBOX */}
      {lightbox.open && (
        <div className="fixed inset-0 z-10000 bg-black/80 flex items-center justify-center">
          <button onClick={closeLightbox} className="absolute top-4 right-4">
            <X className="text-white w-6 h-6" />
          </button>

          <button onClick={prevImage} className="absolute left-4">
            <ChevronLeft className="text-white w-6 h-6" />
          </button>

          <button onClick={nextImage} className="absolute right-4">
            <ChevronRightIcon className="text-white w-6 h-6" />
          </button>

          <div className="w-[80vw] h-[70vh]">
            {currentItem.type === "Photos" ? (
              <img
                src={currentItem.src}
                className="w-full h-full object-contain"
              />
            ) : (
              <iframe
                ref={videoRef}
                src={`${currentItem.videoUrl}${
                  currentItem.videoUrl.includes("?") ? "&" : "?"
                }autoplay=1&rel=0&modestbranding=1&playsinline=1&enablejsapi=1`}
                className="w-full h-full"
                allowFullScreen
              />
            )}
          </div>

          {currentItem.type === "Videos" && (
            <button
              onClick={togglePlay}
              className="absolute bottom-6 bg-white p-3 rounded-full"
            >
              {isPlaying ? <Pause /> : <Play />}
            </button>
          )}
        </div>
      )}
    </section>
  );
}
