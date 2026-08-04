import { useEffect, useState } from "react";
import { LOCATION_STORAGE_KEY, City } from "@/proxy";
import LocationService from "@/services/location.service";
import { getDeviceType } from "@/utils/device";

export function useLocations() {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedCities = sessionStorage.getItem(LOCATION_STORAGE_KEY);
    if (storedCities) {
      setCities(JSON.parse(storedCities));
      setLoading(false);
      return;
    }

    const payload = {
      view: "city_list",
      deviceType: getDeviceType() || "Android",
    };
    LocationService.getCityList(payload as any)
      .then((res) => {
        if (res?.msgCode === "1") {
          const cityList: City[] = res.result.cityList;
          setCities(cityList);
          sessionStorage.setItem(
            LOCATION_STORAGE_KEY,
            JSON.stringify(cityList),
          );
        } else {
          throw new Error("Failed to fetch city list");
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { cities, loading, error };
}
