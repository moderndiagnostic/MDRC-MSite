"use client";

import { X } from "lucide-react";
import BottomSheet from "../ui/BottomSheet";
import { useId, useState, useEffect } from "react";
import CartService from "@/services/cart.service";
import { useUser } from "@/context/userContext";
import { getDeviceType } from "@/utils/device";
import { useCity } from "@/context/CityContext";
import { toast } from "react-toastify";

export type PatientLite = {
  id: number;
  name: string;
  genderAgeLine: string;
  addressLine: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  members: any;
  initialSelectedId?: number[];
  onAddNewMember: () => void;
  refetch: () => void;
  primaryColor?: string;
  cartId: string;
};

export default function AddMemberSelectionSheet({
  open,
  onClose,
  members,
  initialSelectedId = [],
  onAddNewMember,
  primaryColor = "#0074c6",
  cartId,
  refetch,
}: Props) {
  const titleId = useId();
  const { cityDetails } = useCity();
  const cityId = cityDetails?.id;

  const [selectedId, setSelectedId] = useState<number | null>(null);

  const { user } = useUser();

  useEffect(() => {
    if (open && initialSelectedId?.length) {
      setSelectedId(initialSelectedId[0]);
    } else {
      setSelectedId(null);
    }
  }, [open, initialSelectedId]);

  const selectMember = (id: number) => {
    setSelectedId(id);
  };

  const handleAddToTest = async () => {
    if (!selectedId) {
      toast.error("Please select a member to add.");
      return;
    }

    const selectedMember = members.find(
      (member: any) => member.memberID === selectedId,
    );

    if (!selectedMember) {
      toast.error("Selected member not found.");
      return;
    }

    const body = {
      view: "cart",
      userID: user?.userID,
      deviceType: getDeviceType(),
      userPhone: user?.userPhone,
      action: "cartItemMemberAssign",
      cartID: cartId,
      memberID: selectedMember.memberID,
      cityID: cityId,
    };

    try {
      const response = await CartService.cartItemMemberAssign(body);

      if (response.msgCode === "1") {
        toast.success("Member added to the test.");
        refetch();
        onClose();
      } else {
        toast.error(response.message || "Failed to add member.");
        onClose();
      }
    } catch (error) {
      console.error("Error adding member to cart:", error);
      toast.error("An error occurred while adding the member.");
      onClose();
    }
  };

  return (
    <>
      <BottomSheet
        open={open}
        onClose={onClose}
        titleId={titleId}
        maxHeightClassName="max-h-[85vh]"
      >
        {/* Header */}
        <div>
          <div className="flex items-center justify-between border-b border-neutral-100 p-4">
            <p id={titleId} className="text-base font-semibold text-gray-900">
              SELECT / ADD PATIENTS
            </p>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-gray-100 text-gray-700"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          <div className="p-4 flex justify-end border-b border-neutral-100">
            <button
              type="button"
              onClick={onAddNewMember}
              className="px-4 py-2 gradient-blue rounded-lg text-white text-sm font-normal shadow-sm"
            >
              ADD NEW MEMBER
            </button>
          </div>
        </div>

        {/* List */}
        <div className="px-4 pb-24 pt-5 overflow-y-auto max-h-[calc(85vh-160px)]">
          <div className="space-y-3">
            {members?.map((member: any, idx: any) => {
              const isSelected = selectedId === member.memberID;
              return (
                <div key={idx} className="flex gap-3 items-start">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => selectMember(member.memberID)}
                    className="mt-5 h-4 w-4 rounded border-gray-300"
                    style={{ accentColor: primaryColor }}
                  />

                  <button
                    type="button"
                    onClick={() => selectMember(member.memberID)}
                    className={[
                      "w-full text-left rounded-xl border bg-white",
                      "px-4 py-3 shadow-sm",
                      isSelected ? "border-blue-200" : "border-gray-200",
                    ].join(" ")}
                  >
                    <p className="text-sm font-semibold text-gray-900">
                      {idx + 1}. {member.prefix} {member.first_name}{" "}
                      {member.last_name}
                    </p>
                    <p className="text-xs text-gray-600 mt-0.5">
                      {member.gender}
                      {member.gender && ","} {member.age}{" "}
                      {member.age && "years."}
                    </p>
                    <p className="text-sm font-medium mt-0.5 italic">
                      {`${member.line1}, `}
                      {`${member.area}, `}
                      {`${member.cityName}, `} {` -${member.pincode}, `}{" "}
                      {member.stateName}
                    </p>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sticky CTA */}
        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
          <button
            type="button"
            onClick={handleAddToTest}
            className="w-full gradient-blue py-3 rounded-lg text-white font-normal"
          >
            ADD TO TEST
          </button>
        </div>
      </BottomSheet>
    </>
  );
}
