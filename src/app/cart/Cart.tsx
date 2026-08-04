"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import "react-toastify/dist/ReactToastify.css";
import { Check, Trash2 } from "lucide-react";
import AddMemberSelectionSheet from "@/components/modals/AddMemberSelectionSheet";
import AddNewMemberSheet, {
  MemberForm,
} from "@/components/modals/AddNewMemberSheet";
import PrescriptionSheet from "@/components/modals/PrescriptionSheet";
import ConfirmationModal from "@/components/modals/ConfirmationModal";
import { useCart } from "@/hooks/useCart";
import { useCartContext } from "@/context/CartContext";
import { toast } from "react-toastify";
import PrescriptionDetail from "@/components/modals/PrescriptionDetail";
import DeletePrescriptionModal from "@/components/modals/DeletePrescriptionModal";
import { useFamilyMembers } from "@/hooks/useFamilyMembers";
import { useCity } from "@/context/CityContext";
import CartService from "@/services/cart.service";
import { getDeviceType } from "@/utils/device";
import { useUser } from "@/context/userContext";

interface Member {
  id: number;
  name: string;
  type: string;
  address: string;
}

interface Coupon {
  code: string;
  discount: number;
  applied: boolean;
}

const PRIMARY = "#0074c6";

export default function TestsInCartCard() {
  const { cityDetails } = useCity();
  const { members } = useFamilyMembers();
  const [toPay, setToPay] = useState<number>();

  const [cartID, setCartID] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [selectPatientsOpen, setSelectPatientsOpen] = useState(false);
  const [addNewMemberOpen, setAddNewMemberOpen] = useState(false);
  const [prescriptionOpen, setPrescriptionOpen] = useState(false);
  const [viewPrescriptionOpen, setViewPrescriptionOpen] = useState(false);
  const { user } = useUser();

  const [selectedCartIDToDelete, setSelectedCartIDToDelete] = useState<
    string | null
  >(null);
  const [showDeleteTestModal, setShowDeleteTestModal] =
    useState<boolean>(false);
  const [showDeleteMemberModal, setShowDeleteMemberModal] =
    useState<boolean>(false);
  const [deletingMemberId, setDeletingMemberId] = useState<string | null>(null);
  const { cartCount, cartSubtotal } = useCartContext();
  const [showRemovePrescriptionModal, setShowRemovePrescriptionModal] =
    useState(false);
  const [selectedPrescriptionCartID, setSelectedPrescriptionCartID] = useState<
    string | null
  >(null);

  const [coupons, setCoupons] = useState<Coupon[]>([
    { code: "MDRC2026", discount: 0, applied: true },
    { code: "WELCOME10", discount: 200, applied: false },
    { code: "HEALTH50", discount: 50, applied: false },
  ]);

  const {
    cartItems,
    loading,
    isSampleHome,
    removeFromCart,
    fetchCartList,
    handleassignPrescription,
    removePrescription,
    handleCheckForCheckout,
    checkoutLoading,
    setSampleCollect,
    sampleCollect,
  } = useCart(user?.userID, user?.userPhone, search);

  const handleDeleteTest = (id: string): void => {
    setSelectedCartIDToDelete(id);
    setShowDeleteTestModal(true);
  };

  const handleConfirmDeleteTest = async (): Promise<void> => {
    if (selectedCartIDToDelete) {
      await removeFromCart(selectedCartIDToDelete);
      toast.success("Item removed from cart!");
    }
    setShowDeleteTestModal(false);
    setSelectedCartIDToDelete(null);
  };

  const handleDeleteMember = (cartID: string): void => {
    setDeletingMemberId(cartID);
    setShowDeleteMemberModal(true);
  };

  const handleConfirmDeleteMember = async (): Promise<void> => {
    if (!deletingMemberId) return;

    try {
      const body = {
        view: "cart",
        userID: user?.userID,
        userPhone: user?.userPhone,
        deviceType: getDeviceType(),
        action: "cartItemMemberRemove",
        cartID: deletingMemberId,
      };

      const res = await CartService.cartItemMemberRemove(body);

      toast.success(res.message || "Member removed successfully");
      await fetchCartList();
    } catch (error) {
      console.error("Failed to remove member:", error);
      toast.error("Failed to remove member");
    } finally {
      setShowDeleteMemberModal(false);
      setDeletingMemberId(null);
    }
  };

  const handleCancelDelete = (): void => {
    setShowDeleteTestModal(false);
    setShowDeleteMemberModal(false);
    setDeletingMemberId(null);
    setSelectedCartIDToDelete(null);
  };

  // const applyCoupon = (code: string): void => {
  //   const couponIndex = coupons.findIndex((c) => c.code === code);
  //   if (couponIndex !== -1) {
  //     const newCoupons = [...coupons];
  //     newCoupons[couponIndex] = { ...newCoupons[couponIndex], applied: true };
  //     setCoupons(newCoupons);
  //     setToPay((prev: any) => prev - newCoupons[couponIndex].discount);
  //   }
  // };

  // const removeCoupon = (code: string): void => {
  //   const couponIndex = coupons.findIndex((c) => c.code === code);
  //   if (couponIndex !== -1) {
  //     const newCoupons = [...coupons];
  //     newCoupons[couponIndex] = { ...newCoupons[couponIndex], applied: false };
  //     setCoupons(newCoupons);
  //     setToPay((prev: any) => prev + newCoupons[couponIndex].discount);
  //   }
  // };

  const openSelectPatientsSheet = (cartID: string) => {
    setCartID(cartID);
    setSelectPatientsOpen(true);
  };

  const openAddNewMemberFromSelect = () => {
    setSelectPatientsOpen(false);
    setAddNewMemberOpen(true);
  };

  const initialSelectedMemberId = useMemo(
    () => (members.length ? members[0].memberID : null),
    [members],
  );

  const handleSaveNewMember = (form: MemberForm) => {
    const id = Date.now();
    const newPatient: Member = {
      id,
      name: `${form.prefix ? form.prefix + " " : ""}${form.first_name} ${
        form.last_name
      }`.trim(),
      type: form.relation,
      address:
        `${form.line1}, ${form.cityID} - ${form.pincode}, ${form.stateID}`.trim(),
    };

    // setPatients((prev) => [...prev, newPatient]);
    // setMembers((prev) => [...prev, newPatient]);
    setAddNewMemberOpen(false);
  };

  const handleAddPrescription = (id: string): void => {
    setCartID(id);
    setPrescriptionOpen(true);
  };

  const handleUploadPrescription = async (file: File) => {
    if (!cartID) return;

    try {
      await handleassignPrescription(file, cartID);
      await fetchCartList();
      setPrescriptionOpen(false);
    } catch (error) {
      console.error("Prescription upload error:", error);
    }
  };

  const handleDeletePrescriptionConfirmed = async () => {
    if (!selectedPrescriptionCartID) return;

    try {
      await removePrescription(selectedPrescriptionCartID);
      toast.success("Prescription removed successfully");
    } catch (err) {
      toast.error("Failed to remove prescription");
    } finally {
      setShowRemovePrescriptionModal(false);
      setSelectedPrescriptionCartID(null);
    }
  };

  const openPrescriptionDetail = (cartID: string) => {
    setCartID(cartID);
    setViewPrescriptionOpen(true);
  };

  const appliedCoupons = coupons.filter((c) => c.applied);
  const appliedDiscount = appliedCoupons.reduce(
    (sum, c) => sum + c.discount,
    0,
  );

  const formatPrice = (val: string) => {
    const num = Math.floor(parseFloat(val));
    return isNaN(num) ? "₹0" : `₹${num.toLocaleString("en-IN")}`;
  };

  const selectedPrescription = cartItems.find((item) => item.cartID === cartID);

  useEffect(() => {
    if (
      addNewMemberOpen ||
      selectPatientsOpen ||
      prescriptionOpen ||
      viewPrescriptionOpen
    ) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [
    addNewMemberOpen ||
      selectPatientsOpen ||
      prescriptionOpen ||
      viewPrescriptionOpen,
  ]);

  return (
    <>
      <div>
        <div className="w-full mx-auto p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-medium text-[#424040]">
              TESTS IN YOUR CART ({cartCount})
            </h2>
            <Link href={`/pathology/lab-blood-test-near/${cityDetails?.slug}`}>
              <button
                type="button"
                className="rounded-md gradient-blue px-3 py-1 text-sm text-white shadow hover:shadow-lg"
              >
                + Add Tests
              </button>
            </Link>
          </div>

          {loading && (
            <p className="text-center text-gray-400 py-10">Loading...</p>
          )}

          {cartItems.length > 0 && !loading
            ? cartItems.map((cartItem) => (
                <div
                  key={cartItem.cartID}
                  className="rounded-2xl bg-[#F6F6F6] shadow-[0_0_15px_rgba(0,0,0,0.15)] px-4 pt-3 pb-3 mb-4"
                >
                  <div className="flex items-start justify-between">
                    <p className="text-lg font-medium text-[#005C96] leading-snug max-w-[80%]">
                      {cartItem.name}
                    </p>
                    <button
                      type="button"
                      onClick={() => handleDeleteTest(cartItem.cartID)}
                      className="mt-1 p-1 hover:bg-gray-100 rounded-full"
                    >
                      <Trash2 className="size-4 text-red-600" />
                    </button>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {parseFloat(cartItem.mrp) > 0 && (
                        <span className="line-through text-sm opacity-70">
                          {formatPrice(cartItem.mrp)}
                        </span>
                      )}
                      <span className="text-xl font-bold text-black">
                        {formatPrice(cartItem.price)}
                      </span>
                    </div>
                    <button className="inline-flex items-center rounded-full border border-gray-300 px-3 py-0.5 text-[10px] font-medium text-gray-700">
                      {cartItem.cartItemTestCount}
                    </button>
                  </div>
                  <div className="mt-4">
                    {cartItem.cartItemMemberRequire === "Yes" &&
                      (cartItem.cartItemMember?.trim() ? (
                        <div className="flex items-center gap-4 justify-between bg-[#E6F8FF] p-3 shadow rounded-lg">
                          <div
                            className="text-sm text-gray-600 space-y-4 leading-relaxed"
                            dangerouslySetInnerHTML={{
                              __html: cartItem.cartItemMember,
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => handleDeleteMember(cartItem.cartID)}
                            className="text-sm font-semibold text-[#0ECE91] hover:underline"
                          >
                            <img
                              src="/assets/svg/circle-cross.svg"
                              alt=""
                              className="size-4"
                            />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() =>
                            openSelectPatientsSheet(cartItem.cartID)
                          }
                          className="w-full rounded-xl bg-white shadow px-4 py-2.5 flex items-center justify-between text-base font-semibold text-gray-600 hover:bg-gray-50"
                        >
                          <span>+ Add another member</span>
                        </button>
                      ))}

                    {cartItem.cartItemPrescriptionRequire === "Yes" &&
                      (cartItem.cartItemPrescriptionFile?.trim() ? (
                        <div className="w-full rounded-xl bg-[#F6F6F6] shadow px-4 py-2.5 flex items-center justify-between mt-2">
                          <span className="text-sm font-medium text-gray-700 truncate">
                            Prescription Info
                          </span>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedPrescriptionCartID(cartItem.cartID);
                                setShowRemovePrescriptionModal(true);
                              }}
                              className="text-sm font-semibold text-red-500 hover:underline"
                            >
                              <img
                                src="/assets/svg/circle-cross.svg"
                                alt=""
                                className="size-4"
                              />
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                openPrescriptionDetail(cartItem.cartID)
                              }
                              className="text-sm font-semibold text-[#00b266] hover:underline"
                            >
                              View Detail
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleAddPrescription(cartItem.cartID)}
                          className="w-full rounded-xl bg-[#F6F6F6] shadow px-4 py-2.5 flex items-center justify-between text-base font-semibold text-gray-600 hover:bg-gray-50 mt-2"
                        >
                          <span>+ Add prescription</span>
                        </button>
                      ))}
                  </div>
                </div>
              ))
            : !loading && (
                <div className="py-10">
                  <h2 className="text-center text-xl font-semibold">
                    Your cart is empty.
                  </h2>
                  <p className="text-center text-gray-400 py-3 text-sm">
                    Looks like you haven’t added <br /> any test / checkup to
                    your cart
                  </p>
                  <div className="flex justify-center">
                    <Link
                      href={`/pathology/lab-blood-test-near/${cityDetails?.slug}`}
                    >
                      <button
                        type="button"
                        className="rounded-md gradient-blue px-5 py-3 mt-2 text-md text-white shadow hover:shadow-lg"
                      >
                        Add test/checkup
                      </button>
                    </Link>
                  </div>
                </div>
              )}

          {isSampleHome === "Yes" && (
            <div
              role="button"
              tabIndex={0}
              onClick={() =>
                setSampleCollect(sampleCollect === "Yes" ? "No" : "Yes")
              }
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  setSampleCollect(sampleCollect === "Yes" ? "No" : "Yes");
                }
              }}
              className={`mt-6 rounded-2xl py-3 flex items-center cursor-pointer transition-colors
                ${sampleCollect === "Yes" ? "bg-green-50" : "hover:bg-gray-50"}
                `}
            >
              <div className="flex-1 flex items-center gap-2 px-2">
                <label
                  className="relative flex items-start mt-0.5 cursor-pointer"
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="checkbox"
                    checked={sampleCollect === "Yes"}
                    onChange={(e) =>
                      setSampleCollect(e.target.checked ? "Yes" : "No")
                    }
                    className="peer appearance-none h-4 w-4 rounded border border-gray-300 bg-white transition-all checked:border-[#00b266] checked:bg-[#00b266] focus:outline-none focus:ring-0 cursor-pointer"
                  />
                  <Check
                    size={12}
                    strokeWidth={4}
                    className="pointer-events-none absolute left-0.5 top-0.5 text-white opacity-0 peer-checked:opacity-100"
                  />
                </label>
                <div>
                  <p className="text-sm font-semibold text-[#1160A5]">
                    Home Sample Collection Service
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-[#565353]">
                    Blood tests can be done through home blood sample collection
                    services.
                  </p>
                </div>
              </div>
              <div className="ml-2 relative h-24 w-24">
                <Image
                  src="/assets/images/cart/driver.svg"
                  alt="Home collection"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          )}
        </div>

        <section className="w-full mx-auto px-4 pb-6 space-y-4">
          <p className="font-semibold text-[#424040]">Payment Summary</p>
          <div className="rounded-2xl bg-white shadow-[0_0_15px_rgba(0,0,0,0.15)] px-4 py-3">
            <div className="flex items-center justify-between pb-2 border-b border-gray-200">
              <p className="font-semibold text-gray-600">Total MRP</p>
              <p className="font-semibold text-gray-600">₹{cartSubtotal}/-</p>
            </div>
            <div className="mt-2 space-y-1.5 text-sm">
              <div className="flex items-center justify-between border-b border-gray-200 pb-1.5">
                <p className="text-[#05AF79] font-medium">Discount on MRP</p>
                <p className="text-[#05AF79] font-medium">₹0/-</p>
              </div>
              <div className="flex items-center justify-between border-b border-gray-200 pb-1.5">
                <p className="text-[#05AF79] font-medium">Coupon Discount</p>
                <p className="text-[#05AF79] font-medium">
                  -₹{appliedDiscount}/-
                </p>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-600">
                    Collection Charges
                  </p>
                  <p className="text-xs">
                    Free Collection on order above MRP 350
                  </p>
                </div>
                <div className="flex gap-1 items-center">
                  <p className="font-medium text-gray-600">₹0</p>
                  <p className="text-sm font-medium text-[#05AF79]">Free</p>
                </div>
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-gray-200 flex items-center justify-between">
              <p className="font-semibold text-gray-600">To Pay</p>
              <p className="font-semibold text-gray-600 text-2xl">
                ₹{cartSubtotal}
              </p>
            </div>
          </div>
        </section>

        <div className="pb-8 w-full px-4">
          <button
            disabled={checkoutLoading}
            onClick={handleCheckForCheckout}
            className="bg-red-500 w-full text-white py-2 px-8 rounded font-semibold hover:bg-red-600 transition-colors"
          >
            {checkoutLoading ? "Processing..." : "Proceed"}
          </button>
        </div>

        <section className="flex w-full items-center justify-between bg-gradient-to-b from-[#005C96] to-[#15AEE5] px-4 py-3 shadow-sm mb-6">
          <div className="flex items-center space-x-2">
            <img src="/assets/images/cart/microscope.svg" className="h-5 w-5" />
            <span className="text-[8px] text-white">
              NABH Accredited Centres
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <img src="/assets/images/cart/medical.svg" className="h-5 w-5" />
            <span className="text-[8px] text-white">Online Report</span>
          </div>
          <div className="flex items-center space-x-2">
            <img src="/assets/images/cart/scooter.svg" className="h-5 w-5" />
            <span className="text-[8px] text-white">
              Home Sample Collection
            </span>
          </div>
        </section>
      </div>

      {showDeleteTestModal && (
        <ConfirmationModal
          isOpen={showDeleteTestModal}
          onConfirm={handleConfirmDeleteTest}
          onCancel={handleCancelDelete}
          title="Remove from Cart?"
          message="Are you sure you want to remove this test from your cart?"
        />
      )}
      {showDeleteMemberModal && (
        <ConfirmationModal
          isOpen={showDeleteMemberModal}
          onConfirm={handleConfirmDeleteMember}
          onCancel={handleCancelDelete}
          title="Remove Member?"
          message="Are you sure you want to remove this member from the order?"
        />
      )}

      {showRemovePrescriptionModal && (
        <DeletePrescriptionModal
          isOpen={showRemovePrescriptionModal}
          onConfirm={handleDeletePrescriptionConfirmed}
          onCancel={() => {
            setShowRemovePrescriptionModal(false);
            setSelectedPrescriptionCartID(null);
          }}
          title="Remove Prescription?"
          message="Are you sure you want to remove this prescription?"
          primaryColor="#00b266"
        />
      )}

      <AddMemberSelectionSheet
        open={selectPatientsOpen}
        onClose={() => setSelectPatientsOpen(false)}
        refetch={() => fetchCartList()}
        members={members}
        initialSelectedId={
          initialSelectedMemberId ? [initialSelectedMemberId] : []
        }
        onAddNewMember={openAddNewMemberFromSelect}
        primaryColor={PRIMARY}
        cartId={cartID}
      />

      <AddNewMemberSheet
        open={addNewMemberOpen}
        onClose={() => setAddNewMemberOpen(false)}
        onSave={handleSaveNewMember}
        primaryColor={PRIMARY}
      />

      <PrescriptionSheet
        open={prescriptionOpen}
        onClose={() => setPrescriptionOpen(false)}
        onUpload={handleUploadPrescription}
        primaryColor={PRIMARY}
        cartItems={cartItems}
      />

      <PrescriptionDetail
        open={viewPrescriptionOpen}
        onClose={() => setViewPrescriptionOpen(false)}
        fileUrl={selectedPrescription?.cartItemPrescriptionFile || ""}
      />
    </>
  );
}
