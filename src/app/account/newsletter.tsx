import { useState } from "react";
import { toast } from "react-toastify";
import requests from "@/lib/httpServices";

const NewsLetter = () => {
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailSubmit = async () => {
    if (!email) {
      setErrorMessage("Please enter an email address.");
      toast.error("Please enter an email address.");
      return;
    }

    if (!validateEmail(email)) {
      setErrorMessage("Please enter a valid email address.");
      toast.error("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const payload = {
        view: "newsletter",
        email: email,
      };

      const response = await requests.post("/webApi/index.php", payload);

      if (response?.msgCode === "1") {
        toast.success(response?.message || "You have successfully subscribed!");
        setEmail("");
      } else {
        toast.error(
          response?.message || "Failed to subscribe. Please try again.",
        );
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#1160A5] rounded-t-none px-6 py-8 text-center mt-6">
      <h2 className="text-white text-[20px] font-bold mb-6 leading-tight">
        Subscribe for MDRC Updates
      </h2>

      <div className="space-y-4 max-w-md mx-auto">
        <div className="relative">
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
            <img src="/assets/images/ipo/mail_logo.svg" alt="Mail Logo" />
          </div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email ID"
            className="w-full bg-white pl-12 pr-4 py-3.5 rounded-full border-0 focus:outline-none focus:ring-2 focus:ring-gray-500 text-sm text-gray-700 placeholder-gray-400"
          />
        </div>

        <button
          onClick={handleEmailSubmit}
          disabled={loading}
          className="w-full bg-gradient-to-r from-[#05AF79] to-[#0ECE91] text-white py-3.5 rounded-full font-semibold hover:bg-[#059669] transition-colors text-[15px] shadow-md"
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </div>
    </div>
  );
};

export default NewsLetter;
