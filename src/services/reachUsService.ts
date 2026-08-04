// services/reachUsService.ts
import requests from "@/lib/httpServices";

export const reachUsService = {
  getAddresses: async () => {
    const body = {
      view: "contact_address_list",
    };

    // IMPORTANT:
    // requests.post already returns response.data
    return await requests.post("/webApi/index.php", body);
  },
};
