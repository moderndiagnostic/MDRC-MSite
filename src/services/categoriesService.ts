// services/categoriesService.ts
import requests from "@/lib/httpServices";

export const categoriesService = {
  getCategoriesList: async () => {
    return await requests.post("/webApi/index.php", {
      view: "category_list",
    });
  },
};
