"use client";
import { useEffect, useState, useRef } from "react";
import { Phone, Mail, MessageCircle } from "lucide-react";
import requests from "@/lib/httpServices";

const HelpPage = () => {
  const [helpData, setHelpData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Ref to track if API was called
  const hasCalledRef = useRef(false);

  const postHelpData = async () => {
    try {
      const payload = {
        view: "help",
      };

      const response = await requests.post("/webApi/index.php", payload);

      const helpScreen = response?.result?.helpScreen?.[0];
      setHelpData(helpScreen);
    } catch (err) {
      console.error("Error posting help data:", err);
      setError("Failed to load help data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check ref and call only once
    if (!hasCalledRef.current) {
      hasCalledRef.current = true;
      postHelpData();
    }
  }, []);

  if (loading) return <div className="text-center p-5">Loading...</div>;
  if (error) return <div className="text-center p-5">{error}</div>;

  return (
    <div className="mb-3 bg-white px-4 py-6 flex flex-col items-center">
      <div className="mb-6">
        <img
          src={helpData?.image || "/assets/images/request-call/call-center.png"}
          alt="Help & Support"
          className="w-56 mx-auto"
        />
      </div>

      <h2 className="text-lg font-semibold text-center leading-snug">
        {helpData?.title || "Our MDRC Experts Are Here"}
      </h2>
      <h3 className="text-center">{helpData?.description || "To Help You"}</h3>

      <div className="grid grid-cols-3 gap-3 mt-8 w-full max-w-sm">
        <a
          href={`tel:${helpData?.call} `}
          className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col items-center justify-center gap-2 shadow-sm active:scale-95 transition"
        >
          <div className="text-[#0A5C9E]">
            <Phone size={24} />
          </div>
          <span className="text-sm font-medium text-gray-800">Call Us</span>
        </a>

        <a
          href={`mailto:${helpData?.email}`}
          className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col items-center justify-center gap-2 shadow-sm active:scale-95 transition"
        >
          <div className="text-[#0A5C9E]">
            <Mail size={24} />
          </div>
          <span className="text-sm font-medium text-gray-800">Mail Us</span>
        </a>

        <a
          href={`https://wa.me/${helpData?.whatsapp}`}
          className="bg-white border border-gray-200 rounded-lg p-4
             flex flex-col items-center justify-center gap-2
             shadow-sm active:scale-95 transition"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="text-[#0A5C9E]">
            <MessageCircle size={24} />
          </div>
          <span className="text-sm font-medium text-gray-800">Chat</span>
        </a>
      </div>
    </div>
  );
};

export default HelpPage;
