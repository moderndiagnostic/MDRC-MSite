import requests from "@/lib/httpServices";

const OrderService = {
  getOrderList: async (body:any) => {
    return requests.post("/webApi/index.php", body);
  },
};

export default OrderService;
