"use client";

import { useEffect, useRef, useState } from "react";
import { Paperclip, X } from "lucide-react";
import { useLocations } from "@/hooks/useLocations";
import { toast } from "react-toastify";
import Link from "next/link";
import requests from "@/lib/httpServices";
import { useId } from "react";

interface ContactInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ContactInquiryModal({
  isOpen,
  onClose,
}: ContactInquiryModalProps) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const [mounted, setMounted] = useState(false);
  const { cities } = useLocations();
  const [isNewBooking, setIsNewBooking] = useState(true);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [location, setLocation] = useState("Gurugram");
  const [isChecked, setIsChecked] = useState(true);
  const [isTestType, setIsTestType] = useState(true);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState("");
  const citiesWithOther = [...cities, { name: "Other", id: "other" }];
  const fileInputRef = useRef<HTMLInputElement>(null);

  const reactId = useId();
  const RADIO_PREFIX = `booking-inquiry-${reactId}`;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const validateForm = () => {
    let formErrors: { [key: string]: string } = {};
    let isValid = true;

    const mobileRegex = /^[0-9]{10}$/;
    if (!mobile) {
      formErrors.mobile = "Mobile number is required";
      isValid = false;
    } else if (!mobileRegex.test(mobile)) {
      formErrors.mobile = "Please enter a valid 10-digit mobile number";
      isValid = false;
    }

    if (!name) {
      formErrors.name = "Name is required";
      isValid = false;
    }

    if (!location) {
      formErrors.location = "Location is required";
      isValid = false;
    }

    if (!isChecked) {
      formErrors.terms = "You must accept the terms and conditions";
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      setLoading(true);

      try {
        const formData = new FormData();

        formData.append("view", "test_booking_inquiry");
        formData.append("name", name);
        formData.append("phone", mobile);
        formData.append("city", location === "Other" ? "Other" : location);
        formData.append("address", location);
        formData.append(
          "enquiry_type",
          isNewBooking ? "New Booking" : "Customer Support Query",
        );
        formData.append(
          "test_type",
          isTestType ? "Blood Test" : "MRI/CT Scan Etc",
        );

        // 👇 FILE (optional)
        if (selectedFile) {
          formData.append("pre_file", selectedFile);
        }

        const result = await requests.post("/webApi/index.php", formData);

        if (result.msgCode === "1") {
          toast.success(result.message);
          setName("");
          setMobile("");
          setSelectedFile(null);
          setIsChecked(false);
          setErrors({});
        } else {
          toast.error(result.message || "Something went wrong.");
        }
      } catch (error) {
        console.error("API Error:", error);
        toast.error("Failed to connect to the server.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError("");
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = 2 * 1024 * 1024;

    if (file.size > maxSize) {
      setFileError("File size must be less than 2 MB");
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    setSelectedFile(file);
  };

  return (
    <>
      {/* OVERLAY */}
      <div
        onClick={() => {
          onClose();
          setErrors({});
        }}
        className={`
          fixed inset-0 z-40 bg-black/40 transition-opacity duration-300
          ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}
        `}
      />

      <div
        className={`
        fixed inset-0 z-[99999] flex items-center justify-center
        px-4
        transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
        ${
          isOpen
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-4 pointer-events-none"
        }
      `}
      >
        <div className="relative w-full max-w-[430px] h-auto max-h-[90vh] bg-white rounded-xl shadow-xl no-scrollbar">
          <div className="flex flex-col items-center px-4 pt-4 pb-3 border-b border-gray-300">
            <h1 className="text-base text-center font-semibold tx-blue">
              Book Your Diagnostic Call
            </h1>
            <p className="text-xs text-neutral-500 text-center font-normal">
              Just a few quick details to help us prepare for your call.
            </p>
          </div>

          <button
            onClick={() => {
              onClose();
              setErrors({});
            }}
            className="text-white cursor-pointer absolute z-50 -top-2 -right-2 bg-red-600 p-1 rounded-full"
          >
            <X size={22} className="stroke-3" />
          </button>

          <div className="w-full">
            <div className="w-full max-w-md space-y-4 overflow-y-auto h-full">
              <div className="bg-white p-4 relative rounded-xl">
                <div className="space-y-4">
                  {/* Radio Buttons */}
                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex items-center space-x-1">
                      <input
                        type="radio"
                        id={`${RADIO_PREFIX}-newBooking`}
                        name={`${RADIO_PREFIX}-queryType`}
                        checked={isNewBooking}
                        onChange={() => setIsNewBooking(true)}
                        className="peer cursor-pointer w-4 h-4 border border-green-600 appearance-none rounded-full checked:border-green-600 focus:outline-none relative"
                      />
                      <label
                        htmlFor={`${RADIO_PREFIX}-newBooking`}
                        className="text-sm cursor-pointer mt-0.5 text-gray-700"
                      >
                        New Booking
                      </label>
                    </div>
                    <div className="flex items-center space-x-1">
                      <input
                        type="radio"
                        id={`${RADIO_PREFIX}-supportQuery`}
                        name={`${RADIO_PREFIX}-queryType`}
                        checked={!isNewBooking}
                        onChange={() => setIsNewBooking(false)}
                        className="peer cursor-pointer w-4 h-4 border border-green-600 appearance-none rounded-full checked:border-green-600 focus:outline-none relative"
                      />
                      <label
                        htmlFor={`${RADIO_PREFIX}-supportQuery`}
                        className="text-sm mt-0.5 cursor-pointer text-gray-700"
                      >
                        Customer Support Query
                      </label>
                    </div>
                    <style jsx>{`
                      /* Add the green dot when the radio button is checked */
                      .peer:checked::after {
                        content: "";
                        position: absolute;
                        top: 3px; /* Adjust based on your radio button size */
                        left: 3px;
                        width: 8px; /* Adjust size of the dot */
                        height: 8px;
                        border-radius: 50%;
                        background-color: #05af79; /* Green dot */
                      }
                    `}</style>
                  </div>

                  {/* Name Input */}
                  <div className="space-y-1">
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <img
                          src="/assets/images/icon/user-icon.svg"
                          alt="user"
                          className="w-4 h-4"
                        />
                      </div>
                      <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter Your Name*"
                        className="w-full pl-10 pr-3 py-2 placeholder:text-sm bg-[#F6F6F6] border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                    {errors.name && (
                      <p className="text-red-500 text-xs ml-1">{errors.name}</p>
                    )}
                  </div>

                  {/* Mobile Input */}
                  <div className="space-y-1">
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <img
                          src="/assets/images/icon/mobile.svg"
                          alt="phone"
                          className="w-4 h-4"
                        />
                      </div>
                      <input
                        type="tel"
                        inputMode="numeric"
                        maxLength={10}
                        id="mobile"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        placeholder="Enter Your Mobile No.*"
                        className="w-full pl-10 pr-3 py-2 placeholder:text-sm bg-[#F6F6F6] border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                    {errors.mobile && (
                      <p className="text-red-500 text-xs ml-1">
                        {errors.mobile}
                      </p>
                    )}
                  </div>

                  {/* Dynamic Location Dropdown */}
                  <CustomSelect
                    options={citiesWithOther.map((city) => city.name)}
                    value={location}
                    onChange={setLocation}
                    error={errors.location}
                  />
                  {/* Test Type Radio Buttons */}
                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex items-center space-x-1">
                      <input
                        type="radio"
                        id={`${RADIO_PREFIX}-bloodTest`}
                        name={`${RADIO_PREFIX}-testType`}
                        checked={isTestType}
                        onChange={() => setIsTestType(true)}
                        className="peer cursor-pointer w-4 h-4 border border-green-600 appearance-none rounded-full checked:border-green-600 focus:outline-none relative"
                      />
                      <label
                        htmlFor={`${RADIO_PREFIX}-bloodTest`}
                        className="text-sm mt-0.5 cursor-pointer text-gray-700"
                      >
                        Blood Test
                      </label>
                    </div>
                    <div className="flex items-center space-x-1">
                      <input
                        type="radio"
                        id={`${RADIO_PREFIX}-mriCtScan`}
                        name={`${RADIO_PREFIX}-testType`}
                        checked={!isTestType}
                        onChange={() => setIsTestType(false)}
                        className="peer cursor-pointer w-4 h-4 border border-green-600 appearance-none rounded-full checked:border-green-600 focus:outline-none relative"
                      />
                      <label
                        htmlFor={`${RADIO_PREFIX}-mriCtScan`}
                        className="text-sm mt-0.5 cursor-pointer text-gray-700"
                      >
                        MRI CT Scan Ultrasound X-ray etc{" "}
                      </label>
                    </div>
                    <style jsx>{`
                      /* Add the green dot when the radio button is checked */
                      .peer:checked::after {
                        content: "";
                        position: absolute;
                        top: 3px; /* Adjust based on your radio button size */
                        left: 3px;
                        width: 8px; /* Adjust size of the dot */
                        height: 8px;
                        border-radius: 50%;
                        background-color: #05af79; /* Green dot */
                      }
                    `}</style>
                  </div>

                  {/* Upload Prescription */}
                  <div className="space-y-1">
                    <label
                      htmlFor="prescription"
                      className="flex items-center gap-1 justify-center w-full px-3 py-1 bg-white border border-dashed border-neutral-200 rounded-lg cursor-pointer hover:border-teal-500 transition-colors"
                    >
                      <Paperclip className="w-4 h-4 text-neutral-600" />
                      <span className="text-base text-neutral-400 !font-normal">
                        {selectedFile
                          ? selectedFile.name
                          : "Upload Prescription"}
                      </span>
                      <input
                        ref={fileInputRef}
                        type="file"
                        id="prescription"
                        className="hidden"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleFileChange}
                      />
                    </label>
                    {fileError && (
                      <p className="text-red-500 text-xs ml-1">{fileError}</p>
                    )}
                  </div>

                  {/* Terms Checkbox */}
                  <div className="flex flex-col gap-2 pt-2">
                    <div className="flex items-start gap-2 ">
                      <div className="flex items-center h-5">
                        <input
                          type="checkbox"
                          id="terms"
                          checked={isChecked}
                          onChange={() => setIsChecked(!isChecked)}
                          className="peer cursor-pointer w-5 h-5 appearance-none rounded bg-neutral-200 checked:bg-neutral-100 focus:outline-none relative"
                        />
                        <style jsx>{`
                          /* Custom green checkmark when checkbox is checked */
                          .peer:checked::after {
                            content: "✔";
                            font-size: 16px;
                            color: #05af79; /* White checkmark */
                            position: absolute;
                            top: 0px;
                            left: 0px;
                            width: 100%;
                            rotate: 5deg;
                            height: 100%;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                          }
                        `}</style>
                      </div>
                      <label
                        htmlFor="terms"
                        className="text-xs text-neutral-500 leading-tight"
                      >
                        You hereby affirm & authorise MDRC to process the
                        personal data as per the{" "}
                        <Link
                          href="/page/terms-amp-condition"
                          className="text-teal-600 hover:underline"
                        >
                          <span className="font underline font-medium">
                            T&C
                          </span>
                        </Link>
                      </label>
                    </div>

                    {errors.terms && (
                      <p className="text-red-500 text-xs ml-1">
                        {errors.terms}
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className={`w-full py-2 bg-[#05AF79] shadow-xl text-white font-medium rounded-lg text-base transition-colors ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
                  >
                    {loading ? "Submitting..." : "Get a Call Back"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const CustomSelect = ({ options, value, onChange, error }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(value);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleOptionClick = (option: any) => {
    setSelectedOption(option);
    onChange(option);
    setIsOpen(false);
  };

  // Close the dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false); // Close the dropdown
      }
    };

    // Add event listener to detect clicks outside
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up the event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className={`w-full px-3 py-2 bg-[#F6F6F6] border border-gray-200 rounded-lg text-sm text-neutral-500 cursor-pointer flex justify-between items-center ${isOpen ? "focus:ring-2 focus:ring-teal-500" : "focus:ring-0"}`}
        onClick={toggleDropdown}
        style={{ position: "relative" }}
      >
        <span>{selectedOption || "Select City"}</span>
        <img
          src="https://images.icon-icons.com/3250/PNG/512/chevron_up_down_filled_icon_201508.png"
          alt="Arrow"
          className="w-3.5 h-3 opacity-60"
        />
      </div>
      {isOpen && (
        <ul
          className="absolute left-0 right-0 bg-white border border-gray-200 shadow-[0_0_15px_rgba(0,0,0,0.15)] rounded-lg mt-1 max-h-44 overflow-y-auto no-scrollbar text-sm"
          style={{ zIndex: 999 }}
        >
          {options.map((option: any, index: number) => (
            <li
              key={index}
              onClick={() => handleOptionClick(option)}
              className="px-4 py-1.5 hover:bg-teal-500 border-b border-neutral-100 hover:text-white cursor-pointer"
            >
              {option}
            </li>
          ))}
        </ul>
      )}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};
