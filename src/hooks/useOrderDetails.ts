"use client";

import { useEffect, useState } from "react";
import OrderService from "@/services/orderdetails.service";
import { useUser } from "@/context/userContext";

export function useOrderDetail(orderId: string) {
  const [orderDetail, setOrderDetail] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { user } = useUser();

  const fetchOrderDetail = async () => {
    try {
      setLoading(true);
      setError("");

      const body = {
        view: "order_detail",
        id: orderId,
        userID: user?.userID || "",
      };

      const data = await OrderService.getOrderDetail(body);

      setOrderDetail(data || null);
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) {
      fetchOrderDetail();
    }
  }, [orderId]);

  return { orderDetail, loading, error };
}
