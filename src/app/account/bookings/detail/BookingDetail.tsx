"use client";

import React, { useState, useEffect } from "react";
import {
  MapPin,
  ChevronDown,
  ArrowLeft,
  X,
  Calendar,
  Clock,
} from "lucide-react";
import { useOrderDetail } from "@/hooks/useOrderDetails";
import { useUser } from "@/context/userContext";
import { getDeviceType } from "@/utils/device";
import requests from "@/lib/httpServices";
import { toast } from "react-toastify";

const OrderDetail: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"patient" | "lab">("patient");
  const [showPackageDetails, setShowPackageDetails] = useState(false);
  const [isCancel, setIsCancel] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>("params");
  const { user } = useUser();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelRemark, setCancelRemark] = useState("");
  const [orderStatus, setOrderStatus] = useState<string | null>(null);

  const toggleDropdown = (id: string) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    const storedOrderId = localStorage.getItem("selectedOrderId");
    setOrderId(storedOrderId);
  }, []);

  const { orderDetail, loading, error } = useOrderDetail(orderId || "");

  useEffect(() => {
    if (orderDetail?.orderMasterData?.status) {
      setOrderStatus(orderDetail.orderMasterData.status);
    }
  }, [orderDetail]);

  const submitCancelOrder = async () => {
    setIsCancel(true);

    try {
      const payload = {
        view: "order_cancel",
        userID: user?.userID || "",
        deviceType: getDeviceType(),
        userPhone: user?.userPhone || "",
        remark: cancelRemark,
        orderID: orderId,
      };

      const response = await requests.post("/webApi/index.php", payload);

      if (response?.msgCode === "1") {
        setShowCancelModal(false);
        setCancelRemark("");
        setOrderStatus("Cancelled");
        toast.success(
          response?.message || "Order has been cancelled successfully.",
        );
      } else {
        toast.error(response?.message || "Failed to cancel order.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsCancel(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  if (!orderDetail) return <p>No order details available</p>;

  const { orderMasterData, labData, collectionAddress, orderItemData } =
    orderDetail;
  const patient = orderItemData[0];

  return (
    <div className="max-w-screen mx-auto bg-[#f2f2f2] font-sans text-[#2D3134] relative overflow-hidden">
      {/* Header Info */}
      <div className="bg-white px-4 py-3 border-b border-gray-100">
        <div className="flex justify-between mb-2">
          <span className="text-gray-600 text-sm font-medium">Order Date:</span>
          <span className="text-[#1A1C1E] text-sm font-semibold">
            {orderMasterData.order_date}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 text-sm font-medium">
            Payment Type:
          </span>
          <span className="text-[#1A1C1E] text-sm font-semibold uppercase">
            {orderMasterData.payment_type}
          </span>
        </div>
      </div>

      {/* Tabs Container */}
      <div className="bg-white mt-3 border-t border-b border-gray-100">
        <div className="flex border-b border-gray-100">
          <button
            onClick={() => setActiveTab("patient")}
            className={`flex-1 py-3 text-center text-[15px] font-bold transition-all duration-200 ${
              activeTab === "patient"
                ? "text-[#005E9C] border-b-2 border-[#005E9C]"
                : "text-gray-500 border-b-2 border-transparent"
            }`}
          >
            Patient Info
          </button>
          <button
            onClick={() => setActiveTab("lab")}
            className={`flex-1 py-3 text-center text-[15px] font-bold transition-all duration-200 ${
              activeTab === "lab"
                ? "text-[#005E9C] border-b-2 border-[#005E9C]"
                : "text-gray-500 border-b-2 border-transparent"
            }`}
          >
            Lab Info
          </button>
        </div>

        <div className="p-4 min-h-[160px]">
          {activeTab === "patient" ? (
            <div className="animate-in fade-in duration-300">
              <h3 className="font-bold text-[#1A1C1E] text-[15px] mb-2">
                {patient.customer_members_prefix}{" "}
                {patient.customer_members_first_name}{" "}
                {patient.customer_members_last_name}
              </h3>
              <div className="bg-[#E2F2FF] p-3 rounded-md mb-4 border border-[#D0E8FB]">
                <p className="text-[#1A1C1E] text-sm font-bold">
                  {patient.customer_members_age} |{" "}
                  {patient.customer_members_relation}
                </p>
                <p className="text-gray-500 text-[13px] mt-0.5">
                  {patient.customer_members_line1},{" "}
                  {patient.customer_members_area} -{" "}
                  {patient.customer_members_pincode}
                </p>
              </div>

              <div
                onClick={() => setShowPackageDetails(true)}
                className="border border-gray-200 rounded-lg p-4 relative cursor-pointer active:bg-gray-50 transition-colors"
              >
                <div className="pr-8">
                  <h4 className="text-[#003B65] font-bold text-[13px] leading-tight uppercase">
                    {orderItemData[0].order_item_name}
                  </h4>
                  <p className="text-gray-400 text-xs mt-1">
                    Includes {orderItemData[0].order_item_test_count} Tests
                  </p>
                  <p className="text-[#1A1C1E] font-bold text-lg mt-1">
                    ₹ {orderMasterData.total_amount}
                  </p>
                </div>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
            </div>
          ) : (
            <div className="animate-in fade-in duration-300">
              <h3 className="font-bold text-[#1A1C1E] text-[15px] mb-3">
                {patient.customer_members_prefix}{" "}
                {patient.customer_members_first_name}{" "}
                {patient.customer_members_last_name}
              </h3>
              <div className="flex gap-3 items-start mb-2">
                <div className=" p-1 rounded-full ">
                  <MapPin className="tx-green" size={20} />
                </div>
                <p className="text-gray-600 text-[13px] leading-relaxed">
                  {labData?.lab_address ? (
                    <span>{labData.lab_address}</span>
                  ) : (
                    <span>
                      {collectionAddress.address}, {collectionAddress.area},{" "}
                      {collectionAddress.pincode}, {collectionAddress.city_name}
                      , {collectionAddress.state_name}
                    </span>
                  )}
                </p>
              </div>
              <div className="flex gap-3 items-start">
                <div className=" p-1 rounded-full">
                  {collectionAddress.collection_date && (
                    <Calendar className="tx-green" size={20} />
                  )}
                </div>
                <p className="text-gray-600 text-[15px] leading-relaxed">
                  <span className="pr-3">
                    {collectionAddress.collection_date}
                  </span>
                  {collectionAddress.collection_time && (
                    <Clock className="tx-green inline-block ps-1 " />
                  )}
                  <span className="pl-3">
                    {collectionAddress.collection_time}
                  </span>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Order Details Section */}
      <div className="bg-white mt-4 p-4 border-t border-gray-100">
        <h2 className="text-[#1A1C1E] font-bold text-base mb-4">
          Order Details
        </h2>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 text-sm">Subtotal</span>
            <span className="text-[#1A1C1E] font-bold text-sm">
              ₹ {orderMasterData.subtotal}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 text-sm">Collection Charges</span>
            <span className="text-[#1A1C1E] font-bold text-sm">
              ₹ {orderMasterData.collection_charge}
            </span>
          </div>
          <div className="border-t border-gray-100 my-2 pt-3 flex justify-between items-center">
            <span className="text-[#1A1C1E] font-bold text-sm">
              Total Amount
            </span>
            <span className="text-[#1A1C1E] font-bold text-base">
              ₹ {orderMasterData.total_amount}
            </span>
          </div>
          <div className="border-t border-gray-100 my-2 pt-3 flex justify-between items-center">
            <span className="text-[#1A1C1E] font-medium text-sm">
              Total Paid
            </span>
            <span className="text-[#1A1C1E] font-bold text-base">
              ₹ {orderMasterData.total_paid_amount}
            </span>
          </div>
          <div className="border-t border-gray-100 my-2 pt-3 flex justify-between items-center">
            <span className="text-[#1A1C1E] font-medium text-sm">
              Balance Due Before Test
            </span>
            <span className="text-[#1A1C1E] font-bold text-base">
              ₹ {orderMasterData.due_amount}
            </span>
          </div>
        </div>
      </div>

      {orderStatus === "Pending" && (
        <div>
          <button
            onClick={() => setShowCancelModal(true)}
            className="bg-red-500 w-full text-white py-2 px-8 rounded-lg font-semibold hover:bg-red-600 transition-colors"
          >
            Cancel
          </button>
        </div>
      )}

      {/* --- PACKAGE DETAILS BOTTOM SHEET --- */}
      {showPackageDetails && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-40 transition-opacity"
            onClick={() => setShowPackageDetails(false)}
          />

          <div className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-[24px] max-w-md mx-auto animate-in slide-in-from-bottom duration-400 ease-out h-[92vh] flex flex-col shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100 sticky top-0 bg-white z-10 rounded-t-[24px]">
              <div className="flex items-center gap-3">
                <ArrowLeft
                  className="w-6 h-6 text-gray-700 cursor-pointer"
                  onClick={() => setShowPackageDetails(false)}
                />
                <h2 className="text-xl font-bold text-gray-800">
                  Package Details
                </h2>
              </div>
              <X
                className="w-6 h-6 text-gray-700 cursor-pointer"
                onClick={() => setShowPackageDetails(false)}
              />
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto flex-1 pb-10">
              {/* Package Name */}
              <h1 className="text-2xl font-bold text-[#2D3134] leading-tight mb-4">
                {orderItemData[0].packageDetails.name}
              </h1>

              {/* Inclusion Badge - Matches Image Style */}
              <div className="mb-6">
                <span className="inline-block border-2 border-[#1160A5]  text-[#1160A5] px-4 py-1.5 rounded-lg font-bold text-[14px]">
                  Inclusions : {orderItemData[0].packageDetails.inclusion} tests
                </span>
              </div>

              {/* Package Description (Categories) */}
              <p className="text-gray-500 text-[13px] uppercase leading-relaxed font-medium mb-8">
                {orderItemData[0].packageDetails.item_description}
              </p>

              {/* Sub-heading */}
              <div className="mb-4">
                <h3 className="text-lg font-bold text-[#2D3134]">
                  Test Parameters
                </h3>
                <p className="text-sm text-gray-500">
                  Helps you know your test better
                </p>
              </div>

              {/* --- Accordion Section --- */}
              <div className="border-t border-gray-100">
                {orderItemData[0].packageDetails.test_parameters.map(
                  (param: any, idx: number) => (
                    <div key={idx} className="border-b border-gray-100">
                      <button
                        onClick={() => toggleDropdown(param.question)}
                        className="w-full flex justify-between items-center py-4 text-left group"
                      >
                        <span className="text-[#2D3134] font-bold text-[15px] uppercase">
                          {param.question}
                        </span>
                        <ChevronDown
                          className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
                            openDropdown === param.question ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {/* Expandable Content with HTML rendering */}
                      <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${
                          openDropdown === param.question
                            ? "max-h-[1000px] pb-4 opacity-100"
                            : "max-h-0 opacity-0"
                        }`}
                      >
                        <div className="text-sm text-gray-700 space-y-1 px-1">
                          {param.details && param.details.length > 0 ? (
                            param.details.map(
                              (htmlContent: string, i: number) => (
                                <div
                                  key={i}
                                  className="package-detail-html"
                                  dangerouslySetInnerHTML={{
                                    __html: htmlContent,
                                  }}
                                />
                              ),
                            )
                          ) : (
                            <p className="italic text-gray-400">
                              No additional details available.
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {showCancelModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end justify-center">
          {/* MODAL CONTAINER */}
          <div className="w-full max-w-[430px] bg-white rounded-t-2xl p-4">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-bold">Remark</h2>
              <button onClick={() => setShowCancelModal(false)}>
                <X />
              </button>
            </div>

            <textarea
              className="w-full border border-neutral-300 focus:outline-none focus-within:ring-1 focus-within:border-[#1160A5] focus-within:ring-[#1160A5] rounded-md p-2 h-28"
              value={cancelRemark}
              onChange={(e) => setCancelRemark(e.target.value)}
              placeholder="Enter remark"
            />

            <button
              onClick={submitCancelOrder}
              className="bg-[#1160A5] w-full text-white font-bold py-2 mt-3 rounded-lg"
              disabled={isCancel}
            >
              {isCancel ? "submitting..." : "Submit"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetail;
