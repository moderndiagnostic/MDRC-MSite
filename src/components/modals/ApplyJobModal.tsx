import { useCity } from "@/context/CityContext";
import { useUser } from "@/context/userContext";
import requests from "@/lib/httpServices";
import { X } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

interface ApplyJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobTitle: string;
}

interface FormErrors {
  fullName?: string;
  phone?: string;
  email?: string;
  noticePeriod?: string;
  designation?: string;
  organization?: string;
  experience?: string;
  address?: string;
  resume?: string;
}

const ApplyJobModal = ({ isOpen, onClose, jobTitle }: ApplyJobModalProps) => {
  const { user } = useUser();
  const { cityDetails } = useCity();

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    noticePeriod: "",
    designation: "",
    organization: "",
    experience: "",
    address: "",
    resume: null as File | null,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const getInputClass = (field: keyof FormErrors) =>
    `w-full rounded-md px-3 py-2 border ${
      errors[field] ? "border-red-500" : "border-gray-400"
    } focus:outline-none focus:ring-1 ${
      errors[field] ? "focus:ring-red-500" : "focus:ring-blue-500"
    }`;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    // 🔹 Only numbers allowed for noticePeriod & experience
    if (
      (name === "noticePeriod" || name === "experience") &&
      !/^\d*$/.test(value)
    ) {
      setErrors((prev) => ({
        ...prev,
        [name]: "Only numbers are allowed",
      }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        resume: "Only PDF, DOC, DOCX files are allowed",
      }));
      return;
    }

    setFormData((prev) => ({ ...prev, resume: file }));
    setErrors((prev) => ({ ...prev, resume: "" }));
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";

    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    else if (!/^[0-9]{10}$/.test(formData.phone))
      newErrors.phone = "Enter valid 10 digit phone number";

    if (!formData.email.trim()) newErrors.email = "Email address is required";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email))
      newErrors.email = "Enter valid email address";

    if (!formData.noticePeriod.trim())
      newErrors.noticePeriod = "Notice period is required";
    else if (!/^\d+$/.test(formData.noticePeriod))
      newErrors.noticePeriod = "Only numbers are allowed";

    if (!formData.designation.trim())
      newErrors.designation = "Designation is required";

    if (!formData.organization.trim())
      newErrors.organization = "Organization is required";

    if (!formData.experience.trim())
      newErrors.experience = "Experience is required";
    else if (!/^\d+$/.test(formData.experience))
      newErrors.experience = "Only numbers are allowed";

    if (!formData.address.trim()) newErrors.address = "Address is required";

    if (!formData.resume) newErrors.resume = "Resume upload is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (!validate()) return;

  //   const payload = {
  //     jobTitle,
  //     ...formData,
  //     resumeName: formData.resume?.name,
  //   };
  //   onClose();
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);

      const formPayload = new FormData();
      formPayload.append("view", "career");
      formPayload.append("userID", user?.userID?.toString() || "");
      formPayload.append("cityID", cityDetails?.id?.toString() || "");
      formPayload.append("name", formData.fullName);
      formPayload.append("email", formData.email);
      formPayload.append("phone", formData.phone);
      formPayload.append("notice_period", formData.noticePeriod);
      formPayload.append("designation", formData.designation);
      formPayload.append("current_organization", formData.organization);
      formPayload.append("experience", formData.experience);
      formPayload.append("address", formData.address);
      formPayload.append("job_title", jobTitle);

      if (formData.resume) {
        formPayload.append("cv_file1", formData.resume);
      }

      const response = await requests.post("/webApi/index.php", formPayload);

      const result = response;
      if (result?.msgCode === "1") {
        toast.success("Application submitted successfully!");
        setFormData({
          fullName: "",
          phone: "",
          email: "",
          noticePeriod: "",
          designation: "",
          organization: "",
          experience: "",
          address: "",
          resume: null,
        });

        setErrors({});
        onClose();
      } else {
        toast.error(result?.message || "Something went wrong");
      }
    } catch (error) {
      toast.error("Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/40 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-[90vw] max-h-full overflow-y-auto rounded-lg shadow-lg ">
        {/* Header */}
        <div className="flex justify-between items-center px-4 py-3 border-b">
          <h3 className="font-semibold text-lg">Work with us</h3>
          <button onClick={onClose}>
            <X className="text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {[
              { name: "fullName", placeholder: "Your Full Name*" },
              { name: "phone", placeholder: "Phone Number*" },
              { name: "email", placeholder: "Your Email Address*" },
              {
                name: "noticePeriod",
                placeholder: "Notice Period (in Months)*",
              },
              { name: "designation", placeholder: "Current Designation*" },
              { name: "organization", placeholder: "Current Organization*" },
              {
                name: "experience",
                placeholder: "Total Experience (in Years)*",
              },
            ].map((field) => (
              <div key={field.name}>
                <input
                  name={field.name}
                  placeholder={field.placeholder}
                  onChange={handleChange}
                  className={getInputClass(field.name as keyof FormErrors)}
                  inputMode={
                    field.name === "noticePeriod" || field.name === "experience"
                      ? "numeric"
                      : undefined
                  }
                />
                {errors[field.name as keyof FormErrors] && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors[field.name as keyof FormErrors]}
                  </p>
                )}
              </div>
            ))}

            <div>
              <textarea
                name="address"
                placeholder="Address*"
                onChange={handleChange}
                className={`${getInputClass("address")} h-24`}
              />
              {errors.address && (
                <p className="text-red-500 text-xs mt-1">{errors.address}</p>
              )}
            </div>
          </div>

          {/* File Upload */}
          <div>
            <label
              className={`block w-full rounded px-3 py-2 cursor-pointer ${
                errors.resume
                  ? "border border-red-500"
                  : "border border-gray-400"
              } text-gray-500`}
            >
              {formData.resume?.name || "Upload CV (Doc, Docx, PDF)"}
              <input
                type="file"
                accept=".doc,.docx,.pdf"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
            {errors.resume && (
              <p className="text-red-500 text-xs mt-1">{errors.resume}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-700 to-sky-500 text-white py-3 rounded-full font-medium"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ApplyJobModal;
