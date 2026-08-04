"use client";
import { useState, useEffect } from "react";
import requests from "@/lib/httpServices";
import { PhoneIcon, UserIcon } from "lucide-react";
import FaqAccordion from "@/components/FaqAccordion";
import { useParams } from "next/navigation";
import ServiceSlider from "@/components/OtherServiceSlider";
import { toast } from "react-toastify";
interface Service {
  short_desc: string;
  slug: string;
  title: string;
  description: string;
  image: string;
}

interface ApiResponse {
  serviceDetail: Service[];
  otherServices: Service[];
}

export default function ModernImagingPage() {
  const [serviceData, setServiceData] = useState<ApiResponse | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { slug } = useParams();
  const parentSlug = slug?.[0];
  const serviceSlug = slug?.[1];

  const getServiceDetails = async () => {
    try {
      const response = await requests.post("/webApi/index.php", {
        view: "service_details",
        slug: serviceSlug,
      });
      setServiceData(response.data);
      window.scrollTo({ top: 0, behavior: "auto" });
    } catch (error) {
      console.error("Error fetching service details:", error);
    }
  };

  useEffect(() => {
    getServiceDetails();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !phone || !city || !message) {
      toast.error("Please fill all required fields!");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await requests.post("/webApi/index.php", {
        view: "call_back_inquiry",
        name,
        phone,
        city,
        message,
      });

      console.log(response, "response");

      if (response.msgCode === "1") {
        toast.success("Call Back Inquiry Submitted Successfully!");
        setName("");
        setPhone("");
        setCity("");
        setMessage("");
      } else {
        toast.error(response.message || "Submission failed");
      }
    } catch (error: any) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (
    !serviceData ||
    !serviceData.serviceDetail ||
    serviceData.serviceDetail.length === 0
  ) {
    return (
      <div className="min-h-96 text-center flex items-center justify-center p-4">
        Loading...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section>
        <div className="px-4 pt-4 text-center bg-gradient-to-b from-[#E6F8FF] to-[#FFFF]">
          <h2 className="text-3xl font-semibold tx-blue mb-4">
            {serviceData.serviceDetail[0].title}
          </h2>
          <p className="text-lg mb-0">
            {serviceData.serviceDetail[0].short_desc}
          </p>
          <div>
            <img
              src={serviceData.serviceDetail[0].image}
              alt={serviceData.serviceDetail[0].title}
              className="w-full mt-5"
            />
          </div>
        </div>
      </section>

      <section className="mb-0">
        <div className="px-4 pb-6">
          <div
            className="lab-service-content"
            dangerouslySetInnerHTML={{
              __html: serviceData.serviceDetail[0].description,
            }}
          />
        </div>
      </section>

      <section>
         <h2 className="text-2xl font-semibold text-center mb-2 tx-blue">
            Other Services
          </h2>
        <ServiceSlider
          services={serviceData.otherServices}
          parentSlug={parentSlug}
        />
      </section>

      <section className="bg-white p-4 m-4 rounded-lg shadow-[0_0_15px_rgba(0,0,0,0.15)] space-y-4">
        <h3 className="text-xl font-semibold">Get a Call Back</h3>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="relative">
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-3 pl-10 pr-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter Your Mobile No.*"
              disabled={isSubmitting}
            />
            <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
          </div>

          <div className="relative">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 pl-10 pr-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter Your Name*"
              disabled={isSubmitting}
            />
            <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
          </div>

          <div className="relative">
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full p-3 pr-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              disabled={isSubmitting}
            >
              <option>Gurugram</option>
              <option>Delhi</option>
              <option>Chandigarh</option>
            </select>
          </div>

          <div className="relative">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-3 pr-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Message"
              disabled={isSubmitting}
              rows={4}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 rounded-md text-white font-medium ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600"
            }`}
          >
            {isSubmitting ? "Submitting..." : "Get a Call Back"}
          </button>
        </form>
      </section>

      <section className="pb-6">
        <FaqAccordion pageType={""} />
      </section>
    </div>
  );
}
