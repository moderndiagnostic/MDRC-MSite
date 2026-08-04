import requests from "@/lib/httpServices";

const paymentService = {
  payNow: async (body: any) => {
    return requests.post("/webApi/index.php", body);
  },
  getPaymentInfoByStatus: async (body: any) => {
    return requests.post("/webApi/index.php", body);
  },
};

export default paymentService;
