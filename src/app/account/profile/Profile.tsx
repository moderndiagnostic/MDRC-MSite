"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Smartphone, User, Mail, Camera } from "lucide-react";
import { updateUserProfile } from "@/services/auth.service";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/userContext";
import { toast } from "react-toastify";

export default function ProfileEditPage() {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();
  const { user, setUser } = useUser();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
  });

  // photoPreview = string for <img> tag | photoFile = binary for API
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setForm({
      firstName: user?.userFirstName || "",
      lastName: user?.userLastName || "",
      phone: user?.userPhone || "",
      email: user?.userEmail || "",
    });
    if (user?.userImage) setPhotoPreview(user.userImage);
  }, []);

  const validate = () => {
    const err: Record<string, string> = {};
    if (!form.firstName.trim()) err.firstName = "First name is required";
    if (!form.lastName.trim()) err.lastName = "Last name is required";
    if (!/^[6-9]\d{9}$/.test(form.phone))
      err.phone = "Enter valid 10 digit mobile number";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) err.email = "Enter valid email";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);

    try {
      const payload = {
        userFirstName: form.firstName,
        userLastName: form.lastName,
        userPhone: form.phone,
        userEmail: form.email,
        userID: user.userID,
        photo: photoFile, // This is the binary file
      };

      const response = await updateUserProfile(payload);

      if (response?.msgCode === "0") {
        toast.error(response?.message || "Something went wrong");
        return;
      }

      if (response?.msgCode === "1") {
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

        // Update cookie for middleware/SSR
        document.cookie = `auth_user=${encodeURIComponent(JSON.stringify(userData))}; path=/`;

        router.push("/account");
      }
    } catch (error) {
      console.error("Update failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-white px-4 py-3 shadow-sm flex items-center gap-3">
        <h1 className="text-lg font-semibold">My Profile</h1>
      </div>

      <div className="max-w-md mx-auto px-4 mt-6 space-y-4">
        <Input
          icon={<User size={16} />}
          placeholder="First Name*"
          value={form.firstName}
          error={errors.firstName}
          onChange={(v: any) => setForm({ ...form, firstName: v })}
        />

        <Input
          icon={<User size={16} />}
          placeholder="Last Name*"
          value={form.lastName}
          error={errors.lastName}
          onChange={(v: any) => setForm({ ...form, lastName: v })}
        />

        <Input
          icon={<Smartphone size={16} />}
          placeholder="Mobile No.*"
          value={form.phone}
          disabled
          error={errors.phone}
          onChange={(v: any) => setForm({ ...form, phone: v })}
        />

        <Input
          icon={<Mail size={16} />}
          placeholder="Email"
          value={form.email}
          error={errors.email}
          onChange={(v: any) => setForm({ ...form, email: v })}
        />

        {/* Image Upload Section */}
        <div>
          <div
            onClick={() => fileRef.current?.click()}
            className={`flex items-center gap-2 border rounded-lg px-3 py-3 cursor-pointer bg-white
              ${errors.photo ? "border-red-500" : "border-gray-300"}`}
          >
            {photoPreview ? (
              <div className="h-6 w-6 relative">
                <Image
                  src={photoPreview}
                  alt="Profile"
                  fill
                  className="rounded-full object-cover"
                />
              </div>
            ) : (
              <Camera size={16} className="text-gray-400" />
            )}

            <span className="text-sm text-gray-500 flex-1">
              {photoPreview ? "Change Profile Photo" : "Upload Profile Photo"}
            </span>
          </div>

          <input
            ref={fileRef}
            type="file"
            hidden
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setPhotoFile(file); // Binary for API
                setPhotoPreview(URL.createObjectURL(file)); // String for Preview
              }
            }}
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full gradient-blue text-white py-2.5 rounded-full flex items-center justify-center gap-2 mt-4 disabled:opacity-70"
        >
          {loading ? "Saving..." : "Save Details"}
        </button>
      </div>
    </div>
  );
}

// Reusable Input Component
function Input({ icon, value, placeholder, error, disabled, onChange }: any) {
  return (
    <div>
      <div
        className={`flex items-center gap-2 border rounded-lg px-3 py-3 ${error ? "border-red-500" : "border-gray-300"} ${disabled ? "bg-gray-100" : "bg-white"}`}
      >
        <span className="text-gray-400">{icon}</span>
        <input
          type="text"
          value={value}
          disabled={disabled}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="w-full outline-none text-sm bg-transparent"
        />
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
