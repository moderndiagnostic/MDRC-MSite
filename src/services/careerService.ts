// services/careerService.ts
import requests from "@/lib/httpServices";

export const careerService = {
  getCareerList: async () => {
    return await requests.post("/webApi/index.php", {
      view: "career_list",
    });
  },
};
