"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import requests from "@/lib/httpServices";

type AlertType = "error" | "success" | null;

const Report = () => {
  const [visitId, setVisitId] = useState("");
  const [password, setPassword] = useState("");
  const [alertType, setAlertType] = useState<AlertType>(null);
  const [alertMessage, setAlertMessage] = useState("");
  const [reportData, setReportData] = useState<any>(null);
  const [showReport, setShowReport] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckReport = async () => {
    setAlertType(null);
    setAlertMessage("");
    setShowReport(false);
    setReportData(null);

    if (!visitId.trim() || !password.trim()) {
      setAlertType("error");
      setAlertMessage("Please enter valid details.");
      return;
    }

    setIsLoading(true);

    try {
      const result = await requests.post("/webApi/index.php", {
        view: "download_report",
        visitor_id: visitId,
        lab_password: password,
      });

      if (result.msgCode === "1" && result.data) {
        setAlertType("success");
        setAlertMessage(result.message || "Please check report.");
        setReportData(result.data);
        setShowReport(true);
      } else {
        setAlertType("error");
        setAlertMessage(result.message || "Please enter valid details.");
      }
    } catch (error) {
      setAlertType("error");
      setAlertMessage("Failed to connect to the server. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadReport = () => {
    if (reportData?.download_url) {
      window.open(reportData.download_url, "_blank");
    }
  };

  const closeAlert = () => {
    setAlertType(null);
    setAlertMessage("");
  };

  // Helper to validate the URL
  const isValidUrl = (url: string) => {
    return url && url !== "" && url !== "#";
  };

  return (
    <div className="bg-white">
      {/* Header Section */}
      <div className="gradient-blue text-white px-6 py-8">
        <h1 className="text-2xl font-semibold mb-4 justify-self-center text-center">
          Download Report
        </h1>
        <p className="text-sm leading-relaxed mb-4">
          You can download your reports through the Visit ID and Password
          mentioned on your Booking Slip.
        </p>
      </div>

      {/* Form Section */}
      <div className="px-6 py-6">
        <h2 className="text-lg font-medium text-gray-800 mb-6">
          Enter Login Details
        </h2>

        <div className="mb-5">
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Lab/Visit ID
          </label>
          <input
            type="text"
            value={visitId}
            onChange={(e) => setVisitId(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#0a6baf] focus:border-transparent transition-all"
            placeholder="Enter Visit ID"
            disabled={isLoading}
          />
        </div>

        <div className="mb-5">
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#0B6CB5] focus:border-transparent transition-all"
            placeholder="Enter Password"
            disabled={isLoading}
          />
        </div>

        <button
          onClick={handleCheckReport}
          disabled={isLoading}
          className="w-full gradient-blue text-white py-3.5 rounded font-medium hover:bg-[#095a9a] transition-colors shadow-sm flex items-center justify-center disabled:opacity-70"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin mr-2" size={20} />
              Processing...
            </>
          ) : (
            "Check Report"
          )}
        </button>

        <div className="mt-3 border p-3 rounded-md border-gray-300">
          <a
            href="http://182.72.101.236/mdrcnew/design/onlinelab/"
            className="text-sm underline hover:text-gray-200 transition-colors"
          >
            Click Here : Download Reports (For Client Only)
          </a>
        </div>

        {alertType && (
          <div
            className={`mt-4 px-4 py-3 rounded-md flex items-center justify-between ${
              alertType === "error"
                ? "bg-red-50 border border-red-200"
                : "bg-green-50 border border-green-200"
            }`}
          >
            <span
              className={`text-sm ${
                alertType === "error" ? "text-red-700" : "text-green-700"
              }`}
            >
              {alertMessage}
            </span>
            <button
              onClick={closeAlert}
              className={`${
                alertType === "error" ? "text-red-700" : "text-green-700"
              } hover:opacity-70 transition-opacity`}
            >
              <X size={20} />
            </button>
          </div>
        )}

        {showReport && reportData && (
          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-800 mb-4">
              Test Information
            </h3>

            {/* Conditional Download Report Button */}
            {isValidUrl(reportData.download_url) && (
              <button
                onClick={handleDownloadReport}
                className="w-full gradient-blue text-white py-3.5 rounded-md font-medium hover:bg-[#095a9a] transition-colors shadow-sm mb-4"
              >
                Download Report
              </button>
            )}

            <div className="bg-white border border-gray-200 rounded overflow-hidden mb-6">
              <table className="w-full">
                <thead className="bg-white border-b border-gray-200">
                  <tr>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-gray-800">
                      Item / Package
                    </th>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-gray-800">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.tests?.map((test: any, index: number) => (
                    <tr
                      key={index}
                      className="border-b border-gray-200 last:border-b-0"
                    >
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {test.item_name}
                      </td>
                      <td className="px-4 py-3 text-sm text-green-600 font-medium">
                        {test.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-white border border-gray-200 rounded p-4 text-sm">
              <div className="mb-2">
                <span className="font-semibold text-gray-800">Patient</span>
                <div className="text-gray-700">{reportData.patient?.name}</div>
              </div>
              <div className="mb-2">
                <span className="font-semibold text-gray-800">Mobile</span>
                <div className="text-gray-700">
                  {reportData.patient?.mobile}
                </div>
              </div>
              <div>
                <span className="font-semibold text-gray-800">
                  Booking Date
                </span>
                <div className="text-gray-700">
                  {reportData.patient?.booking_date}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Report;
