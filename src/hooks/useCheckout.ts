// useCart.ts
"use client";

import { useState, useEffect, useRef } from "react";
import { getDeviceType } from "@/utils/device";
import { CheckoutService } from "@/services/checkoutService";
import { useCity } from "@/context/CityContext";
import { useUser } from "@/context/userContext";
import { useCartContext } from "@/context/CartContext";

// types.ts

export type CartItem = {
  itemID: string;
  name: string;
  slug: string;
  price: string;
  mrp: string;
  percentage: string;
  itemInfo: string[];
  line1: string;
  line2: string;
};

export type CheckoutItems = {
  allTotals: {
    wallet: number;
    subtotal: number;
    cartCount: number;
  };
  cartItems: CartItem[];
  minAdvanceAmount?: number;

  homeCollectionStep: {
    homeCollectionHeading: string;
    homeCollectionSelection: null | any[];
    dateList: {
      dateValue: string;
      date: string;
      dateMonth: string;
    }[];
    timeList: string[];
  } | null;
  labCollectionStep: {
    labCollectionHeading: string;
    labCollectionSelection: {
      id: string;
      name: string;
      address: string;
    }[];
    dateList: {
      dateValue: string;
      date: string;
      dateMonth: string;
    }[];
    labTimeList: string[];
  };
  payments: {
    paymentLabel: string;
    paymentValue: string;
  }[];
  paymentHeading: string;
  couponEnterShow: string;
};

export type CouponItem = {
  code: string;
  msg: string;
};

export type OrderCheckoutPayload = {
  view: "checkout";
  userID: string;
  deviceType: string;
  userPhone: string;
  cityID: string;
  sampleCollect: "Yes" | "No";
  homeCollectionAddressID?: string;
  homeCollectionDate?: string;
  homeCollectionTime?: string;
  labCollectionAddressID?: string;
  labCollectionDate?: string;
  labCollectionTime?: string;
  paymentMode: string;
  couponCode?: string;
  couponDiscount?: string;
  grandTotal: string | number;
  walletUsed: "Yes" | "No";
  minTotal?: number
};

export const useCheckout = () => {
  const [checkoutItems, setCheckoutItems] = useState<CheckoutItems | null>(
    null,
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [orderLoading, setOrderLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [message, setMessage] = useState<string | null>(null);
  const [orderResponse, setOrderResponse] = useState<any>(null);
  // const [sampleCollect, setSampleCollect] = useState<"Yes" | "No">("No");
  const [couponList, setCouponList] = useState<CouponItem[]>([]);
  const [couponLoading, setCouponLoading] = useState(false);
  const { user } = useUser();

  const { cityDetails } = useCity();
  const cityId = cityDetails?.id;
  const loadinRef = useRef(false);
  const { sampleCollect } = useCartContext();

  const fetchCheckoutData = async () => {
    if (loadinRef.current) return;
    loadinRef.current = true;
    try {
      setLoading(true);
      const body = {
        view: "checkout_data",
        userID: user?.userID || "",
        deviceType: getDeviceType(),
        userPhone: user?.userPhone || "",
        action: "step1",
        sampleCollect,
        cityID: cityId || "",
      };
      const response = await CheckoutService.getCheckoutDataList(body);
      if (response?.msgCode === "1") {
        setCheckoutItems(response.result || []);
      } else if (response?.msgCode === "2") {
        setMessage(response.message ?? "No checkout data available.");
        setCheckoutItems(null);
      } else {
        setError("Failed to load checkout data.");
        setCheckoutItems(null);
      }
    } catch (err) {
      setError("Something went wrong.");
      setCheckoutItems(null);
    } finally {
      setLoading(false);
      loadinRef.current = false;
    }
  };

  const fetchCoupons = async () => {
    try {
      setCouponLoading(true);

      const body = {
        view: "coupon_list",
        userID: user?.userID || "",
        deviceType: getDeviceType(),
        userPhone: user?.userPhone || "",
        cityID: cityId || "",
        action: "list",
      };

      const res = await CheckoutService.getCheckoutDataList(body);

      if (res?.msgCode === "1") {
        setCouponList(res?.result?.couponList || []);
      }
    } catch (err) {
      console.error("Coupon fetch failed", err);
    } finally {
      setCouponLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCheckoutData();
      fetchCoupons();
    }
  }, [user, sampleCollect]);

  const applyCouponApi = async (couponCode: string) => {
    try {
      const body = {
        view: "coupon_list",
        action: "apply",
        couponCode,
        userID: user?.userID || "",
        deviceType: getDeviceType(),
        userPhone: user?.userPhone || "",
        cityID: cityId || "",
      };

      const res = await CheckoutService.getCheckoutDataList(body);

      return res;
    } catch (err) {
      console.error("Apply coupon failed", err);
      return null;
    }
  };

  const placeOrder = async (payload: OrderCheckoutPayload) => {
    try {
      if (loadinRef.current) return;
      loadinRef.current = true;
      setOrderLoading(true);
      setError("");

      const res = await CheckoutService.orderCheckout(payload);

      if (res?.msgCode === "3") {
        setOrderResponse(res);
        return { msgCode: res?.msgCode, data: res };
      } else {
        return {
          msgCode: res?.msgCode,
          message: res?.message || "Order failed",
          result: res?.result || {},
        };
      }
    } catch {
      setError("Order request failed");
    } finally {
      setOrderLoading(false);
      loadinRef.current = false;
    }
  };

  // useEffect(() => {
  //   if (user) {
  //     fetchCheckoutData();
  //   }
  // }, [user]);

  return {
    checkoutItems,
    loading,
    error,
    message,
    fetchCheckoutData,
    placeOrder,
    orderLoading,
    orderResponse,
    couponList,
    couponLoading,
    applyCouponApi,
  };
};
