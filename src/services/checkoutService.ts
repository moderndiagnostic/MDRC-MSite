import { OrderCheckoutPayload } from "@/hooks/useCheckout";
import requests from "@/lib/httpServices";

export const CheckoutService = {
  getCheckoutDataList: async (body: any) => {
    return await requests.post("/webApi/index.php", body);
  },
  orderCheckout: async (body: OrderCheckoutPayload) => {
    return await requests.post("/webApi/index.php", body);
  },

  verifyRazorpayPayment: async (body: any) => {
    return await requests.post("webApi/index.php", body);
  },
};
