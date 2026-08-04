"use client";

import {
  ChevronRight,
  X,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import DoctorsSlider from "@/components/DoctorsSlider";
import TestingPortfolioSlider from "@/components/TestingPortfolioSlider";

interface AboutPageProps {
  params?: { slug?: string };
}

interface NetworkImageItem {
  id: number;
  src: string;
  alt: string;
}

const networkImages: NetworkImageItem[] = [
  {
    id: 1,
    src: "https://www.mdrcindia.com/images/about/1.jpeg",
    alt: "Network 1",
  },
  {
    id: 2,
    src: "https://www.mdrcindia.com/images/about/2.jpeg",
    alt: "Network 2",
  },
  {
    id: 3,
    src: "https://www.mdrcindia.com/images/about/3.jpeg",
    alt: "Network 3",
  },
  {
    id: 4,
    src: "https://www.mdrcindia.com/images/about/4.jpeg",
    alt: "Network 4",
  },
  {
    id: 5,
    src: "https://www.mdrcindia.com/images/about/5.jpeg",
    alt: "Network 5",
  },
  {
    id: 6,
    src: "https://www.mdrcindia.com/images/about/6.jpeg",
    alt: "Network 6",
  },
  {
    id: 7,
    src: "https://www.mdrcindia.com/images/about/7.jpeg",
    alt: "Network 7",
  },
  {
    id: 8,
    src: "https://www.mdrcindia.com/images/about/8.jpeg",
    alt: "Network 8",
  },
  {
    id: 9,
    src: "https://www.mdrcindia.com/images/about/9.jpeg",
    alt: "Network 9",
  },
  {
    id: 10,
    src: "https://www.mdrcindia.com/images/about/10.jpeg",
    alt: "Network 10",
  },
  {
    id: 11,
    src: "https://www.mdrcindia.com/images/about/11.jpeg",
    alt: "Network 11",
  },
  {
    id: 12,
    src: "https://www.mdrcindia.com/images/about/12.jpeg",
    alt: "Network 12",
  },
];

export default function AboutPageClient({ params }: AboutPageProps) {
  const [lightbox, setLightbox] = useState<{ open: boolean; index: number }>({
    open: false,
    index: -1,
  });
  const [currentIndex, setCurrentIndex] = useState(0);

  const openLightbox = useCallback((index: number) => {
    setCurrentIndex(index);
    setLightbox({ open: true, index });
    document.body.style.overflow = "hidden";
  }, []);

  const closeLightbox = useCallback(() => {
    setLightbox({ open: false, index: -1 });
    document.body.style.overflow = "unset";
  }, []);

  const nextImage = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % networkImages.length);
  }, []);

  const prevImage = useCallback(() => {
    setCurrentIndex(
      (prev) => (prev - 1 + networkImages.length) % networkImages.length,
    );
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightbox.open) return;
      switch (e.key) {
        case "Escape":
          closeLightbox();
          break;
        case "ArrowRight":
          nextImage();
          break;
        case "ArrowLeft":
          prevImage();
          break;
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [lightbox.open, closeLightbox, nextImage, prevImage]);

  useEffect(() => {
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const currentItem = networkImages[currentIndex];

  return (
    <div className="">
      <section className="grid">
        <div className="gradient-blue  p-4 ">
          <h2 className="mb-3 font-semibold text-white text-[20px]">
            About Us
          </h2>
          <p className="text-white mb-3">
            MDRC started its operations in the year 1985 from New Railway Road,
            Gurugram and have become the pioneer in the field of Pathology and
            Imaging.
          </p>
          <button className="text-white flex gap-1 items-center">
            Read More <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      <section>
        <div className="px-4 py-6 space-y-6 bg-white">
          <div className="grid grid-cols-2 gap-4">
            {[
              {
                value: "40+",
                label: "Years Of Experience",
                icon: "/assets/images/icon/yoe.svg",
              },
              {
                value: "20 Crore+",
                label: "Tests Done So Far",
                icon: "/assets/images/icon/tdsf.svg",
              },
              {
                value: "21",
                label: "Labs in India",
                icon: "/assets/images/icon/li.svg",
              },
              {
                value: "1.5 Crore+",
                label: "Satisfied Customers",
                icon: "/assets/images/icon/sc.svg",
              },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg">
                  <img
                    src={item.icon}
                    alt={item.label}
                    className="h-8 w-8 object-contain"
                  />
                </div>

                <div>
                  <p className="text-lg font-semibold text-gray-900">
                    {item.value}
                  </p>
                  <p className="text-sm text-gray-600 leading-tight">
                    {item.label}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-3xl gradient-light-blue p-6 shadow-lg">
            <h3 className="text-xl font-semibold tx-blue  mb-2 flex items-center gap-2">
              <img
                src="/assets/images/icon/ov.svg"
                className="h-8 w-8 object-contain"
                alt="our vision"
              />{" "}
              Our Vision
            </h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              To become a leading diagnostic services provider in the country
              with unhinged focus on providing accurate, efficient & cutting
              edge diagnostic services to our patients.
            </p>
          </div>

          <div className="rounded-3xl gradient-light-green p-6 shadow-lg">
            <h3 className="text-xl font-semibold tx-blue  mb-2 flex items-center gap-2">
              <img
                src="/assets/images/icon/om.svg"
                className="h-8 w-8 object-contain"
                alt="our mission"
              />{" "}
              Our Mission
            </h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              To obtain & deploy the best and latest technologies in the world,
              to diagnose ailments of our patients in a accurate, timely and
              cost effective manner.
            </p>
          </div>
        </div>
      </section>

      <section>
        <div className="px-4 py-6">
          <div className="rounded-2xl bg-white p-6 shadow-lg">
            <h2 className="text-center text-lg font-semibold text-gray-800 mb-6">
              Our Accreditations
            </h2>

            <div className="flex flex-col items-center text-center mb-8">
              <div className="h-20 w-20 flex items-center justify-center mb-4">
                <div className="h-20 w-20 rounded-full flex items-center justify-center text-xs">
                  <img
                    src="/assets/images/about-img/nabl.svg"
                    className=""
                    alt="NABL"
                  />{" "}
                </div>
              </div>

              <h3 className="tx-blue  font-semibold mb-2">
                NABL Accredited Lab
              </h3>

              <p className="text-sm text-gray-600 leading-relaxed">
                MDRC has laid great emphasis on its Quality Control in all the
                labs across India. To reflect our commitment towards accurate
                reports, we have 6 NABL Labs across India following high
                standards of quality control to get accurate and consistent
                results.
              </p>

              <button className="mt-3 text-sm font-medium tx-green flex items-center gap-1">
                Read More <span>{">>"}</span>
              </button>
            </div>

            <div className="h-px bg-gray-200 my-6" />

            <div className="flex flex-col items-center text-center">
              <div className="h-20 w-20 flex items-center justify-center mb-4">
                <div className="h-20 w-20 rounded-full flex items-center justify-center text-xs">
                  <img
                    src="/assets/images/about-img/nabh.svg"
                    className=""
                    alt="NABH"
                  />{" "}
                </div>
              </div>

              <h3 className="tx-blue  font-semibold mb-2">
                NABH Accredited Imaging Centre
              </h3>

              <p className="text-sm text-gray-600 leading-relaxed">
                MDRC Diagnostic centre at Sector 44, Gurugram and our Reference
                Lab at New Railway Road, Gurugram are NABH accredited.
              </p>

              <p className="text-sm text-gray-600 leading-relaxed mt-2">
                Medical Imaging Services cover all investigations of patients
                which are helpful in diagnosis, prevention and the treatment of
                diseases or ascertaining the health of patients.
              </p>

              <button className="mt-3 text-sm font-medium tx-green flex items-center gap-1">
                Read More <span>{">>"}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="px-4 py-6 space-y-6 bg-white">
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-[#DCF5FF] shadow-md flex flex-col">
              <div className="flex justify-center pt-4 pb-3">
                <div className="h-12 w-12 flex items-center justify-center">
                  <img
                    src="/assets/images/icon/ir.svg"
                    alt="International Reach"
                    className="h-10 w-10"
                  />
                </div>
              </div>

              <div className="mt-auto rounded-xl bg-gradient-to-r from-[#62CEF8] to-[#4B9FC0] px-3 py-2 text-center">
                <p className="text-sm font-semibold text-white">
                  International Reach
                </p>
                <p className="text-xs text-white/90">
                  MDRC has international reach
                </p>
              </div>
            </div>

            <div className="rounded-xl bg-[#C8FFEE] shadow-md flex flex-col">
              <div className="flex justify-center pt-4 pb-3">
                <div className="h-12 w-12 flex items-center justify-center">
                  <img
                    src="/assets/images/icon/tp.svg"
                    alt="Touch points"
                    className="h-10 w-10"
                  />
                </div>
              </div>

              <div className="mt-auto rounded-xl bg-[#2DE2A9] px-3 py-2 text-center">
                <p className="text-sm font-semibold text-white">
                  2100+ Touch points
                </p>
                <p className="text-xs text-white/90">across India</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-gradient-to-b from-[#0b6aa8] to-[#1399d6] p-6 text-white shadow-md  ">
            <h3 className="mb-4 text-center text-lg font-semibold">
              Message from our CMD
            </h3>

            <div className="flex items-center gap-4 mb-4">
              <div>
                <p className="text-base font-semibold">Dr. D.S Yadav</p>
                <p className="text-sm opacity-90 mb-1">CMD</p>
                {/* <img
                  src="/assets/images/doctor/signature.svg"
                  className=""
                  alt="signature"
                />{" "} */}
              </div>

              <div className="ml-auto  overflow-hidden rounded-xl  flex items-center justify-center text-xs">
                <img
                  src="/assets/images/doctor/about-doctor.svg"
                  className=""
                  alt="doctor"
                />{" "}
              </div>
            </div>

            <p className="text-sm leading-relaxed opacity-95">
              "I feel privileged to communicate that we have been blessed by
              Almighty to have been able to serve patients for over three
              decades by providing best in class Imaging and Pathology Services.
              Since the inception of MODERN in 1985, it has been our effort to
              bring in the best and latest technology available anywhere in the
              world for our patients, so as to diagnose diseases at an early
              stage and thus help the patient and the clinician in better
              management of illness."
            </p>
          </div>
        </div>
      </section>

      <section>
        <DoctorsSlider />
      </section>
      <section>
        <TestingPortfolioSlider />
      </section>

      <section className="px-4 py-8 bg-white">
        <h2 className="text-center text-lg font-semibold text-gray-800 mb-6">
          Our Network
        </h2>

        <div className="mb-6 overflow-hidden rounded-xl">
          <img
            src="https://www.mdrcindia.com/images/about/11map.jpeg"
            alt="Our Network Map"
            className="w-full object-contain"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {networkImages.map((img, index) => (
            <button
              key={img.id}
              type="button"
              onClick={() => openLightbox(index)}
              className="h-40 w-full rounded-lg overflow-hidden shadow focus:outline-none"
            >
              <img
                src={img.src}
                alt={img.alt}
                className="h-40 w-full object-cover"
              />
            </button>
          ))}
        </div>
      </section>

      {lightbox.open && (
        <>
          <div
            className="fixed inset-0 z-[9999] backdrop-blur-sm bg-black/60"
            onClick={closeLightbox}
          />

          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 pointer-events-none">
            <div
              className="relative max-w-6xl max-h-[90vh] w-full h-auto flex flex-col items-center pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeLightbox}
                className="absolute -top-2 right-0 p-3 bg-black/60 hover:bg-black/80 text-white rounded-full transition-all duration-200"
                aria-label="Close"
              >
                <X className="w-6 h-6" />
              </button>

              <button
                onClick={prevImage}
                className="absolute left-0 top-[44%] -translate-y-1/2 p-3 bg-black/60 hover:bg-black/80 text-white rounded-full transition-all duration-200"
                aria-label="Previous"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={nextImage}
                className="absolute right-0 top-[44%] -translate-y-1/2 p-3 bg-black/60 hover:bg-black/80 text-white rounded-full transition-all duration-200"
                aria-label="Next"
              >
                <ChevronRightIcon className="w-6 h-6" />
              </button>

              <div className="w-full h-[70vh] max-h-[600px] flex items-center justify-center rounded-2xl overflow-hidden ">
                <img
                  src={currentItem.src}
                  alt={currentItem.alt}
                  className="max-w-full max-h-full object-contain"
                />
              </div>

              <div className="flex gap-2 mt-6 w-full overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 max-w-4xl">
                {networkImages.map((img, idx) => (
                  <button
                    key={img.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`flex-shrink-0 w-20 h-12 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                      idx === currentIndex
                        ? "border-white shadow-lg shadow-white/25"
                        : "border-transparent hover:border-white/50 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={img.src}
                      className="w-full h-full object-cover"
                      alt={img.alt}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
