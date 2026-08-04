// services/diseasesService.ts
import requests from "@/lib/httpServices";

export const diseasesService = {
  getDiseasesList: async () => {
    return await requests.post("/webApi/index.php", {
      view: "diseases_list",
    });
  },
};
