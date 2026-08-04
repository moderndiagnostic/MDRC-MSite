import requests from "@/lib/httpServices";

const ItemService = {
  getItemList: async (body: any) => {
    return requests.post("/webApi/index.php", body);
  },
  getItemDetail: async (body : any) => {
    return requests.post("/webApi/index.php", body);
  },
};

export default ItemService;
