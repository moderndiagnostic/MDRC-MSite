"use client";

import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

interface ImageData {
  title: string;
  image: string;
  slug: string;
}

interface ModernImagingSliderProps {
  images: ImageData[]; // Pass images as props to the component
  pageSlug: string; // Pass the page slug to construct the URL
}

export default function ModernImagingSlider({
  images,
  pageSlug,
}: ModernImagingSliderProps) {
  const getServiceHref = (slug: string) => {
    if (pageSlug) {
      return `/service/${pageSlug}/${slug}`;
    }

    return `/service/${slug}`;
  };

  return (
    <section className="pt-6 px-6 text-center rounded-xl">
      <div className="relative w-full max-w-4xl mx-auto">
        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={16}
          slidesPerView={2}
          pagination={{
            clickable: true,
          }}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          preventClicks={true}
          preventClicksPropagation={true}
          breakpoints={{
            375: {
              slidesPerView: 2,
              spaceBetween: 16,
            },
            425: {
              slidesPerView: 2,
              spaceBetween: 16,
            },
          }}
          className="service-swiper !pb-14"
        >
          {images.map((service) => (
            <SwiperSlide key={service.slug}>
              <div className="flex justify-center">
                <div className="gradient-blue rounded-xl shadow-md overflow-hidden w-72 p-3">
                  <Link href={getServiceHref(service.slug)}>
                    <Image
                      src={service.image}
                      alt={service.title}
                      width={400}
                      height={250}
                      className="w-full h-44 object-cover rounded-md"
                    />
                    <div className="bg-white p-2 mt-3 rounded-xl min-h-[88px]">
                      <h3 className="text-md font-semibold tx-blue">
                        {service.title}
                      </h3>
                    </div>
                  </Link>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
