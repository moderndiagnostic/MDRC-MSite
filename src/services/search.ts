import requests from "@/lib/httpServices";

const searchService = {
  globalSearch: async (cityID: string) => {
    return requests.post("/webApi/index.php", { view: "search", cityID });
  },
};

export default searchService;
