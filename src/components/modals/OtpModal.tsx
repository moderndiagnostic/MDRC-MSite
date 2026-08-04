"use client";

import { X, ArrowRight, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useVerifyOtp } from "@/hooks/useVerifyOtp";
import OtpInput from "react-otp-input";
import { useModalStore } from "@/app/store/modal.store";
import { useResendOtp } from "@/hooks/useResendOtp";

interface VerifyOtpModalProps {
  isOpen: boolean;
  onClose: () => void;
  phone: string;
}

const VerifyOtpModal = ({ isOpen, onClose, phone }: VerifyOtpModalProps) => {
  const [otp, setOtp] = useState<string>("");
  const [error, setError] = useState("");
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const { verify, loading } = useVerifyOtp();
  const { open } = useModalStore();
  const { resendOtp, loading: resendLoading } = useResendOtp();
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(() => inputsRef.current[0]?.focus(), 300);
    } else {
      document.body.style.overflow = "";
    }
  }, [isOpen]);

  useEffect(() => {
  if (isOpen) {
    const timer = setTimeout(() => {
      const firstInput = document.querySelector<HTMLInputElement>(
        ".otp-input input"
      );
      firstInput?.focus();
    }, 100);

    return () => clearTimeout(timer);
  }
}, [isOpen]);

  const handleOtpChange = (otp: string) => {
    setOtp(otp);
    setError("");
  };

  useEffect(() => {
    if (isOpen) {
      setOtp("");
      setError("");
    }
  }, [isOpen, phone]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 4) {
      setError("Enter valid 4-digit OTP");
      return;
    }

    // REMOVE COUNTRY CODE (+91, +1, etc)
    const cleanPhone = phone.replace(/^(\+91|\+1|\+44|\+61|\+971)/, "");

    try {
      // API CALL
      const response = await verify(cleanPhone, otp);
      if (response.msgCode == "1") {
        console.log("OTP VERIFY SUCCESS:", response);
      } else {
        console.log("Invalid OTP. Please try again.");
        setError("Invalid OTP. Please try again.");
      }
    } catch (err) {
      setError("Invalid OTP. Please try again.");
    }
  };

  const maskedPhone = `${phone.slice(0, 3)}******${phone.slice(-4)}`;

  const handleResendOtp = async () => {
    try {
      const cleanPhone = phone.replace(/^(\+91|\+1|\+44|\+61|\+971)/, "");

      await resendOtp(cleanPhone);

      setOtp("");
      setError("");
      startTimer();
      // setCanResend(false);
    } catch (e) {
      setError("Unable to resend OTP");
    }
  };

  const startTimer = () => {
    setTimer(30);
    setCanResend(false);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    if (isOpen) {
      startTimer();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isOpen, phone]);

  // useEffect(() => {
  //   if (!isOpen) return;

  //   setTimer(30);
  //   setCanResend(false);

  //   const interval = setInterval(() => {
  //     setTimer((prev) => {
  //       if (prev <= 1) {
  //         clearInterval(interval);
  //         setCanResend(true);
  //         return 0;
  //       }
  //       return prev - 1;
  //     });
  //   }, 1000);

  //   return () => clearInterval(interval);
  // }, [isOpen, phone]);

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
          transform transition-transform duration-500 ease-in-out
          ${isOpen ? "translate-y-0" : "translate-y-full"}
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
          <button
            onClick={() => open("login")}
            title="Change Mobile?"
            className="absolute left-5 top-5 text-gray-400"
          >
            <ArrowLeft size={20} />
          </button>

          {/* Welcome */}
          <h2 className="text-center text-[#1160A5] font-semibold text-2xl mb-6">
            Welcome to MDRC!
          </h2>

          {/* Card */}
          <div className="bg-white rounded-2xl shadow-lg px-6 py-7">
            <h3 className="text-base font-semibold mb-1">Verify OTP</h3>
            <p className="text-sm text-gray-500 mb-4">
              Please enter 4-Digit (OTP)
            </p>

            {/* Illustration */}
            <img
              src="/assets/images/modals/notification.svg"
              alt="OTP Verification"
              className="mx-auto w-28 my-4"
            />

            <p className="text-xs text-gray-500 text-center mb-5">
              Please enter verification code (OTP) sent to
              <br />
              <span className="font-medium text-gray-800">{maskedPhone}</span>
            </p>

            <form onSubmit={handleVerify} className="space-y-6">
              <OtpInput
                inputType="tel"
                value={otp}
                onChange={handleOtpChange}
                numInputs={4}
                shouldAutoFocus={true}
                renderInput={(props, index) => (
                  <input {...props} autoFocus={index === 0} />
                )}
                containerStyle="grid otp-input grid-cols-4 justify-center gap-3"
                inputStyle="!w-12 h-12 border rounded-lg text-center text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              {error && (
                <p className="text-red-500 text-xs text-center">{error}</p>
              )}

              {/* Countdown */}
              {/* <p className="text-xs text-gray-500 text-center">
                Get OTP again in <span className="font-medium">22</span> seconds
              </p> */}

              {!canResend ? (
                <p className="text-xs text-gray-500 text-center">
                  Get OTP again in <span className="font-medium">{timer}</span>{" "}
                  seconds
                </p>
              ) : (
                <button
                  type="button"
                  disabled={resendLoading}
                  onClick={handleResendOtp}
                  className="text-sm font-medium text-[#05AF79] text-center w-full"
                >
                  {resendLoading ? "Sending..." : "Resend OTP"}
                </button>
              )}

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
            <p className="text-xs text-gray-500 text-center mt-7 leading-relaxed">
              By proceeding, you agree with{" "}
              <span className="text-[#05AF79] font-medium">
                <Link href="">Terms and Condition</Link> &
                <Link href=""> Privacy Policy</Link>
              </span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default VerifyOtpModal;
