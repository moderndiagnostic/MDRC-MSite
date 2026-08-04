"use client";

import React, { useEffect, useMemo, useState } from "react";
import { ChevronDown, ChevronRight, Calendar, Clock } from "lucide-react";
import { OrderCheckoutPayload, useCheckout } from "@/hooks/useCheckout";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useRouter } from "next/navigation";
import { getDeviceType } from "@/utils/device";
import { useCity } from "@/context/CityContext";
import { toast } from "react-toastify";
import { useUser } from "@/context/userContext";
import { useCartContext } from "@/context/CartContext";
import { useCart } from "@/hooks/useCart";
import { CheckoutService } from "@/services/checkoutService";

interface Home {
  id: string;
  name: string;
}

interface Lab {
  id: string;
  name: string;
  address: string;
}

type PickerButtonProps = {
  value?: string;
  onClick?: () => void;
  placeholderText: string;
  icon: React.ReactNode;
  onOpen?: () => void;
  displayValue?: string;
};

type UICoupon = {
  code: string;
  msg: string;
  applied: boolean;
};

declare global {
  interface Window {
    Razorpay: any;
  }
}

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const PickerButton = React.forwardRef<HTMLButtonElement, PickerButtonProps>(
  ({ value, onClick, placeholderText, icon, onOpen, displayValue }, ref) => {
    const text = (displayValue ?? value ?? "").trim();

    return (
      <button
        ref={ref}
        type="button"
        onClick={() => {
          onOpen?.();
          onClick?.();
        }}
        className="flex items-center justify-between rounded-xl bg-white shadow px-3 py-2 cursor-pointer w-full"
      >
        <span className={`text-sm text-gray-700`}>
          {text || placeholderText}
        </span>
        {icon}
      </button>
    );
  },
);
PickerButton.displayName = "PickerButton";

export default function CheckoutAccordion() {
  const {
    checkoutItems,
    loading,
    error,
    message,
    placeOrder,
    orderLoading,
    couponList,
    applyCouponApi,
  } = useCheckout();

  const [paymentOption, setPaymentOption] = useState<
    "COD" | "ONLINE" | "RAZORPAY"
  >("COD");
  const [selectedHome, setSelectedHome] = useState<string | null>(null);
  const [selectedLab, setSelectedLab] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string>("");
  const [selectedHomeDate, setSelectedHomeDate] = useState<string | null>(null);
  const [selectedLabDate, setSelectedLabDate] = useState<string | null>(null);
  const [selectedHomeTime, setSelectedHomeTime] = useState<string | null>(null);
  const [selectedLabTime, setSelectedLabTime] = useState<string | null>(null);
  const [openDate, setOpenDate] = useState<"lab" | "home" | null>(null);
  const [showAllCoupons, setShowAllCoupons] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [coupons, setCoupons] = useState<UICoupon[]>([]);
  const [couponDiscount, setCouponDiscount] = useState<number>(0);
  const [advanceAmount, setAdvanceAmount] = useState<number | "">("");
  const [advanceError, setAdvanceError] = useState("");

  const { cityDetails } = useCity();
  const { user } = useUser();
  const selectedCity = cityDetails;
  const router = useRouter();
  const { sampleCollect } = useCartContext();
  const { clearCart } = useCart(user?.userID, user?.userPhone, "");
  const { clearCartContext } = useCartContext();

  const COUPON_STORAGE_KEY = "applied_coupon";

  const [isOpen, setIsOpen] = useState({
    cart: false,
    lab: true,
    home: false,
    payment: false,
  });

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 15);

  const homeTimeList = checkoutItems?.homeCollectionStep?.timeList || [];
  const labTimeList = checkoutItems?.labCollectionStep?.labTimeList || [];

  const hasHome =
    !!checkoutItems?.homeCollectionStep &&
    Object.keys(checkoutItems.homeCollectionStep).length > 0;

  const hasLab =
    !!checkoutItems?.labCollectionStep &&
    Object.keys(checkoutItems.labCollectionStep).length > 0;

  const openRazorpay = async (data: any) => {
    try {
      // 🔹 Load Razorpay SDK
      const res = await loadRazorpayScript();

      if (!res) {
        throw new Error("Razorpay SDK failed to load");
      }

      const paymentID = data.paymentID;
      const orderID = data.orderID;

      const options = {
        key: data?.razor_pay_key,
        amount: data?.amount,
        currency: "INR",
        name: "Modern Diagnostic & Research Centre Limited",
        description: "Order Payment",
        order_id: data?.razor_order_id,

        handler: async (response: any) => {
          const body = {
            view: "order_result_razorpay",
            razorpay_status: "success",
            payment_trans_id: response.razorpay_payment_id,
            razor_order_id: response.razorpay_order_id,
            payment_signature: response.razorpay_signature,
            order_payment_id: paymentID,
          };

          try {
            const verifyRes = await CheckoutService.verifyRazorpayPayment(body);

            console.log(verifyRes, "verifyResverifyRes");

            if (verifyRes?.msgCode === "0") {
              toast.success(verifyRes?.result?.msg1 || "Payment failed");
              rzp.close();
              router.replace(`/order/${orderID}?paymentID=${paymentID}`);
            }

            if (verifyRes?.msgCode === "1") {
              toast.success(verifyRes?.result?.msg1 || "Payment successful");

              clearCart();
              clearCartContext();
              router.replace(`/order/${orderID}?paymentID=${paymentID}`);
            } else {
              throw new Error("Payment verification failed");
            }
          } catch (err: any) {
            console.log(err, "err");

            console.error("Verification Error:", err);
            setValidationError(err.message || "Payment verification failed");
            toast.error(err.message || "Payment verification failed");
          }
        },

        prefill: {
          name: user?.name || "",
          contact: user?.userPhone || "",
        },

        theme: {
          color: "#05AF79",
        },

        // 🔥 BONUS: handle payment failure UI
        modal: {
          ondismiss: () => {
            setValidationError("Payment cancelled by user");
          },
        },
      };

      const rzp = new window.Razorpay(options);

      // 🔥 Handle payment failure event
      rzp.on("payment.failed", function (response: any) {
        console.error("Payment Failed:", response);
        const failPayload = {
          view: "order_result_razorpay",
          razorpay_status: "fail",
          payment_trans_id: "",
          razor_order_id: response.razorpay_order_id,
          payment_signature: "",
          order_payment_id: "",
        };

        // Send the failure payload
        CheckoutService.verifyRazorpayPayment(failPayload)
          .then((verifyRes) => {
            console.log(verifyRes, "verifyResverifyRes");
            if (verifyRes?.msgCode === "0") {
              try {
                rzp.close();
              } catch (e) {
                console.warn("rzp.close() failed", e);
              }

              setTimeout(() => {
                const iframe = document.querySelector(
                  "iframe[src*='razorpay']",
                );
                const modal = document.querySelector(".razorpay-container");

                if (iframe) iframe.remove();
                if (modal) modal.remove();
              }, 300);

              toast.error(verifyRes?.result?.msg1 || "Payment failed");
              router.replace(`/order/${orderID}?paymentID=${paymentID}`);
            }
          })
          .catch((err) => {
            console.error("Error during failure verification", err);
            toast.error("Payment failed, unable to verify");
          });

        setValidationError(
          response?.error?.description || "Payment failed. Please try again.",
        );
        toast.error("Payment failed");
      });

      rzp.open();
    } catch (error: any) {
      console.error("Razorpay Error:", error);

      // ✅ Set validation error (your requirement)
      setValidationError(
        error.message || "Something went wrong during payment",
      );

      // optional toast
      toast.error(error.message || "Payment failed");
    }
  };

  const handlePayNowClick = async (e: React.MouseEvent) => {
    try {
      // Case 1: Both Home & Lab available
      if (hasHome && hasLab) {
        if (!selectedHomeDate || !selectedHomeTime) {
          setValidationError(
            "Please select date and time for Home Collection.",
          );
          return;
        }

        if (!selectedLabDate || !selectedLabTime) {
          setValidationError("Please select date and time for Lab Collection.");
          return;
        }
      }

      if (paymentOption !== "COD" && minAdvanceAmount > 0) {
        const advance = Number(advanceAmount || 0);

        if (advance < minAdvanceAmount) {
          setValidationError(`Minimum advance amount is ₹${minAdvanceAmount}`);
          return;
        }
      }

      // Case 2: Only Home available
      if (hasHome && !hasLab) {
        if (!selectedHomeDate || !selectedHomeTime) {
          setValidationError(
            "Please select date and time for Home Collection.",
          );
          return;
        }
      }

      // Case 3: Only Lab available
      if (hasLab && !hasHome) {
        if (!selectedLabDate || !selectedLabTime) {
          setValidationError("Please select date and time for Lab Collection.");
          return;
        }
      }

      if (!user || user === "null") {
        open("login");
        return;
      }

      setValidationError("");

      const payload: OrderCheckoutPayload = {
        view: "checkout",
        userID: user?.userID,
        deviceType: getDeviceType(),
        userPhone: user?.userPhone,
        cityID: cityDetails?.id || selectedCity?.id,
        sampleCollect,
        homeCollectionAddressID: selectedHome || "",
        homeCollectionDate: selectedHomeDate || "",
        homeCollectionTime: selectedHomeTime || "",
        labCollectionAddressID: selectedLab || "",
        labCollectionDate: selectedLabDate || "",
        labCollectionTime: selectedLabTime || "",
        paymentMode: paymentOption,
        walletUsed: "No",
        couponCode: appliedCoupons[0]?.code,
        couponDiscount: couponDiscount.toString(),
        grandTotal: checkoutItems?.allTotals?.subtotal ?? 0,
        ...(Number(advanceAmount) > 0 && {
          minTotal: Number(advanceAmount),
        }),
      };

      const res = await placeOrder(payload);

      console.log(res, "resssssss");

      if (res?.msgCode === "1") {
        clearCart();
        clearCartContext();
        const orderID = res?.result?.orderID;
        const paymentID = res?.result?.paymentID;

        router.replace(`/order/${orderID}?paymentID=${paymentID}`);
        return;
      }

      if (res?.msgCode === "2") {
        router.replace("/cart");
        return;
      }

      if (res?.msgCode === "0") {
        toast.error(res.message);
        return;
      }

      if (res?.msgCode === "3") {
        const apiRes = res as any;
        const { orderID, webViewUrl } =
          apiRes.result || apiRes.data?.result || {};

        if (paymentOption === "ONLINE" && webViewUrl) {
          window.location.href = webViewUrl;
          return;
        }

        if (orderID) {
          clearCart();
          clearCartContext();
          localStorage.setItem("orderPlaced", "true");
          router.replace(
            `/order/${orderID}?paymentID=${apiRes.result?.paymentID || ""}`,
          );
          return;
        }

        toast.error("Order details not received");
      }

      if (res?.msgCode === "4") {
        const apiRes = res as any;

        if (paymentOption === "RAZORPAY") {
          await openRazorpay(apiRes.result || apiRes.data?.result);
          return;
        }

        toast.error("Order details not received");
      }
    } catch (err: any) {
      console.error("Checkout Error:", err);
      setValidationError(err.message || "Unable to place order");
    }
  };
  useEffect(() => {
    setIsOpen({
      cart: false,
      lab: hasLab,
      home: !hasLab && hasHome,
      payment: false,
    });
  }, [hasLab, hasHome]);

  useEffect(() => {
    const orderPlaced = localStorage.getItem("orderPlaced");

    if (orderPlaced === "true") {
      localStorage.removeItem("orderPlaced");
      router.replace("/cart");
    }
  }, []);

  useEffect(() => {
    // If LAB exists, select first lab
    if (
      !selectedLab &&
      checkoutItems?.labCollectionStep?.labCollectionSelection?.length
    ) {
      setSelectedLab(
        checkoutItems.labCollectionStep.labCollectionSelection[0].id,
      );
    }

    // Else if HOME exists, select first home
    else if (
      !selectedHome &&
      checkoutItems?.homeCollectionStep?.homeCollectionSelection?.length
    ) {
      setSelectedHome(
        checkoutItems.homeCollectionStep.homeCollectionSelection[0].id,
      );
    }
  }, [checkoutItems, selectedLab, selectedHome]);

  const appliedCoupons = useMemo(
    () => coupons.filter((c) => c.applied),
    [coupons],
  );
  const availableCoupons = useMemo(
    () => coupons.filter((c) => !c.applied),
    [coupons],
  );

  const applyCoupon = async (code: string) => {
    const res = await applyCouponApi(code);

    if (res?.msgCode === "1") {
      const discount = parseFloat(res?.result?.discount ?? "0") || 0;

      const applied = {
        code,
        discount,
      };

      // ✅ Save to localStorage
      localStorage.setItem(COUPON_STORAGE_KEY, JSON.stringify(applied));

      setCoupons((prev) =>
        prev.map((c) =>
          c.code === code ? { ...c, applied: true } : { ...c, applied: false },
        ),
      );

      setAppliedCoupon(code);
      setCouponDiscount(discount);

      toast.success(res.message || "Coupon applied successfully 🎉");
    } else {
      toast.error(res?.message || "Failed to apply coupon");
    }
  };

  const removeCoupon = () => {
    setCoupons((prev) => prev.map((c) => ({ ...c, applied: false })));
    setAppliedCoupon(null);
    setCouponDiscount(0);

    // ✅ Remove from localStorage
    localStorage.removeItem(COUPON_STORAGE_KEY);
  };

  const toPayAmount = Math.max(
    (checkoutItems?.allTotals?.subtotal || 0) - couponDiscount,
    0,
  );
  const minAdvanceAmount = checkoutItems?.minAdvanceAmount || 0;
  const toPay = toPayAmount;
  const balanceDue = Math.max(toPay - Number(advanceAmount || 0), 0);

  useEffect(() => {
    if (minAdvanceAmount > 0) {
      setAdvanceAmount(Number(minAdvanceAmount));
    } else {
      setAdvanceAmount(0);
    }
  }, [minAdvanceAmount]);

  // useEffect(() => {
  //   if (advanceAmount && advanceAmount < minAdvanceAmount) {
  //     setAdvanceError(`Minimum advance is ₹${minAdvanceAmount}`);
  //   } else {
  //     setAdvanceError("");
  //   }
  // }, [advanceAmount, minAdvanceAmount]);

  const handleAdvanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;

    // allow empty input
    if (val === "") {
      setAdvanceAmount("");
      setValidationError("");
      return;
    }

    val = val.replace(/^0+(?=\d)/, "");
    let num = Number(val);

    if (num > toPayAmount) {
      num = toPayAmount;
    }
    setAdvanceAmount(num);
  };

  useEffect(() => {
    if (!couponList || couponList.length === 0) return;

    const saved = localStorage.getItem(COUPON_STORAGE_KEY);
    let appliedCode: string | null = null;
    let appliedDiscount = 0;

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        appliedCode = parsed.code;
        appliedDiscount = parsed.discount;
      } catch {
        localStorage.removeItem(COUPON_STORAGE_KEY);
      }
    }

    setCoupons(
      couponList.map((c) => ({
        code: c.code,
        msg: c.msg,
        applied: c.code === appliedCode,
      })),
    );

    if (appliedCode) {
      setAppliedCoupon(appliedCode);
      setCouponDiscount(appliedDiscount);
    }
  }, [couponList]);

  const stepNumbers = {
    cart: 1,
    lab: hasLab ? 2 : null,
    home: hasLab && hasHome ? 3 : hasHome ? 2 : null,
    payment: hasLab && hasHome ? 4 : 3,
  };

  const toggleSection = (section: "lab" | "home" | "payment" | "cart") => {
    setIsOpen((prev) => ({
      ...prev,
      [section]: !prev[section],
      ...(section === "cart"
        ? { lab: false, home: false, payment: false }
        : {}),
      ...(section === "lab"
        ? { cart: false, home: false, payment: false }
        : {}),
      ...(section === "home"
        ? { cart: false, lab: false, payment: false }
        : {}),
      ...(section === "payment"
        ? { cart: false, lab: false, home: false }
        : {}),
    }));
  };

  const formatDate = (date: Date | null) => {
    if (!date) return null;
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleDateSelect = (section: "home" | "lab", date: Date | null) => {
    if (!date) return;

    const formatted = formatDate(date);
    console.log(formatted, "sss");

    if (section === "home") {
      setSelectedHomeDate(formatted);
    } else {
      setSelectedLabDate(formatted);
    }

    setOpenDate(null);
  };

  const formatPrice = (val: string) => {
    const num = Math.floor(parseFloat(val));
    return isNaN(num) ? "₹0" : `₹${num.toLocaleString("en-IN")}`;
  };

  const parseDDMMYYYY = (value?: string | null) => {
    if (!value) return null;
    const parts = value.split("-");
    if (parts.length !== 3) return null;

    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // month is 0-indexed
    const year = parseInt(parts[2], 10);

    const date = new Date(year, month, day);
    return isNaN(date.getTime()) ? null : date;
  };

  if (loading) {
    return (
      <div className="w-full h-full flex justify-center items-center p-5">
        <div className="loader">Loading...</div>
      </div>
    );
  }

  if (error && !loading) {
    return (
      <div className="w-full h-full flex justify-center items-center p-5">
        <p className="text-red-500 font-semibold text-center">{error}</p>
      </div>
    );
  }

  if (!checkoutItems && !loading) {
    return (
      <div className="w-full h-full flex justify-center items-center p-5">
        <p className="text-gray-500 text-center">{message}</p>
      </div>
    );
  }
  const formatDateOnly = (value?: string | null) => {
    if (!value) return "";

    const parts = value.split("-");
    if (parts.length !== 3) return "";

    const day = parts[0];
    const month = parts[1];
    const year = parts[2];

    return `${day}-${month}-${year}`;
  };

  return (
    <>
      <div id="datepicker-portal" />

      <div className="w-full mx-auto pt-4 space-y-4 px-4">
        <section className="rounded-2xl overflow-hidden bg-white shadow-[0_0_15px_rgba(0,0,0,0.15)]">
          <div
            className="w-full flex items-center justify-between gradient-blue px-4 py-2 cursor-pointer select-none"
            onClick={() => toggleSection("cart")}
          >
            <div className="flex items-center gap-2">
              <span className="h-6 w-6 rounded-lg gradient-blue text-white text-xs font-bold flex items-center justify-center">
                {stepNumbers.cart}
              </span>
              <span className="font-medium text-white">Cart Summary</span>
            </div>
            <ChevronDown
              className={`h-4 w-4 text-white transition-transform duration-300 ease-in-out ${
                isOpen.cart ? "rotate-180" : "rotate-0"
              }`}
            />
          </div>

          <div
            className={`bg-[#f4f9ff] px-3  transition-all duration-300 ease-in-out overflow-y-auto ${
              isOpen.cart ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            {(checkoutItems?.cartItems?.length ?? 0) &&
              checkoutItems?.cartItems?.map((item, index) => (
                <div
                  key={index}
                  className="rounded-2xl bg-white shadow px-4 pt-3 my-4 pb-3"
                >
                  <p className="font-semibold text-[#005C96]">{item.name}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-baseline gap-2">
                      {parseFloat(item.mrp) > 0 && (
                        <span className="text-xs tx-gray-footer line-through">
                          {formatPrice(item.mrp)}
                        </span>
                      )}
                      <span className="text-xl font-bold text-[#005C96]">
                        {formatPrice(item.price)}
                      </span>
                    </div>

                    <button className="inline-flex items-center rounded-full border border-gray-300 px-3 py-0.5 text-[10px] font-medium text-[#424040] bg-white">
                      {item.line1}
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </section>

        {checkoutItems?.labCollectionStep &&
          Object.keys(checkoutItems?.labCollectionStep).length > 0 && (
            <section className="rounded-2xl overflow-hidden bg-white shadow-[0_0_15px_rgba(0,0,0,0.15)] ">
              <div
                className="w-full flex items-center justify-between gradient-blue px-4 py-2 cursor-pointer select-none"
                onClick={() => toggleSection("lab")}
              >
                <div className="flex items-center gap-2">
                  <span className="h-6 w-6 rounded-lg gradient-blue text-white text-xs font-bold flex items-center justify-center">
                    {stepNumbers.lab}
                  </span>
                  <span
                    className="font-medium line-clamp-1 text-white"
                    title={
                      checkoutItems?.labCollectionStep?.labCollectionHeading
                    }
                  >
                    {checkoutItems?.labCollectionStep?.labCollectionHeading}
                  </span>
                </div>
                <ChevronDown
                  className={`h-4 w-4 text-white transition-transform duration-300 ease-in-out ${
                    isOpen.lab ? "rotate-180" : "rotate-0"
                  }`}
                />
              </div>

              <div
                className={`bg-[#f4f9ff] px-3  transition-all duration-300 ease-in-out overflow-y-auto ${
                  isOpen.lab ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                {checkoutItems?.labCollectionStep?.labCollectionSelection?.map(
                  (lab: Lab) => (
                    <div
                      key={lab.id}
                      className="rounded-2xl bg-white shadow px-4 py-3 my-4 flex items-center justify-between"
                    >
                      <div className="text-[11px] leading-relaxed text-[#424040]">
                        <p className="text-sm font-medium">{lab.name}</p>
                        <p>{lab.address}</p>
                      </div>
                      <div className="relative h-4 w-4 flex items-center justify-center">
                        <input
                          type="radio"
                          name="labSelection"
                          id={`lab-${lab.id}`}
                          value={lab.id}
                          className="h-4 w-4 rounded-full cursor-pointer appearance-none border-2 border-[#323131] focus:ring-0"
                          checked={selectedLab === lab.id}
                          onChange={() => setSelectedLab(lab.id)}
                        />

                        {selectedLab === lab.id && (
                          <span className="absolute h-2 w-2 rounded-full bg-green-500 transition-transform scale-100" />
                        )}
                      </div>
                    </div>
                  ),
                )}
                <div className="my-4">
                  <p className="text-sm font-semibold text-[#424040] mb-1">
                    Choose Date & Preferred Time Slot *
                  </p>
                  <div className="space-y-2">
                    <DatePicker
                      selected={parseDDMMYYYY(selectedLabDate)}
                      onChange={(d: any) => handleDateSelect("lab", d)}
                      open={openDate === "lab"}
                      onClickOutside={() => setOpenDate(null)}
                      dateFormat="dd/MM/yyyy"
                      shouldCloseOnSelect
                      showPopperArrow={false}
                      popperPlacement="bottom-start"
                      portalId="datepicker-portal"
                      wrapperClassName="w-full"
                      minDate={tomorrow}
                      maxDate={maxDate}
                      customInput={
                        <PickerButton
                          placeholderText="Select Date"
                          displayValue={formatDateOnly(selectedLabDate)}
                          icon={<Calendar className="h-4 w-4 text-[#00b266]" />}
                          onOpen={() => setOpenDate("lab")}
                        />
                      }
                    />
                    {/* Time Dropdown */}
                    <div className="relative">
                      <select
                        value={selectedLabTime || ""}
                        onChange={(e) => setSelectedLabTime(e.target.value)}
                        className="flex items-center justify-between rounded-xl bg-white shadow px-3 py-2 cursor-pointer w-full !text-sm text-gray-700 focus:outline-none focus:ring-0 focus:ring-[#00b266] hover:border-green-500 transition-all appearance-none pr-10"
                      >
                        <option value="" disabled>
                          Select Time
                        </option>
                        {labTimeList.map((time, index) => (
                          <option key={index} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                      <Clock
                        className="absolute top-1/2 right-3 transform -translate-y-1/2 text-[#00b266]"
                        size={16}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

        {checkoutItems?.homeCollectionStep &&
          Object.keys(checkoutItems?.homeCollectionStep).length > 0 && (
            <section className="rounded-2xl overflow-hidden bg-white shadow-[0_0_15px_rgba(0,0,0,0.15)] ">
              <div
                className="w-full flex items-center justify-between gradient-blue px-4 py-2 cursor-pointer select-none"
                onClick={() => toggleSection("home")}
              >
                <div className="flex items-center gap-2">
                  <span className="h-6 w-6 rounded-lg gradient-blue text-white text-xs font-bold flex items-center justify-center">
                    {stepNumbers.home}
                  </span>
                  <span className="font-medium text-white">
                    {checkoutItems?.homeCollectionStep?.homeCollectionHeading}
                  </span>
                </div>
                <ChevronDown
                  className={`h-4 w-4 text-white transition-transform duration-300 ease-in-out ${
                    isOpen.home ? "rotate-180" : "rotate-0"
                  }`}
                />
              </div>

              <div
                className={`bg-[#f4f9ff] px-3  transition-all duration-300 ease-in-out overflow-y-auto ${
                  isOpen.home ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                {checkoutItems?.homeCollectionStep?.homeCollectionSelection?.map(
                  (home: Home) => (
                    <div
                      key={home.id}
                      className="rounded-2xl bg-white shadow px-4 py-3 my-4 flex items-center justify-between"
                    >
                      <div className="text-[11px] leading-relaxed text-[#424040]">
                        <div
                          dangerouslySetInnerHTML={{
                            __html: home.name,
                          }}
                          className="text-sm font-medium"
                        />
                      </div>
                      <div className="relative h-4 w-4 flex items-center justify-center">
                        <input
                          type="radio"
                          name="homeSelection"
                          id={`home-${home.id}`}
                          value={home.id}
                          className="h-4 w-4 rounded-full cursor-pointer appearance-none border-2 border-green-500 focus:ring-0"
                          checked={selectedHome === home.id}
                          onChange={() => setSelectedHome(home.id)}
                        />

                        {selectedHome === home.id && (
                          <span className="absolute h-2 w-2 rounded-full bg-green-500 transition-transform scale-100" />
                        )}
                      </div>
                    </div>
                  ),
                )}

                <div className="my-4">
                  <p className="text-sm font-semibold text-[#424040] mb-1">
                    Choose Date & Preferred Time Slot *
                  </p>
                  <div className="space-y-2">
                    {/* Date Dropdown */}
                    <DatePicker
                      selected={parseDDMMYYYY(selectedHomeDate)}
                      onChange={(d: any) => handleDateSelect("home", d)}
                      open={openDate === "home"}
                      onClickOutside={() => setOpenDate(null)}
                      dateFormat="dd/MM/yyyy"
                      shouldCloseOnSelect
                      showPopperArrow={false}
                      popperPlacement="bottom-start"
                      portalId="datepicker-portal"
                      wrapperClassName="w-full"
                      minDate={tomorrow}
                      maxDate={maxDate}
                      customInput={
                        <PickerButton
                          placeholderText="Select Date"
                          displayValue={formatDateOnly(selectedHomeDate)}
                          icon={<Calendar className="h-4 w-4 text-[#00b266]" />}
                          onOpen={() => setOpenDate("home")}
                        />
                      }
                    />

                    {/* Time Dropdown */}
                    <div className="relative">
                      <select
                        value={selectedHomeTime || ""}
                        onChange={(e) => setSelectedHomeTime(e.target.value)}
                        className="flex items-center justify-between rounded-xl bg-white shadow px-3 py-2 cursor-pointer w-full !text-sm text-gray-700 focus:outline-none focus:ring-0 focus:ring-[#00b266] hover:border-green-500 transition-all appearance-none pr-10"
                      >
                        <option value="" disabled>
                          Select Time
                        </option>
                        {homeTimeList.map((time, index) => (
                          <option key={index} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                      <Clock
                        className="absolute top-1/2 right-3 transform -translate-y-1/2 text-[#00b266]"
                        size={16}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

        {/* STEP 3 - Payment Option */}
        <section className="rounded-2xl overflow-hidden bg-white shadow-[0_0_15px_rgba(0,0,0,0.15)]  mb-4">
          <div
            className="w-full flex items-center justify-between gradient-blue px-4 py-2 cursor-pointer select-none"
            onClick={() => toggleSection("payment")}
          >
            <div className="flex items-center gap-2">
              <span className="h-6 w-6 rounded-lg gradient-blue text-white text-xs font-bold flex items-center justify-center">
                {stepNumbers.payment}
              </span>
              <span className="font-medium text-white">
                {checkoutItems?.paymentHeading}
              </span>
            </div>
            <ChevronDown
              className={`h-4 w-4 text-white transition-transform duration-300 ease-in-out ${
                isOpen.payment ? "rotate-180" : "rotate-0"
              }`}
            />
          </div>

          <div
            className={`bg-[#f4f9ff] px-3  transition-all duration-300 ease-in-out overflow-y-auto ${
              isOpen.payment ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="flex flex-col gap-2 my-4">
              {checkoutItems?.payments.map((paymentOptionData, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() =>
                    setPaymentOption(
                      paymentOptionData.paymentValue as
                        | "COD"
                        | "ONLINE"
                        | "RAZORPAY",
                    )
                  }
                  className={`flex-1 flex items-center justify-between rounded-xl px-4 py-2 border ${
                    paymentOption === paymentOptionData.paymentValue
                      ? "border-green-500 bg-[#e5fff2]"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="h-4 w-4 rounded-full border-2 border-green-500 flex items-center justify-center">
                      {paymentOption === paymentOptionData.paymentValue && (
                        <span className="h-2 w-2 rounded-full gradient-green" />
                      )}
                    </span>
                    <span className="text-xs font-semibold">
                      {paymentOptionData.paymentLabel}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>
      </div>

      <section>
        <div className="w-full mx-auto px-4 py-6 space-y-4">
          {checkoutItems?.couponEnterShow === "Yes" &&
            availableCoupons.length > 0 && (
              <div>
                <h2 className="font-semibold text-[#424040] mb-2">Offers</h2>

                {/* Applied Coupon */}
                {appliedCoupon && (
                  <div className="rounded-2xl bg-white shadow px-4 py-4 mb-2">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold tx-gray-footer">
                        '{appliedCoupon}' applied
                      </p>
                      <button
                        type="button"
                        onClick={removeCoupon}
                        className="text-sm font-semibold text-[#ff4b4b]"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )}

                {/* Available Coupons */}
                {!appliedCoupon &&
                  availableCoupons
                    .slice(0, showAllCoupons ? availableCoupons.length : 1)
                    .map((coupon, index) => (
                      <div
                        key={index}
                        className="rounded-2xl bg-white shadow-[0_0_15px_rgba(0,0,0,0.15)] px-4 py-3 mb-2"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <img src="/assets/svg/discount.svg" alt="" />
                            <p className="font-semibold tx-gray-footer">
                              '{coupon.code}'
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => applyCoupon(coupon.code)}
                            className="rounded-full gradient-green px-4 py-1 text-sm font-semibold text-white shadow hover:shadow-lg"
                          >
                            Apply
                          </button>
                        </div>

                        <p className="mt-1.5 text-sm tx-gray-footer">
                          {coupon.msg}
                        </p>
                      </div>
                    ))}

                {/* View All / Less */}
                {!appliedCoupon && coupons.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setShowAllCoupons(!showAllCoupons)}
                    className="w-full text-center text-sm font-semibold tx-gray-footer border-t border-gray-200 pt-2 flex justify-center items-center hover:text-gray-700"
                  >
                    {showAllCoupons
                      ? "Show less"
                      : `View all ${coupons.length} coupons`}
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </button>
                )}
              </div>
            )}

          <div>
            <p className="font-semibold text-[#424040] mb-2 mt-2">
              Payment Summary
            </p>

            <div className="rounded-2xl bg-white shadow-[0_0_15px_rgba(0,0,0,0.15)]  px-4 py-3">
              <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                <p className="font-semibold tx-gray-footer">Total MRP</p>
                <p className="font-semibold tx-gray-footer">
                  ₹{checkoutItems?.allTotals?.subtotal}/-
                </p>
              </div>

              <div className="mt-2 space-y-1.5 text-sm">
                <div className="flex items-center justify-between">
                  <p className="text-[#05AF79] font-medium">Discount on MRP</p>
                  <p className="text-[#05AF79] font-medium">-₹0/-</p>
                </div>

                {couponDiscount > 0 && (
                  <div className="flex items-center justify-between border-t pt-3 border-gray-200">
                    <p className="text-[#05AF79] font-medium">
                      Coupon Discount
                    </p>
                    <p className="text-[#05AF79] font-medium">
                      -₹{couponDiscount}/-
                    </p>
                  </div>
                )}

                {/* <div className="flex items-center justify-between ">
                  <div className="tx-gray-footer">
                    <p className="font-medium">Collection Charges</p>
                    <p className="text-xs tx-gray-footer">
                      Free Collection on order above MRP 350
                    </p>
                  </div>
                  <div className="text-right flex gap-1 items-center">
                    <p className="text-sm font-medium text-[#05AF79]">Free</p>
                  </div>
                </div> */}
              </div>

              <div className="mt-3 py-2 border-t border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <p className="font-semibold tx-gray-footer ml-1">To Pay</p>
                </div>
                <p className="font-semibold tx-gray-footer text-xl">
                  ₹{toPayAmount}/-
                </p>
              </div>
              {paymentOption !== "COD" && minAdvanceAmount > 0 && (
                <>
                  <div className="flex items-center flex-wrap justify-between gap-5  border-t border-gray-200  bg-white pt-3">
                    {/* Header */}
                    <div className="flex flex-col gap-1 mb-2 flex-shrink-0">
                      <p className="font-semibold text-[#424040]">
                        Advance Payment
                      </p>
                      <p className="text-xs text-green-600 font-medium">
                        Minimum Amount ₹{minAdvanceAmount}
                      </p>
                    </div>

                    <div className="relative w-full max-w-40 rounded-md border border-gray-300 bg-white px-3 py-2 focus-within:border-[#05AF79] focus-within:ring-1 focus-within:ring-[#05AF79]">
                      <label className="absolute -top-2 left-2 bg-white px-1 text-xs text-gray-500">
                        Enter Advance Amount
                      </label>

                      <input
                        type="number"
                        min={minAdvanceAmount}
                        max={toPayAmount}
                        value={advanceAmount}
                        onChange={handleAdvanceChange}
                        className="w-full outline-none text-sm text-gray-700 pt-1"
                      />
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <p className="font-medium tx-gray-footer ml-1">
                        Balance Due Before Test
                      </p>
                    </div>
                    <p className="font-semibold tx-gray-footer text-xl">
                      ₹{balanceDue}/-
                    </p>
                  </div>
                  {advanceError && (
                    <p className="text-xs text-red-500 mt-1 font-medium">
                      {advanceError}
                    </p>
                  )}
                </>
              )}
            </div>

            <div className="flex justify-center mt-5">
              <button
                type="button"
                onClick={handlePayNowClick}
                disabled={orderLoading}
                className="bg-gradient-to-r from-[#05AF79] to-[#0ECE91] 
             text-white font-semibold px-6 py-2 rounded-md w-full 
             disabled:opacity-60"
              >
                {orderLoading
                  ? "Processing..."
                  : paymentOption === "COD"
                    ? "BOOK NOW"
                    : "PAY NOW"}
              </button>
            </div>
            {validationError && (
              <p className="text-red-500 text-sm mt-4 mb-2 font-medium text-center">
                {validationError}
              </p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
