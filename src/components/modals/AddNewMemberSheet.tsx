// components/modals/AddNewMemberSheet.tsx
"use client";

import { X } from "lucide-react";
import BottomSheet from "../ui/BottomSheet";
import { useEffect, useId, useRef, useState } from "react";
import CartService from "@/services/cart.service";
import FamilyService from "@/services/family.service";
import { useUser } from "@/context/userContext";
import { getDeviceType } from "@/utils/device";
import { useFamilyMembers } from "@/hooks/useFamilyMembers";
import { toast } from "react-toastify";

export type MemberForm = {
  id: number;
  prefix?: string;
  first_name: string;
  last_name: string;
  relation: string;
  gender: "Male" | "Female";
  mobile?: string;
  dob?: string;
  age: number;
  line1: string;
  stateID?: string;
  cityID?: string;
  area?: string;
  pincode: string;
  memberID: number;
  phone1?: string; // Added phone1 field
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (form: MemberForm) => void;
  primaryColor?: string;
};

// const prefixOptions = ["Mr.", "Mrs.", "Ms.", "Dr."];
// const relationOptions = ["Self", "Spouse", "Son", "Daughter", "Father", "Mother", "Brother", "Sister"];
// const stateOptions = ["Haryana", "Delhi", "Uttar Pradesh", "Punjab", "Rajasthan"];
// const cityOptions = ["Gurugram", "Delhi", "Noida", "Faridabad", "Sonipat"];

export default function AddNewMemberSheet({
  open,
  onClose,
  onSave,
  primaryColor = "#0074c6",
}: Props) {
  const titleId = useId();
  const firstInputRef = useRef<HTMLInputElement>(null);

  const { refetch } = useFamilyMembers(); // Use the dynamic member listing

  const [form, setForm] = useState<MemberForm>({
    id: 0,
    prefix: "",
    first_name: "",
    last_name: "",
    relation: "",
    gender: "Male",
    mobile: "",
    dob: "",
    age: 0,
    line1: "",
    stateID: "",
    cityID: "",
    area: "",
    pincode: "",
    phone1: "", // Initialize phone1
    memberID: 0,
  });

  // const [stateOptions, setStateOptions] = useState([]);
  // const [cityOptions, setCityOptions] = useState([]);
  // const [relationOptions, setRelationOptions] = useState([]);

  // Dropdown data states
  const [prefixList, setPrefixList] = useState([]);
  const [relationList, setRelationList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [filteredCityList, setFilteredCityList] = useState([]);
  const [errors, setErrors] = useState<
    Partial<Record<keyof MemberForm, string>>
  >({});

  const { user } = useUser();

  // Fetch dropdown options dynamically when the modal is open
  useEffect(() => {
    if (open) {
      const fetchDropdownData = async () => {
        try {
          const response = await FamilyService.getDropdownData(); // Fetching dropdown data
          if (response?.msgCode === "1") {
            setPrefixList(response?.result?.prefix || []); // Populate prefix options
            setRelationList(response?.result?.relation || []); // Populate relation options
            setStateList(response?.result?.stateList || []); // Populate state options
            setCityList(response?.result?.cityList || []); // Populate city options
            setFilteredCityList(response?.result?.cityList || []); // Set initial filtered city list
          } else {
            console.error("Error fetching dropdown data");
          }
        } catch (error) {
          console.error("Error:", error);
        }
      };

      fetchDropdownData(); // Call the API on modal open
    }
  }, [open]);

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedState = e.target.value;
    setForm((prev) => ({ ...prev, stateID: selectedState }));

    // Filter cities based on selected state
    const filteredCities = cityList.filter(
      (city: any) => city.stateID === selectedState,
    );
    setFilteredCityList(filteredCities);
  };

  const onChange =
    (key: keyof MemberForm) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >,
    ) => {
      setForm((p) => ({ ...p, [key]: e.target.value }));
      setErrors((prev) => ({ ...prev, [key]: "" }));
    };
  const saveMember = async () => {
    const newErrors: Partial<Record<keyof MemberForm, string>> = {};

    if (!form.prefix) newErrors.prefix = "Prefix is required";
    if (!form.first_name) newErrors.first_name = "First name is required";
    if (!form.last_name) newErrors.last_name = "Last name is required";
    if (!form.relation) newErrors.relation = "Relation is required";
    if (!form.stateID) newErrors.stateID = "State is required";
    if (!form.cityID) newErrors.cityID = "City is required";
    if (!form.line1) newErrors.line1 = "Address is required";
    if (!form.area) newErrors.area = "Area is required";
    if (!form.pincode) newErrors.pincode = "Pincode is required";
    if (!form.gender) newErrors.gender = "Gender is required";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    // Prepare member data for API call
    const memberData = {
      view: "member_addedit",
      action: "memberAddEdit",
      userID: user?.userID,
      deviceType: getDeviceType(),
      userPhone: user?.userPhone,
      first_name: form.first_name,
      last_name: form.last_name,
      relation: form.relation,
      pincode: form.pincode,
      cityID: form.cityID,
      stateID: form.stateID,
      memberID: form.memberID ? form.memberID : 0, // memberID is present for edit only
      dob: form.dob,
      gender: form.gender,
      prefix: form.prefix,
      phone1: form.phone1,
      line1: form.line1,
      area: form.area,
    };

    try {
      const response =
        await FamilyService[form.memberID ? "editMember" : "addMember"](
          memberData,
        );
      if (response?.msgCode === "1") {
        toast.success("Member saved successfully.");
        onSave(form); // Call onSave with the form data
        onClose(); // Close the modal
        setErrors({}); // Clear errors
        setForm({
          id: 0,
          prefix: "",
          first_name: "",
          last_name: "",
          relation: "",
          gender: "Male",
          mobile: "",
          dob: "",
          age: 0,
          line1: "",
          stateID: "",
          cityID: "",
          area: "",
          pincode: "",
          phone1: "", // Reset phone1
          memberID: 0,
        });
        await refetch(); // Refetch the updated members list
      } else {
        console.error("Error:", response?.msg || "Failed to save member");
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const save = () => {
    saveMember();
  };

  useEffect(() => {
    if (open) {
      setErrors({}); // Clear errors when the modal opens
      setTimeout(() => {
        firstInputRef.current?.focus();
      }, 100);
    }
  }, [open]);

  // const save = () => {

  //   onSave(form);
  //   onClose();
  // };

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      titleId={titleId}
      maxHeightClassName="max-h-[90vh]"
    >
      {/* Header */}
      <div className="px-4 pt-3 pb-3 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <p id={titleId} className="text-base font-semibold text-gray-900">
            Add New Member {open}
          </p>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-2 rounded-xl hover:bg-gray-100 text-gray-700"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Form */}
      <div className="px-4 pt-4 pb-24 overflow-y-auto max-h-[calc(90vh-160px)] space-y-3">
        <div>
          <label className="text-xs text-gray-600 block mb-1">Prefix *</label>
          <select
            value={form.prefix}
            onChange={onChange("prefix")}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white"
          >
            <option value="">Select</option>
            {prefixList.map((prefix: any) => (
              <option key={prefix.ID} value={prefix.ID}>
                {prefix.name}
              </option>
            ))}
          </select>
          {errors.prefix && (
            <p className="text-red-500 text-xs mt-1">{errors.prefix}</p>
          )}
        </div>

        <div>
          <label className="text-xs text-gray-600 block mb-1">
            First Name *
          </label>
          <input
            ref={firstInputRef}
            value={form.first_name}
            onChange={onChange("first_name")}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          />
          {errors.first_name && (
            <p className="text-red-500 text-xs mt-1">{errors.first_name}</p>
          )}
        </div>

        <div>
          <label className="text-xs text-gray-600 block mb-1">
            Last Name *
          </label>
          <input
            value={form.last_name}
            onChange={onChange("last_name")}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          />

          {errors.last_name && (
            <p className="text-red-500 text-xs mt-1">{errors.last_name}</p>
          )}
        </div>

        <div>
          <label className="text-xs text-gray-600 block mb-1">Gender *</label>
          <div className="flex items-center gap-6 mt-1">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="radio"
                checked={form.gender === "Male"}
                onChange={() => setForm((p) => ({ ...p, gender: "Male" }))}
                style={{ accentColor: primaryColor }}
              />
              Male
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="radio"
                checked={form.gender === "Female"}
                onChange={() => setForm((p) => ({ ...p, gender: "Female" }))}
                style={{ accentColor: primaryColor }}
              />
              Female
            </label>
          </div>
          {errors.gender && (
            <p className="text-red-500 text-xs mt-1">{errors.gender}</p>
          )}
        </div>

        <div>
          <label className="text-xs text-gray-600 block mb-1">
            Mobile Number
          </label>
          <input
            value={form.phone1}
            onChange={onChange("phone1")}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            inputMode="numeric"
          />
        </div>

        <div>
          <label className="text-xs text-gray-600 block mb-1">
            Date Of Birth
          </label>
          <input
            type="date"
            value={form.dob}
            onChange={onChange("dob")}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          />
        </div>

        {/* Relation Dropdown */}
        <div>
          <label className="text-xs text-gray-600 block mb-1">Relation *</label>
          <select
            value={form.relation}
            onChange={onChange("relation")}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white"
          >
            <option value="">Select</option>
            {relationList.map((relation: any) => (
              <option key={relation.ID} value={relation.ID}>
                {relation.name}
              </option>
            ))}
          </select>
          {errors.relation && (
            <p className="text-red-500 text-xs mt-1">{errors.relation}</p>
          )}
        </div>

        <div>
          <label className="text-xs text-gray-600 block mb-1">
            Address (Area and Street) *
          </label>
          <textarea
            value={form.line1}
            onChange={onChange("line1")}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm min-h-[64px]"
          />
          {errors.line1 && (
            <p className="text-red-500 text-xs mt-1">{errors.line1}</p>
          )}
        </div>

        {/* State Dropdown */}
        <div>
          <label className="text-xs text-gray-600 block mb-1">State *</label>
          <select
            value={form.stateID}
            onChange={handleStateChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white"
          >
            <option value="">Select</option>
            {stateList.map((state: any) => (
              <option key={state.ID} value={state.ID}>
                {state.name}
              </option>
            ))}
          </select>
          {errors.stateID && (
            <p className="text-red-500 text-xs mt-1">{errors.stateID}</p>
          )}
        </div>

        {/* City Dropdown (filtered by State) */}
        <div>
          <label className="text-xs text-gray-600 block mb-1">City *</label>
          <select
            value={form.cityID}
            onChange={onChange("cityID")}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white"
            disabled={!form.stateID}
          >
            <option value="">Select</option>
            {filteredCityList.map((city: any) => (
              <option key={city.ID} value={city.ID}>
                {city.name}
              </option>
            ))}
          </select>
          {errors.cityID && (
            <p className="text-red-500 text-xs mt-1">{errors.cityID}</p>
          )}
        </div>

        <div>
          <label className="text-xs text-gray-600 block mb-1">Area *</label>
          <input
            value={form.area}
            onChange={onChange("area")}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          />
          {errors.area && (
            <p className="text-red-500 text-xs mt-1">{errors.area}</p>
          )}
        </div>

        <div>
          <label className="text-xs text-gray-600 block mb-1">Pincode *</label>
          <input
            value={form.pincode}
            onChange={onChange("pincode")}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            inputMode="numeric"
          />
          {errors.pincode && (
            <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>
          )}
        </div>
      </div>

      {/* Sticky actions */}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="flex gap-2 justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-md border border-gray-300 text-gray-700 text-sm"
          >
            Cancel
          </button>
          <button
            onClick={save}
            className="px-6  gradient-blue py-2 rounded-md text-white text-sm font-semibold"
          >
            Save
          </button>
        </div>
      </div>
    </BottomSheet>
  );
}
