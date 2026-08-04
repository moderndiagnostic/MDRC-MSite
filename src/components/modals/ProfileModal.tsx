"use client";

import { useUser } from "@/context/userContext";
import { updateUserProfile } from "@/services/auth.service";
import { X } from "lucide-react";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  phone: string;
}

const ProfileModal = ({ isOpen, onClose, phone }: ProfileModalProps) => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      setErrors({});
      if (phone) {
        setForm((prev) => ({ ...prev, phone }));
      }
    }
  }, [isOpen]);

  const { user, setUser } = useUser();
  const router = useRouter();

  const setAuthCookie = (user: any) => {
    Cookies.set("auth_user", JSON.stringify(user), {
      path: "/",
      expires: 7,
      sameSite: "lax",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: typeof errors = {};

    if (!form.firstName.trim()) newErrors.firstName = "First name is required";
    if (!form.lastName.trim()) newErrors.lastName = "Last name is required";
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) {
      newErrors.email = "Enter valid email";
    }

    if (!/^[6-9]\d{9}$/.test(form.phone))
      newErrors.phone = "Enter valid 10 digit mobile number";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const payload = {
      userFirstName: form.firstName,
      userLastName: form.lastName,
      userPhone: form.phone,
      userEmail: form.email,
      // photo: "",
      userID: user?.userID,
    };

    try {
      const response = await updateUserProfile(payload);

      if (response.msgCode === "1") {
        const customer = response.result.customer;
        const userData = {
          userID: customer.userID,
          userPhone: customer.userPhone,
          userFirstName: customer.userFirstName,
          userLastName: customer.userLastName,
          userEmail: customer.userEmail,
          userImage: customer.userImage,
        };

        setUser(userData);

        localStorage.setItem("auth_user", JSON.stringify(userData));
        setAuthCookie(userData);
        onClose();
        router.replace("/account");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`
          fixed inset-0 z-40 bg-black/40 transition-opacity duration-300
          ${isOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}
        `}
      />

      {/* Right Drawer */}
      <div
        className={`
          fixed bottom-0 z-50 h-screen rounded-t-2xl pt-5 px-3
          bg-white w-full
          transform transition-transform duration-500 ease-in-out
          ${/* FIX: Changed top-30 to top-28 or just rely on bottom-0/h-screen */ ""}
          ${/* FIX: Added 'invisible' to base when closed so it doesn't block clicks */ ""}
          ${isOpen ? "translate-y-0 visible" : "translate-y-full invisible"}
        `}
        // Added style to ensure it sits above everything correctly
        style={{
          top: "7.5rem" /* equivalent to top-30 if you have custom config, otherwise use standard top-32 */,
        }}
      >
        <div className="relative h-full overflow-y-auto p-4">
          <button
            onClick={onClose}
            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>

          <h3 className="text-2xl font-semibold mb-1">Profile</h3>
          <p className="text-sm text-gray-600 mb-4">
            Please Enter Your details
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-gray-600">First Name*</label>
              <input
                value={form.firstName}
                onChange={(e) =>
                  setForm({ ...form, firstName: e.target.value })
                }
                className={`w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-green-500 ${
                  errors.firstName ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.firstName && (
                <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
              )}
            </div>

            <div>
              <label className="text-sm text-gray-600">Last Name*</label>
              <input
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                className={`w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-green-500 ${
                  errors.lastName ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.lastName && (
                <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
              )}
            </div>

            <div>
              <label className="text-sm text-gray-600">Email</label>
              <input
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={`w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-green-500 ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="text-sm text-gray-600">Mobile No.*</label>
              <input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                disabled={!!phone}
                className={`w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-green-500 ${
                  errors.phone ? "border-red-500" : "border-gray-300"
                } ${!!phone ? "cursor-not-allowed" : ""}`}
              />
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full mt-5 bg-gradient-to-r from-green-600 to-green-500 text-white py-3 rounded-md font-medium hover:opacity-90 transition-opacity"
            >
              Save Details
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ProfileModal;
