import requests from "@/lib/httpServices";

const MenuService = {
  getMenuList: async (payload : any) => {
    return requests.post("/webApi/index.php", payload);
  },
};

export default MenuService;
