"use client";
import { Pencil, Trash2, ChevronDown, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useFamilyMembers } from "@/hooks/useFamilyMembers"; // Import the custom hook
import FamilyService from "@/services/family.service";
import { useUser } from "@/context/userContext";
import { getDeviceType } from "@/utils/device";
import AccountMenu from "@/components/AccountMenu";

/* ===== Types ===== */
interface FamilyMember {
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
}

/* ===== Dummy Data ===== */
const familyDataInitial: FamilyMember[] = [
];

/* ===== Family Card ===== */
const FamilyCard = ({
  index,
  member,
  onEdit,
  onDelete,
}: {
  index: number;
  member: FamilyMember;
  onEdit: () => void;
  onDelete: () => void;
}) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden mb-5 border border-gray-100">
      <div className="bg-[#E7F7FE] px-5 py-3 border-b border-gray-100">
        <h3 className="text-xl font-bold text-[#444444]">
         {index+1}. {member.first_name} {member.last_name}
        </h3>
      </div>
      <div className="p-5 flex justify-between items-start">
        <div className="space-y-1">
          <p className="text-base text-gray-600 font-semibold">
            {member.relation}
          </p>
          <p className="text-sm text-gray-500 font-medium">
            {member.gender} • {member.age} yrs.
          </p>
          <p className="text-sm text-gray-600 leading-tight mt-1">
            {member.line1} , {member.area}
          </p>
          <p className="text-sm text-gray-400 font-bold mt-1">
            {member.pincode}
          </p>
        </div>
        <div className="flex flex-col items-end gap-4">
          <button
            onClick={onEdit}
            className="text-[#10B981] text-sm font-bold flex items-center gap-1"
          >
            <Pencil size={16} /> Edit
          </button>
          <button
            onClick={onDelete}
            className="text-red-500 p-1"
            aria-label="Delete member"
          >
            <Trash2 size={22} />
          </button>
        </div>
      </div>
    </div>
  );
};

/* ===== Modals ===== */
function BottomSheet({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full bg-white rounded-t-2xl shadow-xl max-h-[90vh] overflow-y-auto">
        {children}
      </div>
    </div>
  );
}

function ConfirmModal({
  open,
  title,
  description,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  title: string;
  description: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative w-full max-w-sm bg-white rounded-xl p-6 shadow-2xl">
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-600 mt-2">{description}</p>
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-semibold text-gray-600 border border-gray-300 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-md"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

/* ===== Main Component ===== */
export default function FamilyPage() {
  const [family, setFamily] = useState<FamilyMember[]>(familyDataInitial);
  const [formOpen, setFormOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [pincodeError, setPincodeError] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { user } = useUser();
  const [prefixList, setPrefixList] = useState([]);
  const [relationList, setRelationList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [filteredCityList, setFilteredCityList] = useState([]);

  const { members, refetch } = useFamilyMembers(); // Use the dynamic member listing

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const response = await FamilyService.getDropdownData();

        if (response?.msgCode === "1") {
          setPrefixList(response?.result?.prefix || []);
          setRelationList(response?.result?.relation || []);
          setCityList(response?.result?.cityList || []);
          setStateList(response?.result?.stateList || []);
          setFilteredCityList(response?.result?.cityList || []); // Initially show all cities
        } else {
          console.error("Error fetching dropdown data");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchDropdownData();
  }, []);

  // Handle state change and update form
  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedStateID = e.target.value;
    // Update form stateID to reflect the selected state
    setForm((prevForm) => {
      const updatedForm = { ...prevForm, stateID: selectedStateID };

      // Filter cities based on the selected state
      const filteredCities = cityList.filter(
        (city: any) => city.stateID === selectedStateID,
      );
      setFilteredCityList(filteredCities);

      // Log the updated state value after setForm update
      console.log("Updated form stateID:", updatedForm.stateID);

      // Return the updated form
      return updatedForm;
    });
  };

  // Add the delete function in your component
  const deleteMember = async (memberID: any) => {
    const selectedMember: any = members.find(
      (member) => member.memberID === memberID,
    );

    const memberData = {
      action: "memberDelete", // Action for deletion
      userID: user?.userID, // Send userID from context or another source
      deviceType: getDeviceType(), // Device type for the request
      userPhone: user?.userPhone, // User phone
      memberID: memberID, // Member ID to delete (dynamic value)
      first_name: selectedMember.first_name,
      last_name: selectedMember.last_name,
      relation: selectedMember.relation,
      pincode: selectedMember.pincode,
      cityID: selectedMember.cityID, // City ID (if applicable)
      stateID: selectedMember.stateID, // State ID (if applicable)
      dob: selectedMember.dob,
      gender: selectedMember.gender,
      prefix: selectedMember.prefix,
      phone1: selectedMember.phone1,
      line1: selectedMember.line1,
      area: selectedMember.area,
      view: "member_addedit",
    };
    try {
      // Make the API call to delete the member
      const response = await FamilyService.deleteMember(memberData);
      if (response?.msgCode === "1") {
        await refetch(); // Refetch the updated members list
      } else {
        console.error("Failed to delete member:", response?.msg);
      }
    } catch (err) {
      console.error("Error deleting member:", err);
    }
  };

  // Call the delete function when the delete button is clicked
  const onDeleteMember = (memberID: number) => {
    setDeleteId(memberID);
    setConfirmOpen(true); // Open the confirm modal
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCityID = e.target.value;
    setForm({ ...form, cityID: selectedCityID });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!form.first_name.trim())
      newErrors.first_name = "First name is required";
    if (!form.last_name.trim()) newErrors.last_name = "Last name is required";
    if (!form.relation.trim()) newErrors.relation = "Relation is required";
    if (!form.line1.trim()) newErrors.line1 = "Address is required";

    if (!form.pincode.trim()) newErrors.pincode = "Pincode is required";
    else if (!/^\d+$/.test(form.pincode))
      newErrors.pincode = "Only numbers are allowed";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const emptyForm: FamilyMember = {
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
  };

  const [form, setForm] = useState<FamilyMember>(emptyForm);

  const inputClass =
    "w-full p-3 border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-0 transition";

  const openAdd = () => {
    setEditingId(null);
    setForm({ ...emptyForm, id: Date.now() });
    setFormOpen(true);
    setPincodeError("");
  };

  const openEdit = (m: FamilyMember) => {
    setEditingId(m.id);
    setForm(m);
    setFormOpen(true);
    setPincodeError("");
  };

  const saveMember = async () => {
    if (!validateForm()) return; // Validate form fields
    const memberData = {
      view: "member_addedit",
      action: "memberAddEdit",
      userID: user?.userID,
      deviceType: getDeviceType(),
      userPhone: user?.userPhone,
      first_name: form.first_name,
      last_name: form.last_name,
      relation: form.relation,
      // address: form.address,
      pincode: form.pincode,
      cityID: form.cityID, // Assuming cityID is part of the form
      stateID: form.stateID, // Assuming stateID is part of the form
      memberID: form.memberID ? form.memberID : 0, // memberID is present for edit only
      dob: form.dob,
      gender: form.gender,
      prefix: form.prefix,
      phone1: form.phone1,
      line1: form.line1,
      area: form.area,
      // Other dynamic fields from your form, like age, gender, etc.
    };

    try {
      const response =
        await FamilyService[editingId ? "editMember" : "addMember"](memberData);
      if (response?.msgCode === "1") {
        // Handle success - Update the state with the new/edited member list
        if (editingId) {
          setFamily((prev) => prev.map((m) => (m.id === editingId ? form : m))); // Edit existing member
        } else {
          setFamily((prev) => [form, ...prev]); // Add new member
        }
        await refetch(); // Refetch the updated members from the API
        // fetchDropdownData();
        setFormOpen(false);
      } else {
        console.error("Error:", response?.msg || "Failed to save member");
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return (
    <div className="w-full bg-gray-50 p-4 pb-10">
      {/* Profile */}
      {/* User Profile Card */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
        <div className="bg-gradient-to-b from-[#005C96] to-[#15AEE5] text-white p-6 min-h-[160px] flex flex-col justify-center">
          <div className="flex items-center gap-5">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
              {user?.userImage ? (
                <img
                  src={user?.userImage}
                  alt="User Avatar"
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <span className="text-5xl font-bold text-gray-700">
                  {user?.name?.charAt(0)}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <div>
                <h1 className="text-xl font-semibold leading-none">
                  {user?.userFirstName} {user?.userLastName}
                </h1>

                {user?.userEmail && <p className="mt-1">{user?.userEmail}</p>}

                {user?.userPhone && (
                  <p className="font-semibold">
                    <span className="font-normal">Phone:</span> +91{" "}
                    {user?.userPhone}
                  </p>
                )}
              </div>

              <div className="mt-1">
                <a href="/account/profile">
                  <button className="border-2 border-white px-5 py-1.5 rounded-md font-semibold text-xs tracking-widest uppercase">
                    EDIT INFO
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>

        <AccountMenu />
      </div>

      {/* Header */}
      <div className="bg-[#1160A5] text-white py-4 px-6 rounded-2xl mb-6">
        <h2 className="text-xl font-semibold text-center">
          My Family & Friends
        </h2>
        <div className="flex justify-center mt-4">
          <button
            onClick={openAdd}
            className="bg-[#05AF79] text-white py-3 px-10 rounded-2xl"
          >
            Add More Member
          </button>
        </div>
      </div>

      {/* Cards */}
      {members.map((member, index) => (
        <FamilyCard
          key={member.memberID}
          index={index}
          member={member}
          onEdit={() => openEdit(member)}
          onDelete={() => onDeleteMember(member.memberID)} // Pass the memberID to onDeleteMember
        />
      ))}

      {/* Bottom Sheet */}
      <BottomSheet open={formOpen} onClose={() => setFormOpen(false)}>
        <div className="p-5 pb-24">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-800">
              {editingId ? "Edit Member" : "Add New Member"}
            </h3>
            <button onClick={() => setFormOpen(false)}>
              <X size={24} />
            </button>
          </div>

          <div className="space-y-4">
            <select
              className={inputClass}
              value={form.prefix}
              onChange={(e) => setForm({ ...form, prefix: e.target.value })}
            >
              <option value="">Select Prefix</option>
              {prefixList.map((prefix: any) => (
                <option key={prefix.ID} value={prefix.ID}>
                  {prefix.name}
                </option>
              ))}
            </select>

            {/* First Name */}
            <input
              className={inputClass}
              placeholder="First Name *"
              value={form.first_name}
              onChange={(e) => {
                setForm({ ...form, first_name: e.target.value });
                setErrors((prev) => ({ ...prev, first_name: "" }));
              }}
            />
            {errors.first_name && (
              <p className="text-red-500 text-xs">{errors.first_name}</p>
            )}

            {/* Last Name */}
            <input
              className={inputClass}
              placeholder="Last Name *"
              value={form.last_name}
              onChange={(e) => {
                setForm({ ...form, last_name: e.target.value });
                setErrors((prev) => ({ ...prev, last_name: "" }));
              }}
            />
            {errors.last_name && (
              <p className="text-red-500 text-xs">{errors.last_name}</p>
            )}

            <input
              className={inputClass}
              placeholder="Area"
              value={form.area}
              onChange={(e) => setForm({ ...form, area: e.target.value })}
            />

            {/* DOB (Date picker) */}
            <input
              type="date"
              className={inputClass}
              value={form.dob}
              onChange={(e) => setForm({ ...form, dob: e.target.value })}
            />

            {/* Gender (Radio buttons) */}
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="Male"
                  checked={form.gender === "Male"}
                  onChange={() => setForm({ ...form, gender: "Male" })}
                />
                Male
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="Female"
                  checked={form.gender === "Female"}
                  onChange={() => setForm({ ...form, gender: "Female" })}
                />
                Female
              </label>
            </div>

            <select
              className={inputClass}
              value={form.relation}
              onChange={(e) => setForm({ ...form, relation: e.target.value })}
            >
              <option value="">Select Relation</option>
              {relationList.map((relation: any) => (
                <option key={relation.ID} value={relation.ID}>
                  {relation.name}
                </option>
              ))}
            </select>

            <select
              className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-0 transition"
              value={form.stateID} // Ensure this is bound to form.stateID
              onChange={(e) => {
                handleStateChange(e); // Handle state change to filter cities
              }}
            >
              <option value="">Select State</option>
              {stateList.map((state: any) => (
                <option key={state.ID} value={state.ID}>
                  {state.name}
                </option>
              ))}
            </select>

            {/* City Dropdown (Cascading) */}
            <select
              className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-0 transition"
              value={form.cityID}
              onChange={handleCityChange} // Handle city selection
              disabled={!form.stateID} // Disable if no state is selected
            >
              <option value="">Select City</option>
              {filteredCityList.map((city: any) => (
                <option key={city.ID} value={city.ID}>
                  {city.name}
                </option>
              ))}
            </select>

            {/* Address */}
            <textarea
              className={inputClass}
              placeholder="Address *"
              value={form.line1}
              onChange={(e) => {
                setForm({ ...form, line1: e.target.value });
                setErrors((prev) => ({ ...prev, address: "" }));
              }}
            />
            {errors.line1 && (
              <p className="text-red-500 text-xs">{errors.line1}</p>
            )}

            {/* Phone Number */}
            <input
              type="tel"
              className={inputClass}
              placeholder="Phone Number"
              value={form.phone1} // Bind value to form.phone1
              onChange={(e) => setForm({ ...form, phone1: e.target.value })} // Update form.phone1
            />

            {/* Pincode */}
            <input
              className={inputClass}
              placeholder="Pincode *"
              inputMode="numeric"
              value={form.pincode}
              onChange={(e) => {
                const value = e.target.value;
                setForm({ ...form, pincode: value });

                if (!value.trim())
                  setErrors((prev) => ({
                    ...prev,
                    pincode: "Pincode is required",
                  }));
                else if (!/^\d+$/.test(value))
                  setErrors((prev) => ({
                    ...prev,
                    pincode: "Only numbers are allowed",
                  }));
                else setErrors((prev) => ({ ...prev, pincode: "" }));
              }}
            />
            {errors.pincode && (
              <p className="text-red-500 text-xs">{errors.pincode}</p>
            )}
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-white pt-4 pb-2 border-t flex gap-3 mt-6">
            <button
              onClick={() => setFormOpen(false)}
              className="flex-1 py-3 font-bold text-gray-600 border rounded-xl"
            >
              Cancel
            </button>
            <button
              onClick={saveMember}
              className="flex-1 py-3 font-bold text-white bg-[#1A8CCF] rounded-xl"
            >
              Save
            </button>
          </div>
        </div>
      </BottomSheet>
      {/* Confirm */}

      <ConfirmModal
        open={confirmOpen}
        title="Delete member?"
        description="Are you sure you want to delete this member?"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => {
          deleteMember(deleteId); // Pass the member ID to the delete function
          setConfirmOpen(false); // Close the confirm modal
        }}
      />
    </div>
  );
}
