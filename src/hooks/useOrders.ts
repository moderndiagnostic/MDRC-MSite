"use client";

import { useEffect, useRef, useState } from "react";
import OrderService from "@/services/order.service";
import { getDeviceType } from "@/utils/device";
import { useUser } from "@/context/userContext";

export function useOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const loadinRef = useRef(false);
  const { user } = useUser();
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  const fetchOrders = async ({
    search = "",
    page: pageParam = 0,
    append = false,
  }: {
    search?: string;
    page?: number;
    append?: boolean;
  } = {}) => {
    if (loadinRef.current) return;
    loadinRef.current = true;
    if (!user) {
      loadinRef.current = false;
      return;
    }
    try {
      setLoading(true);
      setError("");

      const body = {
        view: "order_list",
        userID: user?.userID,
        deviceType: getDeviceType(),
        userPhone: user?.userPhone,
        search,
        page: pageParam,
      };

      const res = await OrderService.getOrderList(body);

      if (res?.msgCode === "1") {
        const newOrders = res?.result?.orderList || [];
        setOrders((prev) => (append ? [...prev, ...newOrders] : newOrders));
        setHasMore(newOrders.length > 0);
        setPage(pageParam);
      } else {
        setError(res?.msg || "Failed to load orders");
      }
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
      loadinRef.current = false;
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  return {
    orders,
    loading,
    error,
    fetchOrders,
    page,
    hasMore,
  };
}
