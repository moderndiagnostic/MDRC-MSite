"use client";

import { X, ArrowRight, Smartphone, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLogin } from "@/hooks/useLogin";
import Link from "next/link";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (phone: string) => void;
}

const countryCodes = [{ code: "+91", label: "India" }];

const LoginModal = ({ isOpen, onClose, onSuccess }: LoginModalProps) => {
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const inputRef = useRef<HTMLInputElement>(null);
  const { login, loading } = useLogin();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      inputRef.current?.focus();
    } else {
      document.body.style.overflow = "";
    }
  }, [isOpen]);

  useEffect(() => {
  if (isOpen) {
    setPhone("");
    setError("");
    setCountryCode("+91");
    inputRef.current?.focus();
  }
}, [isOpen]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!/^[0-9]{10}$/.test(phone)) {
      setError("Enter valid 10 digit mobile number");
      return;
    }
    try {
      const response = await login(phone);
      if (response.msgCode == "1") {
        console.log("OTP Sent");
        onSuccess(`${countryCode}${phone}`);
      } else {
        console.log("OTP not Sent. Please try again.");
      }
    } catch (err) {
      setError("Login failed. Please try again.");
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300
          ${
            isOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }
        `}
      />

      {/* Bottom Sheet */}
      <div
        className={`
          fixed bottom-0 left-0 z-50 w-full
          h-[85%] max-h-[650px]
          bg-white rounded-t-3xl
          transform transition-transform duration-200 ease-in-out
          ${isOpen ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}
        `}
      >
        <div className="relative h-full overflow-y-auto px-6 py-8">
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute right-5 top-5 text-gray-400"
          >
            <X size={18} />
          </button>

          {/* Welcome */}
          <h2 className="text-center text-[#1160A5] font-semibold text-2xl mb-6">
            Welcome to MDRC!
          </h2>

          {/* Card */}
          <div className="bg-white rounded-2xl shadow-lg px-6 py-7">
            <h3 className="text-base font-semibold mb-2">Login/Sign Up</h3>
            <p className="text-sm text-gray-500 mb-6">
              Please enter your Mobile Number to proceed
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Phone Input */}
              <div className="flex items-center gap-3">
                {/* Country Code */}
                <div className="relative">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="appearance-none border rounded-lg px-3 py-3 pr-7
                               text-sm bg-gray-50 focus:outline-none"
                  >
                    {countryCodes.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.code}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={14}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  />
                </div>

                {/* Input */}
                <div
                  className={`flex items-center gap-2 flex-1 border rounded-lg px-3 py-3
                    ${error ? "border-red-500" : "border-gray-300"}
                  `}
                >
                  <Smartphone size={16} className="text-gray-400" />
                  <input
                    ref={inputRef}
                    type="tel"
                    placeholder="Enter Your Mobile No.*"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      setError("");
                    }}
                    className="w-full outline-none text-sm"
                  />
                </div>
              </div>

              {error && <p className="text-red-500 text-xs">{error}</p>}

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-between
             bg-gradient-to-r from-[#05AF79] to-[#0ECE91]
             text-white py-3 px-5 rounded-full font-medium"
              >
                <span className="mx-auto">
                  {loading ? "Please wait..." : "Login"}
                </span>
                <span className="bg-white p-1.5 rounded-md">
                  <ArrowRight size={16} color="green" />
                </span>
              </button>
            </form>

            {/* Terms */}
            <p className="text-xs text-gray-500 text-center mt-25 leading-relaxed">
              By proceeding, you agree with{" "}
              <span className="text-[#05AF79] font-medium">
                <Link href={"/page/terms-amp-condition"} onClick={onClose}>
                  Terms and Condition
                </Link>
                <Link href={"/page/privacy-policy"} onClick={onClose}>
                  {" "}
                  & Privacy Policy
                </Link>
              </span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginModal;
