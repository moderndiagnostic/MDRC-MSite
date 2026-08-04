// cart.service.ts
import requests from "@/lib/httpServices";

export interface AddToCartPayload {
  view: string;
  userID: string;
  deviceType: string;
  userPhone: string;
  action: string;
  itemID: string;
  itemPriceID: string;
  cityID: string;
}

const CartService = {
  getCartList: async (body: any) => {
    return requests.post("/webApi/index.php", body);
  },

  getMemberList: async (body: any) => {
    return requests.post("/webApi/index.php", body);
  },

  cartItemMemberAssign: async (body: any) => {
    return requests.post("/webApi/index.php", body);
  },

  cartItemMemberRemove: async (body: any) => {
    return requests.post("/webApi/index.php", body);
  },

  removeCartItem: async (body: any) => {
    return requests.post("/webApi/index.php", body);
  },

  clearCartData: async (body: any) => {
    return requests.post("/webApi/index.php", body);
  },

  assignPrescription: async (formData: FormData) => {
    return requests.post("/webApi/index.php", formData);
  },

  cartCheckForCheckout: async (body: any) => {
    return requests.post("/webApi/index.php", body);
  },

  postAddToCart: async (payload: AddToCartPayload) => {
    // Postman shows 'form-data', so we use FormData object
    const formData = new FormData();
    formData.append("view", payload.view);
    formData.append("userID", payload.userID);
    formData.append("deviceType", payload.deviceType);
    formData.append("userPhone", payload.userPhone);
    formData.append("action", payload.action);
    formData.append("itemID", payload.itemID);
    formData.append("itemPriceID", payload.itemPriceID);

    return await requests.post("/webApi/index.php", formData);
  },

  removePrescription: async (body: any) => {
    return requests.post("/webApi/index.php", body);
  },
};

export default CartService;
