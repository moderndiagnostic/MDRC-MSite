"use client";
import React, { useState } from "react";
import { ChevronsRight } from "lucide-react";
import inquiryService from "@/services/inquiryService";

interface FormData {
  mobile: string;
  name: string;
  company: string;
  email: string;
  message: string;
}

interface Service {
  id: string;
  title: string;
  subtitle: string;
  image: string;
}

const CorporateTieup: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    mobile: "",
    name: "",
    company: "",
    email: "",
    message: "",
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [Message, setMessage] = useState("");

  const services: Service[] = [
    {
      id: "pre-employment",
      title: "Pre-Employment Health Checkups",
      subtitle:
        "Ensure a Healthy Workforce with Pre-Employment Medical Screenings",
      image: "/assets/images/corporate-tieup/medical-care1.svg",
    },
    {
      id: "annual-checkups",
      title: "Annual Health Checkups",
      subtitle: "Comprehensive annual health screenings for your employees",
      image: "/assets/images/corporate-tieup/medical-care2.svg",
    },
    {
      id: "preventive-packages",
      title: "Preventive Healthcare Packages",
      subtitle: "Tailored preventive care solutions for corporate wellness",
      image: "/assets/images/corporate-tieup/medical-care3.svg",
    },
    {
      id: "health-camps",
      title: "On-Site & Off-Site Health Camps",
      subtitle: "Convenient health camps at your workplace or our facilities",
      image: "/assets/images/corporate-tieup/medical-care4.svg",
    },
    {
      id: "wellness-programs",
      title: "Customized Wellness Programs",
      subtitle: "Personalized wellness initiatives to boost employee health",
      image: "/assets/images/corporate-tieup/medical-care5.svg",
    },
    {
      id: "home-collection",
      title: "Home Sample Collection Services",
      subtitle: "Convenient at-home sample collection for your employees",
      image: "/assets/images/corporate-tieup/medical-care6.svg",
    },
  ];

  const validate = () => {
    const newErrors: Partial<FormData> = {};

    if (!formData.mobile.trim()) newErrors.mobile = "Mobile number is required";
    else if (!/^[0-9]{10}$/.test(formData.mobile))
      newErrors.mobile = "Enter valid 10 digit mobile number";

    if (!formData.name.trim()) newErrors.name = "Name is required";

    if (!formData.company.trim())
      newErrors.company = "Company name is required";

    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email))
      newErrors.email = "Enter valid email address";

    if (!formData.message.trim()) newErrors.message = "Message is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    // Allow typing anything, but validate numbers
    if (name === "mobile" && value && !/^\d*$/.test(value)) {
      setErrors((prev) => ({
        ...prev,
        mobile: "Only numbers are allowed",
      }));
    } else {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setIsSubmitting(true);

      const body = new FormData();
      body.append("name", formData.name);
      body.append("email", formData.email);
      body.append("mobile", formData.mobile);
      body.append("company", formData.company);
      body.append("message", formData.message);
      body.append("view", "corporate_tieup_enquiry");

      const response = await inquiryService.addNewInquiry(body);

      if (response === 0) {
        setMessage("Inquiry submitted successfully!");
        setTimeout(() => {
          setMessage("");
        }, 5000);
      }

      // Reset form
      setFormData({
        mobile: "",
        name: "",
        company: "",
        email: "",
        message: "",
      });

      setErrors({});
    } catch (error: any) {
      console.error("Submission Error:", error);
      setMessage("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className=" bg-[white]">
      {/* Hero Section - Mobile First */}
      <div className="bg-white shadow-sm ">
        <img
          src="/assets/images/corporate-tieup/Corporate-Tieup-banner_ 1.svg"
          className="w-full h-auto"
        />
      </div>

      {/* Wellness Section - Mobile First */}
      <div className="px-4 py-6 max-w-7xl mx-auto">
        <div className="bg-white rounded-t-2xl rounded-br-4xl rounded-bl-xl border-1 border-gray-200 shadow-lg overflow-hidden">
          <img
            src="/assets/images/corporate-tieup/doc-with-apple.svg"
            alt="Healthcare professional"
            className="w-full "
          />
          <div className="p-4">
            <h2 className="text-xl font-bold text-gray-800 mb-3">
              Prioritizing Employee Well-being
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              In today's fast-paced corporate world, employee health plays a
              vital role in organizational success. A healthy workforce leads to
              increased productivity, reduced absenteeism, and a positive work
              environment. Our corporate healthcare tie-up services provide
              comprehensive health and wellness solutions tailored to meet the
              needs of your employees.
            </p>
          </div>
        </div>
      </div>

      {/* Services Section - Mobile First */}
      <div className="px-4 py-6 bg-[#F4FFFC]">
        <h2 className="text-xl font-bold text-[#005C96] mb-3 text-center">
          Our Healthcare Solutions for Corporates
        </h2>
        <p className="text-md text-gray-600 text-center mb-6 px-4 max-w-3xl mx-auto">
          We offer a diverse range of medical and wellness services designed to
          support employee health and improve workplace efficiency
        </p>

        <div className="grid grid-cols-1 gap-4">
          {services.map((service) => (
            <div key={service.id}>
              <img
                src={service.image}
                alt={service.title}
                className="w-full object-cover rounded-2xl"
              />
              <div className="pb-4 pt-2 px-2">
                <h3 className="text-base  font-bold text-gray-800 mb-2">
                  {service.title}
                </h3>
                <p className="text-base -600 mb-3">{service.subtitle}</p>
                <button className="text-sm  tx-green  flex items-center gap-1 hover:gap-2 transition-all">
                  Read More <ChevronsRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lab Info Banner - Mobile First */}
      <div>
        <div>
          {/* Added overflow-x-hidden to prevent the microscope from causing horizontal scroll on mobile */}
          <div className="bg-gradient-to-b from-[#1160A5] to-[#189ED3] relative overflow-x-hidden pb-4 pt-4 flex items-center">
            <div className="w-full px-6  w-[70%] flex flex-row ">
              {/* Left Content Section: Restricted to 60% width on mobile to prevent overlap with the doctor */}
              <div className="w-full z-10 text-white space-y-6">
                <div className="space-y-2">
                  <h1 className="text-xl  font-bold leading-tight">
                    Trusted Diagnostic Lab Centre in
                  </h1>
                  <p className="text-md  font-light opacity-90">
                    Top-Rated Lab Testing Facilities Near You
                  </p>
                </div>

                {/* Stats Grid: Always 2 columns x 2 rows */}
                <div className="grid grid-cols-2 gap-x-2 gap-y-2 w-[60%]">
                  {/* Stat 1 */}
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 border-2 border-white rounded-full flex items-center justify-center shrink-0">
                      <img
                        src="/assets/images/corporate-tieup/icon1.svg"
                        alt="Lab Icon"
                        className="h-4 w-4 "
                      />
                    </div>
                    <div>
                      <div className="text-xs font-bold">20+ Labs</div>
                      <div className="text-[10px] opacity-80">in India</div>
                    </div>
                  </div>

                  {/* Stat 2 */}
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 border-2 border-white rounded-full flex items-center justify-center shrink-0">
                      <img
                        src="/assets/images/corporate-tieup/icon2.svg"
                        alt="Experience Icon"
                        className="h-4 w-4"
                      />
                    </div>
                    <div>
                      <div className="text-xs font-bold">40+ Years</div>
                      <div className="text-[10px]  opacity-80">
                        Of Experience
                      </div>
                    </div>
                  </div>

                  {/* Stat 3 */}
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 border-2 border-white rounded-full flex items-center justify-center shrink-0">
                      <img
                        src="/assets/images/corporate-tieup/icon3.svg"
                        alt="Tests Done Icon"
                        className="h-4 w-4"
                      />
                    </div>
                    <div>
                      <div className="text-xs font-bold">20 Crore+</div>
                      <div className="text-[10px]  opacity-80">
                        Tests Done So Far
                      </div>
                    </div>
                  </div>

                  {/* Stat 4 */}
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 border-2 border-white rounded-full flex items-center justify-center shrink-0">
                      <img
                        src="/assets/images/corporate-tieup/icon4.svg"
                        alt="Facilities Icon"
                        className="h-4 w-4"
                      />
                    </div>
                    <div>
                      <div className="text-xs font-bold">Advanced</div>
                      <div className="text-[10px] opacity-80">
                        Diagnostic Facilities
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Image Section: Absolute positioning keeps it at the right for all screen sizes */}
              <div className="absolute right-0 top-[30%] w-[35%] ">
                {/* Microscope + Test Tubes */}

                {/* Female Doctor */}
                <img
                  src="/assets/images/corporate-tieup/doc-microscope.png"
                  alt="Doctor"
                  className="w-full z-30 drop-shadow-lg "
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How to Get Started - Mobile First */}
      <div className=" py-6 px-1">
        <img
          src="/assets/images/corporate-tieup/howtostart.svg"
          className="w-full"
        />
      </div>

      {/* Contact Form - Mobile First */}
      <div className="px-4 py-8 max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-xl p-5 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center ">
            Enquire Now
          </h2>

          <div className="space-y-4">
            <div>
              <input
                type="tel"
                name="mobile"
                inputMode="numeric"
                placeholder="Enter Your Mobile No.*"
                value={formData.mobile}
                onChange={handleInputChange}
                className="w-full px-3 py-2.5 bg-gray-50 border rounded-lg "
              />
              {errors.mobile && (
                <p className="text-red-500 mt-2 text-xs">{errors.mobile}</p>
              )}
            </div>

            <div>
              <input
                type="text"
                name="name"
                placeholder="Enter Your Name*"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2.5 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              {errors.name && (
                <p className="text-red-500 mt-2 text-xs">{errors.name}</p>
              )}
            </div>

            <div>
              <input
                type="text"
                name="company"
                placeholder="Company Name*"
                value={formData.company}
                onChange={handleInputChange}
                className="w-full px-3 py-2.5 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              {errors.company && (
                <p className="text-red-500 mt-2 text-xs">{errors.company}</p>
              )}
            </div>

            <div>
              <input
                type="email"
                name="email"
                placeholder="Email*"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2.5 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              {errors.email && (
                <p className="text-red-500 mt-2 text-xs">{errors.email}</p>
              )}
            </div>

            <div>
              <textarea
                name="message"
                placeholder="Message*"
                value={formData.message}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2.5 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              {errors.message && (
                <p className="text-red-500 mt-1 text-xs">{errors.message}</p>
              )}
            </div>

            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-[#05AF79] to-[#0ECE91] hover:bg-green-600 active:bg-green-700 text-white font-semibold py-2.5 text-sm rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>

            {Message && (
              <p className="text-center mt-4 text-sm text-green-600">
                {Message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Support Section - Mobile First */}
      <div>
        <img
          src="/assets/images/corporate-tieup/Layer_1.svg"
          className="w-full px-2 pt-4 pb-8"
        />
      </div>
    </div>
  );
};

export default CorporateTieup;
