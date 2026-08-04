"use client";

import { useEffect, useState } from "react";
import paymentService from "@/services/paymentService";
import { toast } from "react-toastify";

export default function PayNow() {
  const [form, setForm] = useState({
    firstName: "",
    email: "",
    phone: "",
    amount: "",
    message: "",
  });

  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors: any = {};

    if (!form.firstName) newErrors.firstName = "Name is required";
    if (!form.email) newErrors.email = "Email is required";
    if (!form.phone) newErrors.phone = "Phone is required";
    if (!form.amount) newErrors.amount = "Amount is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);

      const payload = {
        view: "pay_now",
        pay_name: form.firstName,
        pay_email: form.email,
        pay_phone: form.phone,
        pay_amount: form.amount,
        pay_message: form.message,
      };

      const response = await paymentService.payNow(payload);

      if (response?.message === "success" && response?.msgCode === "1") {
        if (response?.result?.url) {
          window.location.href = response?.result?.url;
          return;
        } else {
          toast.error("Payment URL not received");
        }
      } else {
        toast.error(response?.message || "Payment failed");
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-4 mb-6 mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-6 relative">
        <h2 className="text-2xl font-bold text-center text-gray-800 mt-3">
          Pay Now
        </h2>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter name"
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              className={`w-full px-3 py-3 bg-[#F6F6F6] rounded-lg text-sm focus:outline-none ${
                errors.firstName
                  ? "border border-red-500"
                  : "border-0 focus:ring-2 focus:ring-teal-500"
              }`}
            />
            {errors.firstName && (
              <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              placeholder="Enter email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className={`w-full px-3 py-3 bg-[#F6F6F6] rounded-lg text-sm focus:outline-none ${
                errors.email
                  ? "border border-red-500"
                  : "border-0 focus:ring-2 focus:ring-teal-500"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mobile <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              placeholder="Enter mobile number"
              value={form.phone}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                if (value.length <= 10) {
                  setForm({ ...form, phone: value });
                }
              }}
              className={`w-full px-3 py-3 bg-[#F6F6F6] rounded-lg text-sm focus:outline-none ${
                errors.phone
                  ? "border border-red-500"
                  : "border-0 focus:ring-2 focus:ring-teal-500"
              }`}
            />
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
            )}
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter amount"
              value={form.amount}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                setForm({ ...form, amount: value });
              }}
              className={`w-full px-3 py-3 bg-[#F6F6F6] rounded-lg text-sm focus:outline-none ${
                errors.amount
                  ? "border border-red-500"
                  : "border-0 focus:ring-2 focus:ring-teal-500"
              }`}
            />
            {errors.amount && (
              <p className="text-red-500 text-xs mt-1">{errors.amount}</p>
            )}
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message
            </label>
            <textarea
              placeholder="Enter message"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full px-3 py-3 bg-[#F6F6F6] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 text-white font-bold rounded-lg text-base transition-all ${
                loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#05AF79]"
              }`}
            >
              {loading ? "Processing..." : "Pay Now"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
