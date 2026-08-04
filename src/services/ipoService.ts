// services/ipoService.ts
import requests from "@/lib/httpServices";

export const ipoService = {
  getDocuments: async (category: string) => {
    return await requests.post("/webApi/index.php", {
      view: "ipo",
      category, // IPO | Policies | anything else
    });
  },
};
