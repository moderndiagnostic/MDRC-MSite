"use client";

import { useState, useEffect } from "react";
import requests from "@/lib/httpServices";
import FaqAccordion from "@/components/FaqAccordion";
import ModernImagingSlider from "@/components/ModernImagingSlider";
import { useParams } from "next/navigation";
import { applyClientMeta } from "@/utils/applyClientMeta";

interface Service {
  slug: string;
  title: string;
  description: string;
  image: string;
}

interface DoctorRecord {
  title: string;
  description: string;
}

interface SpecialityItem {
  image: string;
  title: string;
  description: string;
}

interface Speciality {
  title: string;
  description: string;
  items: SpecialityItem[];
}

interface Other {
  items: any;
  title: string;
  description: string;
  image: string;
}

interface ApiResponse {
  meta_title: string;
  meta_description: string;
  meta_keyword: string;
  meta_schema: string;
  favicon: string;
  recordDoctor: DoctorRecord[];
  services: Service[];
  speciality: Speciality[];
  other: Other[];
}

const DynamicPage = () => {
  const [data, setData] = useState<ApiResponse | null>(null);
  const { slug } = useParams<{ slug: string }>();

  // Fetch services based on the dynamic slug
  const getServicesBySlug = async (slug: string) => {
    try {
      const response = await requests.post("/webApi/index.php", {
        view: "for_doctors",
        slug,
      });
      setData(response.data as ApiResponse); // Ensure the response is of type ApiResponse
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  useEffect(() => {
    if (slug && typeof slug === "string") {
      getServicesBySlug(slug); // Trigger API call when the slug changes
    }
  }, [slug]);

  useEffect(() => {
    if (!data) return;

    applyClientMeta({
      title: data.meta_title,
      description: data.meta_description,
      keywords: data.meta_keyword,
      favicon: data.favicon,
      schema: data.meta_schema,
    });
  }, [data]);

  if (!data) {
    return (
      <div className="min-h-96 text-center flex items-center justify-center p-4">
        Loading...
      </div>
    );
  }
  const images = data.services.map((service) => ({
    title: service.title,
    image: service.image,
    slug: service.slug, // Pass the service slug here
  }));
  return (
    <div className="space-y-6">
      <section>
        {/* Title */}
        <div className="px-4 pt-4 text-center bg-gradient-to-b from-[#E6F8FF] to-[#FFFF]">
          <h2 className="text-3xl font-semibold tx-blue mb-4">
            {data.recordDoctor[0].title}
          </h2>
          <p className="text-lg mb-0">{data.recordDoctor[0].description}</p>
        </div>
        <ModernImagingSlider
          images={images}
          pageSlug={slug} // Pass the page slug
        />{" "}
      </section>

      <section>
        <div className="py-6 px-4">
          <div className="max-w-2xl mx-auto text-center">
            {/* Ensure you're accessing the correct structure here */}
            <h2 className="text-2xl font-semibold tx-blue mb-4">
              {data.speciality[0].title} {/* Fixed to access the first item */}
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              {data.speciality[0].description}{" "}
              {/* Fixed to access the first item */}
            </p>

            <div className="space-y-6">
              {data.speciality[0].items.map((item) => (
                <div
                  key={item.title}
                  className="flex items-center bg-gradient-to-r from-green-100 to-white rounded-lg p-6 shadow-lg space-x-4"
                >
                  <div className="text-green-500">
                    <img
                      src={item.image}
                      alt={item.title}
                      width={50}
                      height={50}
                    />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-bold text-lg">{item.title}</h3>
                    <p className="text-sm text-left text-gray-500">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="my-8 px-4">
        <div className="relative gradient-blue  rounded-3xl overflow-hidden text-white">
          {/* CONTENT */}
          <div className="p-6 pb-0">
            {/* Heading */}
            <h2 className="text-xl font-bold mb-3">Why Us?</h2>

            {/* Sub heading */}
            <p className="text-sm mb-4">
              We are India’s fastest-growing diagnostic service provider, with a
              presence in more than 120 cities. We offer a holistic in-house
              end-to-end solution - Right from the time of receiving a call, to
              the home collection, testing of the sample, generating report and
              mailing it further to the patient, every step is carefully and
              professionally executed by the experienced in-house team. Our
              expertise lies in on-demand 1-hour home collection and same-day
              reports within 24 hours* (T&C apply). All our owned pathology labs
              and diagnostic centres are equipped with state-of-the-art
              infrastructure and staffed with a highly trained medical team to
              meet the testing requirements of the patients. Our automated
              processes ensure minimal human interference, which helps maintain
              a high degree of accuracy that leads to better patient
              diagnosis.{" "}
            </p>
          </div>

          {/* IMAGE */}
          <div className="relative px-6">
            <img
              src="/assets/images/doctor/doctor-patient.svg"
              alt="Diagnostic Sample Collection"
              className="w-full object-cover "
            />
          </div>
        </div>
      </section>

      <section>
        <div className="mx-4 my-8">
          <div className="rounded-3xl gradient-light-blue  shadow-md   px-4 py-6">
            <h2 className="text-2xl font-bold text-center text-gray-800">
              Our Foundation of Trust
            </h2>
            <p className="text-center text-gray-500 mt-2">
              Decades of experience & A network of certified labs.
            </p>

            <div className="grid grid-cols-2 gap-2 mt-2">
              <div className="flex gap-4 items-center">
                <img src="/assets/images/icon/certified.svg" className="" />
                <div>
                  <p className="font-semibold tx-light-blue ">NABH & NABL</p>
                  <p className="text-sm text-gray-500">Certified Labs</p>
                </div>
              </div>

              <div className="flex gap-4 items-center">
                <img src="/assets/images/icon/experience.svg" className="" />
                <div>
                  <p className="font-semibold tx-light-blue ">40+</p>
                  <p className="text-sm text-gray-500">Years Of Experience</p>
                </div>
              </div>

              <div className="flex gap-4 items-center">
                <img src="/assets/images/icon/labs.svg" className="" />
                <div>
                  <p className="font-semibold tx-light-blue ">21+</p>
                  <p className="text-sm text-gray-500">Labs in India</p>
                </div>
              </div>

              <div className="flex gap-4 items-center">
                <img src="/assets/images/icon/customers.svg" className="" />
                <div>
                  <p className="font-semibold tx-light-blue ">1.5 Crore+</p>
                  <p className="text-sm text-gray-500">Satisfied Customers</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="gradient-green p-3">
          <h2 className="text-xl text-center text-white font-semibold mb-6">
            {data.other[0].title} {/* Dynamic title from API */}
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {/* Dynamically render icon sections from API data */}
            {data.other[0].items.map((item: any, index: any) => (
              <div key={index} className="flex items-center gap-4">
                <div className="relative h-20 w-20 flex items-center justify-center rounded-full overflow-hidden">
                  <div className="absolute inset-0 bg-[#d8dfe6] blur-3xl scale-125"></div>
                  <div className="absolute inset-0 rounded-full"></div>
                  <img
                    src={item.image}
                    alt={item.description}
                    className="relative z-10 w-12 h-12"
                  />
                </div>
                <p className="flex-1 text-white">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-6">
        <FaqAccordion pageType={""} />
      </section>
    </div>
  );
};

export default DynamicPage;
