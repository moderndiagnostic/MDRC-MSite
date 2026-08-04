"use client";

import { useEffect, useState } from "react";
import { ArrowRight, CircleX } from "lucide-react";
import Link from "next/link";
import requests from "@/lib/httpServices";
import { useParams } from "next/navigation";
import { useUser } from "@/context/userContext";
import { useCity } from "@/context/CityContext";

const PaymentSuccess = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [paymentData, setPaymentData] = useState<any>(null);
  const { user } = useUser();
  const { cityDetails } = useCity();

  const paymentId =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("paymentID")
      : null;

  // Fetch payment data when the component mounts
  useEffect(() => {
    if (!user && !paymentId && !orderId) return;

    const fetchPaymentData = async () => {
      try {
        const response = await requests.post("/webApi/index.php", {
          view: "payment_success",
          orderID: orderId,
          userID: user?.userID,
          orderPayID: paymentId,
        });
        setPaymentData(response?.data || response?.result);
      } catch (error) {
        console.error("Failed to fetch payment data:", error);
      }
    };

    fetchPaymentData();
  }, [orderId, user, paymentId]);

  if (!paymentData) return <div className="py-10 text-center">Loading...</div>;

  if (!paymentData?.bookingSummary) {
    return <div className="py-10 text-center">Loading payment details...</div>;
  }

  const {
    bookingSummary,
    orderItemData,
    labData,
    paymentData: paymentDetails,
    collectionAddress,
  } = paymentData;

  const isHomeCollection =
    Boolean(collectionAddress?.collection_date?.trim()) &&
    Boolean(collectionAddress?.collection_time?.trim()) &&
    Boolean(collectionAddress?.address);

  const titleLabel = isHomeCollection
    ? "Sample Collection Date & Time"
    : "Lab Visit Details";

  const primaryLine = isHomeCollection
    ? collectionAddress?.collection_date
    : labData?.collection_date;

  const secondaryLine = isHomeCollection
    ? collectionAddress?.collection_time
    : labData?.collection_time;

  const addressLabel = isHomeCollection
    ? "Sample Collection Address"
    : "Lab Address";

  const addressValue = isHomeCollection
    ? collectionAddress?.address
    : labData?.lab_address;

  if (!paymentData?.bookingSummary) {
    return (
      <div className="min-h-screen bg-gray-100 px-4 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-6 text-center max-w-sm w-full">
          <div className=" flex justify-center">
            <CircleX className="w-20 h-20 text-red-500 " />
          </div>
          <h2 className="text-lg font-semibold text-gray-800">
            Payment Not Successful
          </h2>

          <p className="text-sm text-gray-500 mt-2">
            We could not confirm your payment. If amount was deducted, it will
            be refunded within 3–5 working days.
          </p>

          <div className="mt-6 flex flex-col gap-3">
            <Link href="/checkout">
              <button className="w-full gradient-blue text-white px-4 py-2 rounded-md">
                Try Again
              </button>
            </Link>

            <Link href="/account/bookings">
              <button className="w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-md">
                Go to My Bookings
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 px-4 pb-8 pt-4">
      {/* SUCCESS HEADER */}
      <div
        className={`mt-4 ${paymentDetails?.payment_status === "Failed" ? "bg-red-600" : "bg-[#005C96]"} text-white rounded-lg px-4 py-3 flex items-center gap-2`}
      >
        <>
          {paymentDetails?.payment_status === "Failed" ? (
            <CircleX className="w-6 h-6 text-white" />
          ) : (
            <img src="/assets/images/payment/paymentsuccess.svg" alt="" />
          )}

          {paymentDetails?.payment_status === "Failed" ? (
            <p className="font-medium text-sm">Payment Failed!</p>
          ) : (
            <p className="font-medium text-sm">
              {" "}
              <p className="font-medium text-sm">
                Your booking successfully confirmed!
              </p>
            </p>
          )}
        </>
      </div>

      {/* BOOKING SUMMARY */}
      <h2 className="mt-5 font-semibold text-gray-800">Booking Summary</h2>

      <div className="bg-white rounded-lg shadow-md mt-3 py-4 grid grid-cols-3 text-sm text-center">
        <div>
          <p className="text-gray-500">Booking Id</p>
          <p className="font-semibold">{bookingSummary.order_no}</p>
        </div>
        <div>
          <p className="text-gray-500">Booking Date</p>
          <p className="font-semibold">{bookingSummary.order_date}</p>
        </div>
        <div>
          <p className="text-gray-500">Grand Total</p>
          <p className="font-semibold">₹{bookingSummary.grand_total}</p>
        </div>
      </div>

      {/* BOOKING DETAILS */}
      <div className="flex items-center justify-between mt-6">
        <h2 className="font-semibold text-gray-800">Booking Details</h2>
        {/* <button className="border border-gray-400 px-4 py-1 text-sm rounded">
          Cancel Booking
        </button> */}
      </div>

      {/* COLLECTION / LAB CARD – SAME DESIGN */}
      <div className="bg-white rounded-lg shadow-md mt-3 p-4 space-y-4">
        <div className="flex items-start gap-3">
          <div className="px-4 py-2 bg-[#F5F5F5] rounded">
            <img
              src="/assets/images/payment/calendar.svg"
              alt="Icon"
              className="h-10 w-10"
            />
          </div>

          <div>
            <p className="text-sm mb-2">{titleLabel}</p>

            {primaryLine && (
              <p className="font-semibold text-sm">{primaryLine}</p>
            )}

            {secondaryLine && (
              <p className="font-semibold text-sm">{secondaryLine}</p>
            )}
          </div>
        </div>

        <div className="flex items-start gap-3 pt-3">
          <div className="px-4 py-2 bg-[#F5F5F5] rounded">
            <img
              src="/assets/images/payment/location.svg"
              alt="Location Icon"
              className="h-10 w-10"
            />
          </div>

          <div>
            <p className="mb-2 text-sm">{addressLabel}</p>
            <p className="font-semibold text-sm mt-2">{addressValue}</p>

            {/* {!isHomeCollection && (
              <>
                {labData?.lab_phone && (
                  <p className="text-sm mt-1">📞 {labData.lab_phone}</p>
                )}
                {labData?.lab_email && (
                  <p className="text-sm">✉️ {labData.lab_email}</p>
                )}
              </>
            )} */}
          </div>
        </div>
      </div>

      {/* TEST DETAILS */}
      <div className="bg-white rounded-lg shadow-md mt-5 p-4">
        <div className="flex justify-between items-start">
          <div>
            <p className="font-semibold text-[#005C96]">
              {orderItemData[0]?.order_item_name}
            </p>

            <span className="flex items-center space-x-2">
              <p className="text-sm text-[#005C96] mt-2 font-semibold">
                ₹{orderItemData[0]?.price}/-
              </p>
              <div className="border border-neutral-300 text-gray-500 text-xs rounded-xl px-2 mt-1">
                Includes {orderItemData[0]?.order_item_test_count} Parameters
              </div>
            </span>
          </div>
        </div>

        <div className="mt-3 bg-[#E6F8FF] text-sm-[#808080] font-light px-3 py-2 rounded ">
          {orderItemData[0]?.customer_members_prefix}{" "}
          {orderItemData[0]?.customer_members_first_name}{" "}
          {orderItemData[0]?.customer_members_last_name} |{" "}
          {orderItemData[0]?.customer_members_gender}
        </div>
      </div>

      {/* PAYMENT INFORMATION */}
      <h2 className="mt-6 font-semibold text-gray-800">Payment Information</h2>

      <div className="bg-[#F6FCFF] rounded-lg shadow-md mt-3 p-4 text-sm space-y-2 font-light">
        <Row label="Payment Type" value={paymentDetails?.payment_type} />
        <Row label="Payment By" value={paymentDetails?.payment_type} />

        <Row
          label="Order Amount"
          value={`₹${paymentDetails?.subtotal}/-`}
          valueClass="font-light"
        />

        <div className="flex justify-between border-b border-gray-300 pb-2 ">
          <span className="text-green-600 text-sm">Coupon Discount</span>
          <span className="font-medium text-green-600 text-sm">
            -₹{paymentDetails?.discount}/-
          </span>
        </div>

        <div className="flex justify-between border-b border-gray-300 pb-2">
          <div>
            <span className="text-green-600 text-sm">Collection Charges</span>
            <br />
            <span className="text-green-600 text-[11px]">
              Free Collection on order above MRP 350
            </span>
          </div>
          <span className="font-medium text-green-600 text-sm">
            {paymentDetails?.collection_charge}
          </span>
        </div>

        {/* <Row
          label="Total Paid Amount"
          value={`₹${paymentDetails?.wallet_amount}`}
        /> */}

        <div className="pt-1 flex justify-between font-semibold text-lg">
          <span className="font-normal text-gray-700">Total Amount</span>
          <span className="font-semibold text-gray-900">
            ₹{paymentDetails?.total_amount}
          </span>
        </div>
        <div className="pt-1 flex justify-between font-semibold text-sm">
          <span className="font-normal text-gray-700">Paid Amount</span>
          <span className="font-semibold text-gray-900">
            ₹{paymentDetails?.total_paid_amount.toFixed(2)}
          </span>
        </div>
        <div className="pt-1 flex justify-between font-semibold text-sm">
          <span className="font-normal text-gray-700">
            Balance Due Before Test
          </span>
          <span className="font-semibold text-gray-900">
            ₹{paymentDetails?.due_amount.toFixed(2)}
          </span>
        </div>
      </div>

      {/* MY BOOKING BUTTON */}
      <div className="flex justify-center gap-4 flex-wrap mt-6">
        <Link href="/account/bookings">
          <button className="gradient-blue text-white px-4 py-2 rounded-md flex items-center gap-2">
            My Booking
            <span className="bg-white rounded-sm p-[1px] mt-0.5">
              <ArrowRight color="#005C96" size={14} />
            </span>
          </button>
        </Link>
        <Link href="/">
          <button className=" text-[#005C96] border-[#005C96] border px-4 py-2 rounded-md flex items-center gap-2">
            Book Another Test
          </button>
        </Link>
      </div>

      {/* Download App */}
      <section className="my-8 px-0">
        <Link href={`/tests/mri-left-knee-joint/${cityDetails?.slug}`}>
          <div className="flex items-center justify-between gradient-green rounded-2xl px-5 py-4 shadow-lg">
            <div>
              <p className="text-white font-medium text-base">Need Help?</p>
              <span className="text-white font-sm">
                Have Any Issue With Booking
              </span>
            </div>
            <div className="relative flex items-center justify-center">
              {/* Pulse ring */}
              <span className="absolute inline-flex h-12 w-12 rounded-full bg-white opacity-30 animate-ping"></span>

              {/* Icon container */}
              <div className="relative  rounded-full h-14 w-14 flex items-center justify-center shadow-[0_0_15px_rgba(0,0,0,0.15)] ">
                <img
                  src="/assets/images/logo/whatsapp.svg"
                  alt="WhatsApp"
                  className="h-12 w-12"
                />
              </div>
            </div>
          </div>
        </Link>
      </section>
    </div>
  );
};

const Row = ({
  label,
  value,
  valueClass = "",
}: {
  label: string;
  value: string;
  valueClass?: string;
}) => {
  return (
    <div className="flex justify-between border-b border-gray-300 pb-2 last:border-none">
      <span className="text-gray-600">{label}</span>
      <span className={valueClass}>{value}</span>
    </div>
  );
};

export default PaymentSuccess;
