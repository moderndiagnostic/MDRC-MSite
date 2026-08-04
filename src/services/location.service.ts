// services/location.service.ts
import requests from "@/lib/httpServices";

const LocationService = {
  getCityList: async (body: string) => {
    return requests.post("/webApi/index.php", body);
  },
};

export default LocationService;
