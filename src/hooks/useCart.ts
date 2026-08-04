// useCart.ts
import { useState, useEffect, useRef } from "react";
import { getDeviceType } from "@/utils/device";
import CartService, { AddToCartPayload } from "@/services/cart.service";
import { useCity } from "@/context/CityContext";
import { useCartContext } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useUser } from "@/context/userContext";

type CartItem = {
  cartID: string;
  name: string;
  cartItemID: string;
  cartItemTestCount: string;
  price: string;
  mrp: string;
  dis?: string;
  cartItemMember?: string;
  cartItemPrescriptionFile: string;
  cartItemPrescriptionRequire: string;
  cartItemMemberRequire: string;
};

export interface CartResponseData {
  cartCount: number;
  cartSubtotal: number;
}

export const useCart = (_userID: string, userPhone: string, search: string) => {
  const { setCartCount, setCartSubtotal, sampleCollect, setSampleCollect } = useCartContext();
  const [checkoutLoading, setCheckoutLoading] = useState<boolean>(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isSampleHome, setIsSampleHome] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const { cityDetails } = useCity();
  const selectedCity = cityDetails;
  const loadingRef = useRef(false);
  const { user } = useUser();
  const cityId = cityDetails?.id || selectedCity?.id;
  const isReady = Boolean(cityId);
  const router = useRouter();

  // const [sampleCollect, setSampleCollect] = useState<"Yes" | "No">("No");

  const fetchCartList = async () => {
    if (!isReady || !user?.userID) return;
    if (loadingRef.current) return;

    loadingRef.current = true;
    setLoading(true);

    try {
      const body = {
        view: "cart",
        userID: user?.userID,
        deviceType: getDeviceType(),
        userPhone: userPhone ?? user?.userPhone,
        action: "cartList",
        cityID: cityId,
      };
      const response = await CartService.getCartList(body);
      if (response?.msgCode === "1") {
        setCartItems(response.result.cartList || []);
        setCartCount(response.result.cartCount || 0);
        setCartSubtotal(response.result.cartSubtotal || 0);
        setIsSampleHome(response.result.sampleCollectShow || "No");
      } else {
        setCartItems([]);
        setCartCount(0);
        setError("Failed to load cart data.");
      }
    } catch (err) {
      setError("Something went wrong.");
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  };

  const handleAddToCart = async (
    params: Omit<AddToCartPayload, "view" | "action" | "deviceType">,
  ) => {
    setLoading(true);
    setError("");

    try {
      // Mapping the static values from your Postman screenshot
      const payload: AddToCartPayload = {
        ...params,
        view: "cart",
        action: "addToCart",
        deviceType: "Android",
        cityID: cityId,
      };

      const response: any = await CartService.postAddToCart(payload);

      // Checking for msgCode "1" as per your JSON response example
      if (response?.msgCode === "1") {
        const data = response.result;
        setCartItems(data);
        setCartCount(data?.cartCount || 0);
        setCartSubtotal(data?.cartSubtotal || 0);
        return data;
      } else {
        const errMsg = response?.message || "Failed to add item";
        setError(errMsg);
        return { success: false, error: errMsg };
      }
    } catch (err) {
      console.error("Cart API error:", err);
      setError("Failed to add item to cart");
      return { success: false, error: "Network error" };
    } finally {
      setLoading(false);
    }
  };

  const handleCheckForCheckout = async () => {
    setCheckoutLoading(true);
    try {
      const body = {
        view: "cart",
        userID: user?.userID,
        deviceType: getDeviceType(),
        userPhone: userPhone ?? user?.userPhone,
        cityID: cityId,
        action: "cartCheckForCheckout",
        sampleCollect,
      };

      const response = await CartService.cartCheckForCheckout(body);
      if (response?.msgCode === "1") {
        router.push("/checkout");
      } else if (response?.msgCode === "0") {
        toast.error(response.message);
      } else {
        toast.error("Try again");
        setCheckoutLoading(false);
      }
    } catch (err) {
      console.error("Delete error:", err);
      setCheckoutLoading(false);
      return false;
    } finally {
      setCheckoutLoading(false);
    }
  };

  // Logic for the Remove API based on your Postman Image
  const removeFromCart = async (cartID: string) => {
    try {
      const body = {
        view: "cart",
        userID: user?.userID,
        deviceType: getDeviceType(),
        userPhone: userPhone ?? user?.userPhone,
        cityID: cityId,
        action: "cartItemDelete",
        cartID: cartID,
      };

      const response = await CartService.getCartList(body); // Assuming CartService uses the same endpoint
      if (response?.msgCode === "1") {
        await fetchCartList(); // Refresh list after deletion
        return true;
      }
      return false;
    } catch (err) {
      console.error("Delete error:", err);
      return false;
    }
  };

  // Logic for the Remove API based on your Postman Image
  const clearCart = async () => {
    try {
      const body = {
        view: "cart",
        userID: user?.userID,
        deviceType: getDeviceType(),
        userPhone: userPhone ?? user?.userPhone,
        cityID: cityId,
        action: "cartClear",
      };

      const response = await CartService.clearCartData(body);
      if (response?.msgCode === "1") {
        return true;
      }
      return false;
    } catch (err) {
      console.error("Delete error:", err);
      return false;
    }
  };

  // NEW: Logic for Prescription Upload based on your Postman Image
  const handleassignPrescription = async (file: File, targetCartID: string) => {
    try {
      const formData = new FormData();
      formData.append("view", "cart");
      formData.append("userID", user?.userID); // As per your screenshot
      formData.append("deviceType", getDeviceType());
      formData.append("userPhone", userPhone ?? user?.userPhone);
      formData.append("action", "cartItemPrescriptionAssign");
      formData.append("cartID", targetCartID);
      formData.append("cityID", cityId || "MQ==");
      formData.append("prescriptionFile", file);

      const response = await CartService.assignPrescription(formData);
      if (response?.msgCode === "1") {
        await fetchCartList(); // Refresh list to show the uploaded file name
        return true;
      }
      return false;
    } catch (err) {
      console.error("Prescription upload error:", err);
      return false;
    }
  };

  const removePrescription = async (targetCartID: string) => {
    try {
      const formData = new FormData();
      formData.append("view", "cart");
      formData.append("userID", user?.userID); // As per your screenshot
      formData.append("deviceType", getDeviceType());
      formData.append("userPhone", userPhone ?? user?.userPhone);
      formData.append("action", "cartItemPrescriptionRemove");
      formData.append("cartID", targetCartID);
      formData.append("cityID", cityId || "MQ==");

      await CartService.removePrescription(formData);
      await fetchCartList();
    } catch (err) {
      console.error("Failed to remove prescription:", err);
      return false;
    }
  };

  useEffect(() => {
    if (!isReady || !user?.userID) return;
    fetchCartList();
  }, [cityId, search, user?.userID]);

  return {
    cartItems,
    isSampleHome,
    loading,
    error,
    handleAddToCart,
    fetchCartList,
    removeFromCart,
    handleassignPrescription,
    clearCart,
    removePrescription,
    isReady,
    checkoutLoading,
    handleCheckForCheckout,
    setSampleCollect,
    sampleCollect,
  };
};
