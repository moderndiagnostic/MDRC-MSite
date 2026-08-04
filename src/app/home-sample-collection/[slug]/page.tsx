"use client";

import Image from "next/image";
import homesample from "../../../../public/assets/images/home-sample-collection/home-sample.png";
import home from "../../../../public/assets/images/home-sample-collection/home.png";
import stopwatch from "../../../../public/assets/images/home-sample-collection/stop-watch.png";
import patient from "../../../../public/assets/images/home-sample-collection/patient.png";
import customercare from "../../../../public/assets/images/home-sample-collection/customer-care.png";
import whychoose1 from "../../../../public/assets/images/home-sample-collection/why-choose1.png";
import whychoose2 from "../../../../public/assets/images/home-sample-collection/why-choose2.png";
import whychoose3 from "../../../../public/assets/images/home-sample-collection/why-choose3.png";
import whychoose4 from "../../../../public/assets/images/home-sample-collection/why-choose4.png";
import whychoose5 from "../../../../public/assets/images/home-sample-collection/why-choose4.png";
import whyleft from "../../../../public/assets/images/home-sample-collection/why-choose-left.png";
import mis from "../../../../public/assets/images/home-sample-collection/mis.png";
import nabl from "../../../../public/assets/images/home-sample-collection/nabl.png";
import requests from "@/lib/httpServices";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const HomeSampleCollection = () => {
  const [cities, setCities] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    const data = sessionStorage.getItem("mdrc_location_data");
    if (data) {
      try {
        setCities(JSON.parse(data));
      } catch (e) {
        console.error("Error parsing city data", e);
      }
    }
  }, []);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    age: "",
    city: "",
    address: "",
    date: "",
    gender: "Male",
    brief_details: "",
    reference: "",
    view: "collection_appointment_inq",
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    if (name === "phone") {
      const numericValue = value.replace(/\D/g, "").slice(0, 10);
      setFormData((prev) => ({ ...prev, phone: numericValue }));
      return;
    }

    if (name === "age") {
      const numericValue = value.replace(/\D/g, "").slice(0, 3);
      setFormData((prev) => ({ ...prev, age: numericValue }));
      return;
    }
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    // Map of keys to readable labels for better error messages
    const fieldLabels: { [key: string]: string } = {
      name: "Name",
      phone: "Mobile Number",
      email: "Email ID",
      age: "Age",
      city: "City",
      address: "Address",
      date: "Appointment Date",
      brief_details: "Illness details",
      reference: "Reference (How you heard about us)",
    };

    const requiredFields = Object.keys(fieldLabels);

    // Validation logic with Toastify
    for (const field of requiredFields) {
      const value = formData[field as keyof typeof formData];
      if (!value || value.toString().trim() === "") {
        toast.error(`${fieldLabels[field]} is mandatory!`);
        return; // Stop execution
      }
    }

    // Basic Email Regex Validation (Optional but recommended)
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(formData.email)) {
      toast.error("Please enter a valid email address!");
      return;
    }

    try {
      // const response = await requests.post("/scripts/ajax/index.php", formData);
      const response = await requests.post("/webApi/index.php", formData);

      // Show Success Toast
      toast.success(
        "Request submitted successfully! Our team will call you soon.",
      );

      // Reset form after success
      setFormData({
        name: "",
        phone: "",
        email: "",
        age: "",
        city: "",
        address: "",
        date: "",
        gender: "Male",
        brief_details: "",
        reference: "",
        view: "collection_appointment_inq",
      });
    } catch (error) {
      console.error("Submission error:", error);
      // Show Error Toast
      toast.error(
        "Failed to submit request. Please check your connection and try again.",
      );
    }
  };
  const stats = [
    {
      value: "40+",
      label: "Years Of Experience",
    },
    {
      value: "20 Crore+",
      label: "Tests Done So Far",
    },
    {
      value: "20+",
      label: "Labs in India",
    },
    {
      value: "1.5 Crore+",
      label: "Satisfied Customers",
    },
  ];

  return (
    <div className="bg-white">
      <div className="w-full pb-7">
        <Image src={homesample} alt="homesample" width={500} height={500} />
      </div>
      <div>
        <div className="flex pb-7">
          {stats.map((stat, index) => (
            <div key={index} className="text-center px-3">
              <div className="font-semibold tx-blue">{stat.value}</div>
              <div className="text-xs text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="bg-gray-100 py-7 mb-7 px-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="mb-4 justify-items-center gap-2 flex">
              <Image src={home} alt="homesample" width={30} height={30} />
              <h3 className="text-xs font-semibold text-gray-900">
                Home Sample Collection - Safe & Convenient
              </h3>
            </div>
            <div className="mb-4 justify-items-center gap-2 flex">
              <Image src={stopwatch} alt="homesample" width={30} height={30} />
              <h3 className="text-xs font-semibold text-gray-900">
                Booking Slot From As Early a 7:30 AM
              </h3>
            </div>
            <div className="mb-4 justify-items-center gap-2 flex">
              <Image src={patient} alt="homesample" width={30} height={30} />
              <h3 className="text-xs font-semibold text-gray-900">
                Report Available Within 24 Hours
              </h3>
            </div>
            <div className="mb-4 justify-items-center gap-2 flex">
              <Image
                src={customercare}
                alt="homesample"
                width={30}
                height={30}
              />
              <p className="text-xs font-semibold text-gray-900">
                Care Centric - Customer Support - 24x7
              </p>
            </div>
          </div>
        </div>

        <div className="w-full max-w-md space-y-4 mb-7">
          <div className="bg-white rounded-2xl shadow-lg p-6 relative">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-center text-gray-800">
                Need Home Collection Near me?
              </h2>
              <p className="text-center text-gray-500 mt-2 text-sm leading-[1.6]">
                Blood tests can be done through home blood sample collection
                services that do away with the need to travel to the laboratory.
                Please fill up the following details for appointment. You will
                receive an confirmation call from centre regarding appointment
                details.
              </p>
            </div>
            <div className="flex items-center justify-center mt-10">
              <div className="w-full max-w-md space-y-5">
                <div className="space-y-1">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter Your Name*"
                    className="w-full pl-3 pr-3 py-3 bg-[#F6F6F6] border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div className="space-y-1">
                  <input
                    type="tel"
                    inputMode="numeric"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter Your Mobile No.*"
                    className="w-full pl-3 pr-3 py-3 bg-[#F6F6F6] border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div className="space-y-1">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email ID*"
                    className="w-full pl-3 pr-3 py-3 bg-[#F6F6F6] border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div className="space-y-1">
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    placeholder="Enter Your Age*"
                    className="w-full pl-3 pr-3 py-3 bg-[#F6F6F6] border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div className="space-y-1">
                  <div className="space-y-1">
                    <select
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full px-3 py-3 bg-[#F6F6F6] rounded-lg border-0 text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 appearance-none bg-no-repeat bg-right pr-10"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                        backgroundPosition: "right 12px center",
                      }}
                    >
                      <option value="">Select cities*</option>
                      {cities.map((city) => (
                        <option key={city.id} value={city.name}>
                          {city.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="space-y-1">
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter Your Address*"
                    className="w-full h-12 pl-3 pr-3 py-3 bg-[#F6F6F6] border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div className="space-y-1">
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full pl-3 uppercase pr-3 py-3 bg-[#F6F6F6] border-0 rounded-lg text-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div className="flex items-center space-x-6 w-full pl-3 pr-3 py-3 bg-[#F6F6F6] border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500">
                  <label className="flex items-center space-x-2 cursor-pointer text-sm text-gray-400">
                    <input
                      type="radio"
                      name="gender"
                      value="Male"
                      checked={formData.gender === "Male"}
                      onChange={handleChange}
                      className="w-4 h-4 border-gray-300 text-blue-500"
                    />
                    <span>Male</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer text-sm text-gray-400">
                    <input
                      type="radio"
                      name="gender"
                      value="Female"
                      checked={formData.gender === "Female"}
                      onChange={handleChange}
                      className="w-4 h-4 border-gray-300 text-blue-500"
                    />
                    <span>Female</span>
                  </label>
                </div>
                <div className="space-y-1">
                  <textarea
                    name="brief_details"
                    value={formData.brief_details}
                    onChange={handleChange}
                    placeholder="Brief details of your illness*"
                    rows={4}
                    className="w-full pl-3 pr-3 py-3 bg-[#F6F6F6] border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  ></textarea>
                </div>
                <div className="space-y-1">
                  <select
                    name="reference"
                    value={formData.reference}
                    onChange={handleChange}
                    className="w-full px-3 py-3 bg-[#F6F6F6] border border-gray-200 rounded-lg text-sm text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 appearance-none bg-no-repeat bg-right pr-10"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                      backgroundPosition: "right 12px center",
                    }}
                  >
                    <option value="">How did you hear about us*</option>
                    <option value="social_media">Social Media</option>
                    <option value="friend_relative">Friend/Relative</option>
                    <option value="newspaper">Newspaper</option>
                    <option value="advertisement">Advertisement</option>
                    <option value="Others">Others</option>
                  </select>
                </div>
                <div className="pt-4">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="w-full py-3 bg-gradient-to-r from-[#05AF79] to-[#0ECE91] hover:bg-teal-600 text-white font-medium rounded-lg text-sm transition-colors"
                  >
                    Request a call back
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="px-2 mb-7 space-y-5">
          <div>
            <h3 className="text-lg font-semibold">
              Home Blood Sample Collection
            </h3>
            <p className="text-gray-700 text-base mb-6">
              When you are unwell, stress is the last thing you would want.
              Finding the nearest pathology lab, and waiting in line with people
              who might have communicable diseases, is a lot more stress than
              one should have. Hence Modern Diagnostic & Research Centre offers
              home blood collection service for our patients.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold">
              Why choose Modern Diagnostic for Home blood sample collection?
            </h4>
            <p className="text-gray-700 text-base mb-6">
              When you are unwell, stress is the last thing you would want.
              Finding the nearest pathology lab, and waiting in line with people
              who might have communicable diseases, is a lot more stress than
              one should have. Hence Modern Diagnostic & Research Centre offers
              home blood collection service for our patients.
            </p>
          </div>
          <div>
            <h4 className="text-xl font-semibold mb-3">How To book</h4>
            <h4 className="text-lg font-semibold">
              You can book the home blood sample collection in 3 steps.
            </h4>
            <p className="text-gray-700 text-base mb-3">
              First Choose the test or package and click Book Now. Then you have
              to enter the patient details for whom the test is booked, i.e.
              their name, contact no., age, gender, etc. After that, you can
              select your preferred date and time for the home blood sample
              collection. You will get specific instructions from our experts if
              needed for the test.
            </p>
            <p className="text-gray-700 text-base mb-6">
              On your preferred date and time our Phlebotomist, a trained
              professional assigned to collect your blood sample will call you
              to confirm the time and collect the sample
            </p>
          </div>
        </div>
        <div className="bg-gradient-to-b from-[#E6F8FF] to-[#FFFFFF] rounded-b-xl px-4 py-4 space-y-4">
          <div>
            <h4 className="text-2xl font-bold text-center text-gray-800">
              Why choose Modern Diagnostic & Research Centre?
            </h4>
          </div>
          <div>
            <div className="flex gap-3 pt-5 items-center">
              <Image src={whychoose1} alt="homesample" width={50} height={50} />
              <h3 className="text-lg font-medium text-gray-900">
                Presence in 16+ Cities
              </h3>
            </div>
            <div className="flex gap-3 pt-3 items-center">
              <Image src={whychoose2} alt="homesample" width={50} height={50} />
              <h3 className="text-lg font-medium text-gray-900">
                2500+ Tests and Profiles
              </h3>
            </div>
            <div className="flex gap-3 pt-3 items-center">
              <Image src={whychoose3} alt="homesample" width={50} height={50} />
              <h3 className="text-lg font-medium text-gray-900">
                20+ Laboratories
              </h3>
            </div>
            <div className="flex gap-3 pt-3 items-center">
              <Image src={whychoose4} alt="homesample" width={50} height={50} />
              <h3 className="text-lg font-medium text-gray-900">
                5 Crores+ Tests performed
              </h3>
            </div>
            <div className="flex gap-3 pt-3 items-center">
              <Image src={whychoose5} alt="homesample" width={50} height={50} />
              <h3 className="text-lg font-medium text-gray-900">
                40+ Years of Service
              </h3>
            </div>
          </div>
          <Image
            src={whyleft}
            alt="homesample"
            width={400}
            height={400}
            className="px-2"
          />
        </div>
        <div className="px-3 py-6">
          <div className=" items-center text-center">
            <h4 className="text-2xl font-bold text-center text-gray-800">
              Home Blood Sample Collection
            </h4>
            <p className="text-center text-gray-500 mt-2 text-sm mb-2">
              Our Accreditations
            </p>
            <div className="flex gap-2 justify-center">
              <Image src={mis} alt="homesample" width={190} height={190} />
              <Image src={nabl} alt="homesample" width={190} height={190} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeSampleCollection;
