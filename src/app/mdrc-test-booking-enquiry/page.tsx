"use client";
import { useId, useState } from "react";
import { ChevronRight, Paperclip } from "lucide-react";
import { useLocations } from "@/hooks/useLocations";
import { toast } from "react-toastify";
import Link from "next/link";
import requests from "@/lib/httpServices";
import { useCity } from "@/context/CityContext";


const ContactUsPage = () => {
    const { cities, loading: citiesLoading } = useLocations();
    const { cityDetails } = useCity();
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

    const radioId = useId();
    const RADIO_PREFIX = `booking-inquiry-${radioId}`;

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
                formData.append("city", location);
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
        const file = e.target.files?.[0];
        if (!file) return;

        const maxSize = 2 * 1024 * 1024;

        if (file.size > maxSize) {
            setFileError("File size must be less than 2 MB");
            setSelectedFile(null);
            return;
        }

        setFileError("");
        setSelectedFile(file);
    };

    return (
        <div className="w-full flex justify-center items-start bg-white py-6 px-4">
            <div className="w-full max-w-md space-y-4">
                <div className="bg-white rounded-2xl shadow-lg p-6 relative">
                    <div className="space-y-4">
                        {/* Radio Buttons */}
                        <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    id={`${RADIO_PREFIX}-newBooking`}
                                    name={`${RADIO_PREFIX}-queryType`}
                                    checked={isNewBooking}
                                    onChange={() => setIsNewBooking(true)}
                                    className="peer w-4 h-4 border-2 border-green-500 rounded-full checked:border-green-500 checked:bg-green-500"
                                />
                                <label
                                    htmlFor={`${RADIO_PREFIX}-newBooking`}
                                    className="text-sm text-gray-700"
                                >
                                    New Booking
                                </label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    id={`${RADIO_PREFIX}-supportQuery`}
                                    name={`${RADIO_PREFIX}-queryType`}
                                    checked={!isNewBooking}
                                    onChange={() => setIsNewBooking(false)}
                                    className="peer w-4 h-4 border-2 border-green-500 rounded-full checked:border-green-500 checked:bg-green-500"
                                />
                                <label
                                    htmlFor={`${RADIO_PREFIX}-supportQuery`}
                                    className="text-sm text-gray-700"
                                >
                                    Customer Support Query
                                </label>
                            </div>
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
                                    className="w-full pl-10 pr-3 py-3 bg-[#F6F6F6] border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
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
                                    type="text"
                                    id="mobile"
                                    value={mobile}
                                    onChange={(e) => setMobile(e.target.value)}
                                    placeholder="Enter Your Mobile No.*"
                                    className="w-full pl-10 pr-3 py-3 bg-[#F6F6F6] border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                                />
                            </div>
                            {errors.mobile && (
                                <p className="text-red-500 text-xs ml-1">
                                    {errors.mobile}
                                </p>
                            )}
                        </div>

                        {/* Dynamic Location Dropdown */}
                        <div className="space-y-1">
                            <select
                                id="location"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className="w-full px-3 py-3 bg-[#F6F6F6] border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 appearance-none bg-no-repeat bg-right pr-10"
                                style={{
                                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                                    backgroundPosition: "right 12px center",
                                }}
                            >
                                {citiesLoading ? (
                                    <option>Loading cities...</option>
                                ) : (
                                    cities.map((city: any) => (
                                        <option key={city.id} value={city.name}>
                                            {city.name}
                                        </option>
                                    ))
                                )}
                            </select>
                            {errors.location && (
                                <p className="text-red-500 text-xs ml-1">
                                    {errors.location}
                                </p>
                            )}
                        </div>

                        {/* Test Type Radio Buttons */}
                        <div className=" space-x-2">
                            <div className="flex items-center space-x-2 mb-2">
                                <input
                                    type="radio"
                                    id={`${RADIO_PREFIX}-bloodTest`}
                                    name={`${RADIO_PREFIX}-testType`}
                                    checked={isTestType}
                                    onChange={() => setIsTestType(true)}
                                    className="peer w-4 h-4 border-2 border-green-500 rounded-full checked:border-green-500 checked:bg-green-500"
                                />
                                <label
                                    htmlFor={`${RADIO_PREFIX}-bloodTest`}
                                    className="text-sm text-gray-700"
                                >
                                    Blood Test
                                </label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    id={`${RADIO_PREFIX}-mriCtScan`}
                                    name={`${RADIO_PREFIX}-testType`}
                                    checked={!isTestType}
                                    onChange={() => setIsTestType(false)}
                                    className="peer w-4 h-4 border-2 border-green-500 rounded-full checked:border-green-500 checked:bg-green-500"
                                />
                                <label
                                    htmlFor={`${RADIO_PREFIX}-mriCtScan`}
                                    className="text-sm text-gray-700"
                                >
                                    MRI CT Scan Ultrasound X-ray etc{" "}
                                </label>
                            </div>
                        </div>

                        {/* Upload Prescription */}
                        <div className="space-y-1">
                            <label
                                htmlFor="prescription"
                                className="flex items-center gap-2 justify-center w-full px-3 py-2 bg-white border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-teal-500 transition-colors"
                            >
                                <Paperclip className="w-4 h-4 text-gray-600" />
                                <span className="text-sm text-gray-600">
                                    {selectedFile
                                        ? selectedFile.name
                                        : "Upload Prescription"}
                                </span>
                                <input
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
                        <div className="flex items-start space-x-2 py-2">
                            <div className="flex items-center h-5">
                                <input
                                    type="checkbox"
                                    id="terms"
                                    checked={isChecked}
                                    onChange={() => setIsChecked(!isChecked)}
                                    className="w-4 h-4 accent-teal-500 rounded"
                                />
                            </div>
                            <label
                                htmlFor="terms"
                                className="text-xs text-gray-600 leading-tight"
                            >
                                You hereby affirm & authorise MDRC to process the personal
                                data as per the{" "}
                                <Link
                                    href="/page/terms-amp-condition"
                                    className="text-teal-600 hover:underline"
                                >
                                    <span className="font underline font-medium">T&C</span>
                                </Link>
                            </label>
                        </div>
                        {errors.terms && (
                            <p className="text-red-500 text-xs ml-1">{errors.terms}</p>
                        )}

                        {/* Submit Button */}
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className={`w-full py-3 bg-gradient-to-r from-[#05AF79] to-[#0ECE91] hover:bg-teal-600 text-white font-medium rounded-lg text-sm transition-colors ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
                        >
                            {loading ? "Submitting..." : "Get a Call Back"}
                        </button>

                        <div className="text-center text-xs text-gray-500 pt-1">
                            * Mandatory Fields
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl shadow-lg p-6 pb-2 hidden">
                    <div className="text-center font-semibold text-base border-b border-gray-200 pb-2">
                        Support
                    </div>
                    <Link href={`tel:${cityDetails?.phone}`}>
                        <div className="p-4 flex justify-between items-center border-b border-gray-200 hover:bg-gray-50 cursor-pointer">
                            <div className="flex items-center gap-3">
                                <div className="bg-blue-100 p-2 rounded-xl">
                                    <img
                                        src="/assets/images/icon/phone-icon.svg"
                                        className="w-7 h-7"
                                    />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">
                                        Call to Book Health Test
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {cityDetails?.phone}
                                    </p>
                                </div>
                            </div>
                            <ChevronRight />
                        </div>
                    </Link>
                    <Link
                        href={`https://wa.me/${cityDetails?.whatsapp}`}
                    >
                        <div className="p-4 flex justify-between items-center border-gray-200 hover:bg-gray-50 cursor-pointer">
                            <div className="flex items-center gap-3">
                                <div className="bg-green-100 p-2 rounded-xl">
                                    <img
                                        src="/assets/images/icon/whatsapp.svg"
                                        className="w-7 h-7"
                                    />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Chat on Whatsapp</p>
                                    <p className="text-xs text-gray-500">
                                        Book Radiology and Pathology Test
                                    </p>
                                </div>
                            </div>
                            <ChevronRight />
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ContactUsPage;
