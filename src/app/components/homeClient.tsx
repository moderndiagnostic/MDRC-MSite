"use client";
import BannerSlider from "../../components/BannerSlider";
import FullBodyCheckupSlider from "../../components/FullBodyCheckupSlider";
import HealthTestsTabSlider from "../../components/HealthTestsTabSlider";
import PopularHealthCheckupSlider from "../../components/PopularHealthCheckupSlider";
import TestsByConditionSlider from "../../components/TestsByConditionSlider";
import BrandVideoSection from "../../components/BrandVideoSection";
import CustomerReviewsSlider from "../../components/CustomerReviewsSlider";
import FaqAccordion from "../../components/FaqAccordion";
import BlogsSlider from "../../components/BlogsSlider";
import { Check, ChevronRight } from "lucide-react";
import Image from "next/image";
import NewsEventSlider from "../../components/NewsEventSlider";
import Link from "next/link";
import RadiologyImaginingTest from "@/components/RadiologyImaginingTest";
import { useDashboard } from "@/context/DashboardContext";
import MostBookedCheckupCarts from "@/components/MostBookedCheckupCarts";
import { useCity } from "@/context/CityContext";
import BookHealthScansTabSlider from "@/components/BookHealthScansTabSlider";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { useEffect, useState } from "react";
import { ContactInquiryModal } from "@/components/modals/ContactInquiryModal";

export default function HomePageClient() {
  const { homeData } = useDashboard();
  const { cityDetails } = useCity();
  const [openInquiry, setOpenInquiry] = useState(false);

  useEffect(() => {
    const modalClosed = document.cookie.includes("inquiryClosed=true");

    if (modalClosed) return;

    const timer = setTimeout(() => {
      setOpenInquiry(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleCloseInquiry = () => {
    const closedOnce = document.cookie.includes("inquiryClosedOnce=true");

    setOpenInquiry(false);

    if (!closedOnce) {
      // First close → reopen after 20 seconds
      document.cookie = "inquiryClosedOnce=true; path=/; max-age=10800";

      setTimeout(() => {
        setOpenInquiry(true);
      }, 30000);
    } else {
      // Second close → stop modal for 3 hours
      document.cookie = "inquiryClosed=true; path=/; max-age=10800";
    }
  };

  useEffect(() => {
    if (homeData?.meta_title) {
      // Set the Page Title
      const city = cityDetails?.name || "India";
      document.title = homeData.meta_title.replace("{CITY}", city);

      // Handle the JSON-LD Schema (Remove old one, add new one) [cite: 116, 117]
      const oldScript = document.getElementById("api-schema");
      if (oldScript) oldScript.remove();

      const script = document.createElement("script");
      script.id = "api-schema";
      script.type = "application/ld+json";
      // We strip the <script> tags from the string because we are creating a script element
      script.text = homeData.meta_schema.replace(/<script.*?>|<\/script>/g, "");
      document.head.appendChild(script);

      const link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      link.setAttribute("href", "https://www.mdrcindia.com");
      document.head.appendChild(link);
    }
  }, [homeData, cityDetails]);

  return (
    <div className=" space-y-6">
      {homeData?.banner && <BannerSlider banners={homeData.banner} />}
      <section className="grid grid-cols-2 gap-3 my-8 px-4">
        <div className="rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.15)]  overflow-hidden bg-[#EAF9FF] ">
          <Link href={`/pathology/lab-blood-test-near/${cityDetails?.slug}`}>
            <div className="flex justify-center items-center py-7">
              <img
                src="/assets/images/section-2/lab-tests.svg"
                alt=""
                className="h-20"
              />
            </div>
            <div className=" bg-gradient-to-r from-[#62CEF8] to-[#4B9FC0] text-white mt-auto h-full rounded-t-none rounded-xl p-2 text-center">
              <p className="font-semibold flex items-center justify-center gap-0.5">
                Book a Lab Tests
                <ChevronRight
                  size={16}
                  className="bg-white ml-1 rounded-0.5"
                  color="#4B9FC0"
                />
              </p>

              <p className="text-xs px-2">Home Sample Collection</p>
            </div>
          </Link>
        </div>

        <div className="rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.15)]  overflow-hidden bg-[#FFDFDF]">
          <Link href={`/radiology/imaging-lab-tests-near/${cityDetails?.slug}`}>
            <div className="flex justify-center items-center py-7">
              <img
                src="/assets/images/section-2/book-your-scan.svg"
                alt=""
                className="h-20"
              />
            </div>

            <div className="bg-gradient-to-r from-[#F69797] to-[#C87777] text-white text-center mt-auto h-full rounded-t-none rounded-xl  p-2 ">
              <p className="font-semibold flex items-center justify-center gap-0.5">
                Book your Scans
                <ChevronRight
                  size={16}
                  className="bg-white ml-1 rounded-0.5"
                  color="#C87777"
                />
              </p>
              <p className="text-xs">Quick Booking Made Easy</p>
            </div>
          </Link>
        </div>

        <div className="rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.15)] overflow-hidden bg-[#C8FFEE] flex flex-col">
          <Link href={`/category/${cityDetails?.slug}/genetic`}>
            <div className="flex justify-center items-center py-3">
              <img
                src="/assets/images/section-2/genetic-testing.svg"
                alt=""
                className="h-16"
              />
            </div>

            <div className="bg-[#05AF79]  text-white text-center mt-auto h-full rounded-t-none rounded-xl p-1 ">
              <p className="font-semibold text-sm">Genetic Testing</p>
              <p className="text-xs">Advanced Genomic Insights</p>{" "}
            </div>
          </Link>
        </div>

        <div className="rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.15)]  overflow-hidden bg-[#E6F6FF] flex flex-col">
          <Link href="/download-reports">
            <div className="flex justify-center items-center py-3">
              <img
                src="/assets/images/section-2/download-reports.svg"
                alt=""
                className="h-16"
              />
            </div>

            <div className="gradient-blue text-white text-center mt-auto h-full rounded-t-none rounded-xl  p-1 ">
              <p className="font-semibold text-sm">Download Reports</p>
              <p className="text-xs px-2">Check E-Reports Status</p>{" "}
            </div>
          </Link>
        </div>
      </section>

      <section>
        <div className="mx-4 my-8">
          <div className="rounded-3xl gradient-light-blue  shadow-[0_0_15px_rgba(0,0,0,0.15)]    px-4 py-6">
            <h2 className="text-2xl font-bold text-center text-gray-800">
              Our Foundation of Trust
            </h2>
            <p className="text-center text-gray-500 mt-2 text-sm">
              Decades of experience & A network of certified labs.
            </p>

            <div className="grid grid-cols-2 gap-2 mt-2">
              <div className="flex gap-4 items-center">
                <img src="/assets/images/icon/certified.svg" className="" />
                <div>
                  <p className="font-semibold tx-light-blue ">NABH & NABL</p>
                  <p className="text-xs text-gray-500">Certified Labs</p>
                </div>
              </div>

              <div className="flex gap-4 items-center">
                <img src="/assets/images/icon/experience.svg" className="" />
                <div>
                  <p className="font-semibold tx-light-blue ">40+</p>
                  <p className="text-xs text-gray-500">Years Of Experience</p>
                </div>
              </div>

              <div className="flex gap-4 items-center">
                <img src="/assets/images/icon/labs.svg" className="" />
                <div>
                  <p className="font-semibold tx-light-blue ">30+</p>
                  <p className="text-xs text-gray-500">Labs in India</p>
                </div>
              </div>

              <div className="flex gap-4 items-center">
                <img src="/assets/images/icon/customers.svg" className="" />
                <div>
                  <p className="font-semibold tx-light-blue ">1.5 Crore+</p>
                  <p className="text-xs text-gray-500">Satisfied Customers</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Full Body Checkups */}
      <section className="px-4 my-8">
        <FullBodyCheckupSlider />
      </section>

      <section className="my-8 px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-3 ml-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Most Booked Checkups
          </h2>
        </div>

        {/* Cards Grid */}
        <MostBookedCheckupCarts />

        {/* Bottom CTA */}
        <div className="mt-5 rounded-xl cursor-pointer bg-[#EAF6FD] flex items-center justify-between px-4 py-3">
          <div
            className="flex gap-4 items-center"
            onClick={() => setOpenInquiry(true)}
          >
            <img src="/assets/images/logo/call.svg" alt="call" />
            <div>
              <h4 className="text-[18px] tx-blue font-semibold ">
                Unable To Find The Right Test/Scan ?
              </h4>
              <p className="text-sm font-medium tx-blue ">
                Request a Call Back
              </p>
            </div>
          </div>
        </div>
      </section>
      <section>
        <TestsByConditionSlider diseases={homeData.diseases} />
      </section>

      {/* Popular Health Checkups */}
      <div className="bg-[#EAEAEA] pb-1">
        <section className="cursor-pointer p-4">
          <Swiper
            modules={[Autoplay, Pagination]}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            pagination={{ clickable: true }}
            loop
            slidesPerView={1}
            className="rounded-xl overflow-hidden"
          >
            {homeData.pathologyCatAndItemBanner?.map(
              (banner: string, index: number) => (
                <SwiperSlide key={index}>
                  <img
                    src={banner || "/assets/images/doctor/doctor.svg"}
                    alt="Food Intolerance Test"
                    className="w-full object-cover"
                  />
                </SwiperSlide>
              ),
            )}
          </Swiper>
        </section>

        <section className="px-4">
          <HealthTestsTabSlider />
        </section>
      </div>

      <section className="px-4">
        <PopularHealthCheckupSlider category={homeData.category} />
      </section>

      <section className="px-4 text-center my-8">
        <h2 className="text-center text-xl font-semibold text-gray-800 mb-6">
          Our Health Checkup Journey
        </h2>

        <img src="/assets/svg/checkup-journy.svg" alt="" className="w-full" />
      </section>

      <RadiologyImaginingTest />

      <div className="bg-[#EAEAEA] pb-1">
        <section className="cursor-pointer p-4">
          <Swiper
            modules={[Autoplay, Pagination]}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            pagination={{ clickable: true }}
            loop
            slidesPerView={1}
            className="rounded-xl overflow-hidden"
          >
            {homeData.homeHealthTestsBanner?.map(
              (banner: string, index: number) => (
                <SwiperSlide key={index}>
                  <img
                    src={banner || "/assets/images/doctor/doctor.svg"}
                    alt="Food Intolerance Test"
                    className="w-full object-cover"
                  />
                </SwiperSlide>
              ),
            )}
          </Swiper>
        </section>

        <section className="px-4">
          <BookHealthScansTabSlider />
        </section>
      </div>

      <section className="my-8 px-4">
        <div className="rounded-3xl overflow-hidden shadow-[0_0_15px_rgba(0,0,0,0.15)]">
          <Swiper
            modules={[Autoplay, Pagination]}
            slidesPerView={1}
            loop
            autoplay={{
              delay: 3500,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            pagination={{ clickable: true }}
            className="w-full"
          >
            {/* Slide 1 */}
            <SwiperSlide>
              <img
                src="https://www.mdrcindia.com/images/home_image_2.jpg"
                alt="Why Modern Diagnostic 2"
                className="w-full h-auto object-cover"
              />
            </SwiperSlide>

            {/* Slide 2 */}
            <SwiperSlide>
              <img
                src="https://www.mdrcindia.com/images/home_image_3.jpg"
                alt="Why Modern Diagnostic 3"
                className="w-full h-auto object-cover"
              />
            </SwiperSlide>

            {/* Slide 3 */}
            <SwiperSlide>
              <img
                src="https://www.mdrcindia.com/images/home_image_1.jpg"
                alt="Why Modern Diagnostic 1"
                className="w-full h-auto object-cover"
              />
            </SwiperSlide>
          </Swiper>
        </div>
      </section>

      <section className="mx-4 my-8">
        <div className="inline-flex items-center justify-between w-full rounded-3xl  bg-emerald-500 px-6 py-4 text-white shadow-[0_0_15px_rgba(0,0,0,0.15)] ">
          {/* Left text + button */}
          <div className="flex flex-col gap-1">
            <p className="text-sm">Easy Booking in</p>
            <p className="text-xl font-semibold">3 steps!</p>
            <Link
              href={`/radiology/imaging-lab-tests-near/${cityDetails?.slug}`}
            >
              <button
                type="button"
                className="mt-2 inline-flex items-center rounded-lg bg-white px-4 py-1.5 text-sm font-medium tx-green shadow-sm hover:bg-emerald-50"
              >
                Book Now
              </button>
            </Link>
          </div>

          {/* Right checklist (no extra function) */}
          <div className="flex flex-col gap-1 text-xs bg-white p-4 h-full rounded-xl">
            <div className="flex items-center gap-2">
              <span className="flex h-4 w-4 items-center justify-center rounded-full gradient-green">
                <Check className="h-3 w-3 text-white" strokeWidth={3} />
              </span>
              <span className="text-black text-base">Select Scans</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="flex h-4 w-4 items-center justify-center rounded-full gradient-green">
                <Check className="h-3 w-3 text-white" strokeWidth={3} />
              </span>
              <span className="text-black text-base">Add your details</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="flex h-4 w-4 items-center justify-center rounded-full gradient-green">
                <Check className="h-3 w-3 text-white " strokeWidth={3} />
              </span>
              <span className="text-black text-base">Book your slot</span>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full gradient-light-gray-2 px-4 py-6 my-8">
        <div className="flex items-center justify-between gap-3">
          {/* LEFT CONTENT */}
          <div className="w-[58%]">
            <h2 className="text-[20px] font-bold tx-blue leading-snug">
              Download the App
            </h2>

            <p className="text-base text-gray-700 leading-tight mt-1">
              for Quick Test Booking and <br />
              Report Access.
            </p>

            <p className="text-sm text-gray-500 mt-2 leading-snug">
              Our app made just for you! It&apos;s Easy, Convenient!
            </p>

            {/* STORE BUTTONS */}
            <div className="flex gap-2 mt-3">
              <Link
                href="https://play.google.com/store/apps/details?id=com.mdrcindia.booking"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="/assets/images/logo/google-play.svg"
                  alt="Get it on Google Play"
                  className="h-10"
                />
              </Link>
              <Link
                href="https://apps.apple.com/us/app/modern-diagnostic-health-app/id6504657715"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src="/assets/images/logo/app-store.svg" className="h-10" />
              </Link>
            </div>
          </div>

          {/* RIGHT IMAGE (SINGLE GROUP IMAGE) */}
          <div className="w-[42%] flex justify-end">
            <Image
              src="/assets/svg/mobile.svg" // ONE IMAGE ONLY
              alt="App Preview"
              width={160}
              height={320}
              className="object-contain"
              priority
            />
          </div>
        </div>
      </section>

      <section>
        <NewsEventSlider />
      </section>

      <section>
        <BrandVideoSection />
      </section>

      <section className="my-8 relative mb-0">
        {/* TOP GREEN AREA */}
        <div className="bg-dark-blue  h-34 ">
          <h2 className="text-center text-white text-2xl font-semibold pt-6">
            High End Testings
          </h2>
        </div>

        {/* BOTTOM WHITE AREA */}
        <div className="bg-white h-20 rounded-b-3xl"></div>

        {/* FLOATING CARDS */}
        <div className="absolute left-0 right-0 top-20 px-4">
          <div className="grid grid-cols-3 gap-4">
            {/* Pregnancy Care */}
            <div className="bg-white rounded-2xl shadow-[0_0_15px_rgba(0,0,0,0.15)]   text-center">
              <Link href="#">
                <img
                  src="/assets/images/high-end-testing/pregnancy.svg"
                  alt="Pregnancy Care"
                  className=" w-full object-cover mb-3"
                />
                <p className="text-gray-800 font-semibold mb-2">Pregnancy </p>
              </Link>
            </div>

            {/* TDM */}
            <div className="bg-white rounded-2xl shadow-[0_0_15px_rgba(0,0,0,0.15)]  text-center">
              <Link href="#">
                <img
                  src="/assets/images/high-end-testing/tdm.svg"
                  alt="TDM"
                  className=" w-full object-cover  mb-3"
                />
                <p className="text-gray-800 font-semibold mb-2">TDM</p>
              </Link>
            </div>

            {/* Oncology */}
            <div className="bg-white rounded-2xl shadow-[0_0_15px_rgba(0,0,0,0.15)]  text-center">
              <Link href="#">
                <img
                  src="/assets/images/high-end-testing/oncology.svg"
                  alt="Oncology"
                  className=" w-full object-cover mb-3"
                />
                <p className="text-gray-800 font-semibold mb-2">Oncology</p>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section>
        <CustomerReviewsSlider />
      </section>

      <section>
        <FaqAccordion pageType={"home"} />
      </section>

      <section>
        <BlogsSlider />
      </section>

      <section className="my-8 px-4">
        <Link href={`https://wa.me/${cityDetails?.whatsapp}`}>
          <div className="flex items-center justify-between gradient-green  rounded-2xl px-5 py-4 shadow-[0_0_15px_rgba(0,0,0,0.15)] ">
            <p className="text-white font-medium text-base">
              Can’t find what you’re
              <br />
              looking for?
            </p>

            <div className="relative flex items-center justify-center">
              {/* Pulse ring */}
              <span className="absolute inline-flex h-12 w-12 rounded-full bg-white opacity-30 animate-ping"></span>

              {/* Icon container */}
              <div className="relative  rounded-full h-14 w-14 flex items-center justify-center shadow-[0_0_15px_rgba(0,0,0,0.15)] ">
                <img
                  src="/assets/images/logo/whatsapp.svg"
                  alt="WhatsApp"
                  className="h-12 w-12"
                />
              </div>
            </div>
          </div>
        </Link>
      </section>
      <ContactInquiryModal isOpen={openInquiry} onClose={handleCloseInquiry} />
    </div>
  );
}
