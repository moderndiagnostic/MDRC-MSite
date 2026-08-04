"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useOrders } from "@/hooks/useOrders";
import AccountMenu from "@/components/AccountMenu";
import { useUser } from "@/context/userContext";

interface Order {
  id: string; // Used for the URL/Key (e.g., "2409")
  displayId: string; // Used for the UI text (e.g., "MD2409")
  bookingDate: string;
  paymentType: string;
  status: string;
  totalAmount: number;
  orderQuantity: number;
}

const OrderCard = ({ order }: { order: Order; index: number }) => {
  const handleOrderClick = (orderId: string) => {
    localStorage.setItem("selectedOrderId", orderId);
  };

  return (
    <Link
      href="/account/bookings/detail"
      className="block"
      onClick={() => handleOrderClick(order.id)}
    >
      <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-5 border border-gray-100 text-[#424040]">
        <div className="bg-[#E6F8FF] px-5 rounded-xl py-3 border-b border-gray-100">
          <h3 className="text-xl font-bold text-[#424040]">
            Order ID: {order.displayId}
          </h3>
        </div>

        <div className="p-5">
          {/* <div className="mb-4 pb-1 border-b-2 border-[#10B981] inline-block">
            <h4 className="text-xl font-bold text-[#424040]">Harsh Kumar</h4>
          </div> */}

          <div className="space-y-3 text-base">
            <div className="flex justify-between">
              <span className="text-[#727070]">Total Amount:</span>
              <span>₹{order.totalAmount}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-[#727070]">Quantity:</span>
              <span>{order.orderQuantity}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-[#727070]">Order Date:</span>
              <span>{order.bookingDate}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-[#727070]">Payment Type:</span>
              <span>{order.paymentType}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-[#727070]">Status:</span>
              <span>{order.status}</span>
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            <button className="flex-1 bg-gradient-to-r from-[#05AF79] to-[#0ECE91] text-white font-bold py-3 px-2 rounded-2xl text-xs">
              Booking Summary
            </button>
            {/* <button className="flex-1 bg-white border-2 border-[#10B981] text-[#10B981] font-bold py-3 px-2 rounded-2xl text-xs">
              Pay Now
            </button> */}
          </div>
        </div>
      </div>
    </Link>
  );
};

/* ===== PAGE ===== */
export default function OrdersPage() {
  const { orders, loading, fetchOrders, page, hasMore } = useOrders();
  const { user } = useUser();

  const [authUser, setUser] = useState<{
    name: string;
    email: string;
    phone: string;
    userImage: string;
  }>({
    name: "",
    email: "",
    phone: "",
    userImage: "",
  });

  useEffect(() => {
    setUser({
      name:
        `${user?.userFirstName || ""} ${user?.userLastName || ""}`.trim() ||
        "User",
      email: user?.userEmail || "",
      phone: user?.userPhone || "",
      userImage: user?.userImage,
    });
  }, [user]);

  useEffect(() => {
    fetchOrders({ page: 0 });
  }, []);

  const loadMore = () => {
    if (!hasMore || loading) return;

    fetchOrders({
      page: page + 1,
      append: true,
    });
  };

  /* ===== MAP API → UI (ONLY LOGIC CHANGE) ===== */
  const mappedOrders: Order[] = orders.map((o: any) => {
    // Extract values specifically from the itemList array provided by the API
    const displayId =
      o.itemList?.find((i: any) => i.title === "Booking ID")?.value ?? o.id;
    const bookingDate =
      o.itemList?.find((i: any) => i.title === "Booking date")?.value ?? "";
    const paymentType =
      o.itemList?.find((i: any) => i.title === "Payment Type")?.value ?? "";

    return {
      id: o.id,
      displayId: displayId,
      bookingDate,
      paymentType,
      status: o.orderStatus,
      totalAmount: Number(o.orderAmount),
      orderQuantity: Number(o.orderQuantity),
    };
  });

  return (
    <div>
      <div className="w-100% bg-gray-50 p-4">
        {/* User Profile Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
          <div className="bg-gradient-to-b from-[#005C96] to-[#15AEE5] text-white p-6 min-h-[160px] flex flex-col justify-center">
            <div className="flex items-center gap-5">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                {authUser?.userImage ? (
                  <img
                    src={authUser?.userImage}
                    alt="User Avatar"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <span className="text-5xl font-bold text-gray-700">
                    {authUser?.name.charAt(0)}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <div>
                  <h1 className="text-xl font-semibold leading-none">
                    {authUser?.name}
                  </h1>
                  {authUser?.email && <p className="mt-1">{authUser?.email}</p>}
                  {authUser?.phone && (
                    <p className="font-semibold">
                      <span className="font-normal">Phone:</span> +91{" "}
                      {authUser?.phone}
                    </p>
                  )}
                </div>

                <div className="mt-1">
                  <Link href="/account/profile">
                    <button className="border-2 border-white px-5 py-1.5 rounded-md font-semibold text-xs tracking-widest uppercase">
                      EDIT INFO
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <AccountMenu />
        </div>

        {/* Booking Summary Header */}
        <div className="mb-6">
          <div className="bg-[#1160A5] text-white py-4 px-6 rounded-2xl shadow-xl">
            <h2 className="text-xl font-semibold text-center">
              Booking Summary
            </h2>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-2">
          {loading && (
            <p className="text-center text-gray-500">Loading orders...</p>
          )}

          {mappedOrders.map((order, index) => (
            <OrderCard
              key={`${order.id}-${index}`}
              order={order}
              index={index}
            />
          ))}
        </div>
        {hasMore && (
          <div className="flex justify-center mt-4">
            <button
              onClick={loadMore}
              disabled={loading}
              className="bg-[#1160A5] text-white px-5 py-2 rounded-lg text-sm disabled:opacity-60"
            >
              {loading ? "Loading..." : "Load More"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
