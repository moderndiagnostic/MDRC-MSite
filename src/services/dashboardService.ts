// services/dashboardService.ts
import requests from "@/lib/httpServices";

export const dashboardService = {
  getDashboardData: async (body: any) => {
    return await requests.post("/webApi/index.php", body);
  },
};
