"use client";

import paymentService from "@/services/paymentService";
import { CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

type Props = {
  type: "success" | "failed";
  trackingId?: string;
};

export default function PaymentStatus({ type, trackingId }: Props) {
  const isSuccess = type === "success";
  const [loading, setLoading] = useState(true);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [paymentFailed, setPaymentFailed] = useState(false);

  const fetchPaymentDetail = async () => {
    if (!trackingId) {
      setPaymentFailed(true);
      return;
    }

    try {
      setLoading(true);

      const payload = {
        view: "pay_now_get_transaction",
        id: trackingId,
      };

      const response = await paymentService.getPaymentInfoByStatus(payload);
      if (response?.result === "success" && response?.msgCode === "1") {
        setPaymentData(response?.data);
      } else if (response?.msgCode === "0") {
        setPaymentFailed(true);
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err || "Error Fetching transaction information!");
      setPaymentFailed(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentDetail();
  }, [trackingId]);

  if (paymentFailed) {
    return (
      <div className="p-5">
        {/* Status Banner */}
        <div className="w-full text-red-600 px-4 py-4 rounded-md mb-2 flex items-center gap-2 bg-red-50">
          <div className="w-8 h-8">
            <XCircle className="w-8 h-8" />
          </div>
          <span className="text-sm">
            We encountered an issue retrieving your payment details. Please
            ensure your transaction is completed correctly and try again.
          </span>
        </div>

        {/* Retry Payment */}
        <div className="text-center pt-4">
          <Link href="/paynow">
            <button className="mt-4 bg-red-600 text-white px-4 py-2 rounded">
              Retry Payment
            </button>
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-10">
        Loading Transaction Information...
      </div>
    );
  }

  return (
    <div className="p-5">
      {/* Status Banner */}
      <div
        className={`w-full text-white px-4 py-4 rounded-md mb-2 flex items-center gap-2 ${
          isSuccess ? "bg-green-600" : "bg-red-600"
        }`}
      >
        {isSuccess ? (
          <CheckCircle className="w-8 h-8" />
        ) : (
          <XCircle className="w-8 h-8" />
        )}

        <span className="font-medium">
          {isSuccess
            ? "Your payment was successful!"
            : "Your payment is failed!"}
        </span>
      </div>

      {/* Transaction Info */}
      <h3 className="font-semibold text-xl py-4">Transaction Information</h3>

      <div className="shadow-[0_0_15px_rgba(0,0,0,0.15)] rounded-xl p-4">
        <div className="grid grid-cols-1 gap-4 text-sm text-gray-600">
          <div className="border-b border-neutral-200 pb-4 flex flex-col gap-1">
            <p className="font-normal text-neutral-600">Tracking ID</p>
            <p className="text-black text-base font-bold">
              {paymentData?.payment_id || "-"}
            </p>
          </div>

          <div className="border-b border-neutral-200 pb-4 flex flex-col gap-1">
            <p className="font-normal text-neutral-600">Transaction Status</p>
            <p className={`font-medium text-base`}>
              {paymentData?.order_pay_status || isSuccess
                ? "Success"
                : "Cancel"}
            </p>
          </div>

          <div className="flex flex-col gap-1">
            <p className="font-normal text-neutral-600">Transaction Amount</p>
            <p className="text-black text-lg font-bold">
              ₹ {paymentData?.amount || 0}
            </p>
          </div>
        </div>
      </div>

      {isSuccess && (
        <div className="text-center pt-4">
          <Link href="/">
            <button className="mt-4 bg-green-600 text-white px-4 py-2 rounded">
              Go to Dashboard
            </button>
          </Link>
        </div>
      )}

      {!isSuccess && (
        <div className="text-center pt-4">
          <Link href="/paynow">
            <button className="mt-4 bg-red-600 text-white px-4 py-2 rounded">
              Retry Payment
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}
