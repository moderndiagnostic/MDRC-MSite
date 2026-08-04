import { useEffect, useState } from "react";
import MenuService from "@/services/menu";
import { useCity } from "@/context/CityContext";

interface MenuItem {
  title: string;
  link: string;
  type?: string;
  child: MenuItem[];
}

interface MenuData {
  menuList: MenuItem[];
  common: {
    cityId: string;
    cityName: string;
    citySlug: string;
  };
}

export const MENU_STORAGE_KEY = "mdrc_menu_data";

export const useMenu = () => {
  const [menuData, setMenuData] = useState<MenuData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { cityDetails } = useCity();

  const saveMenuToStorage = (data: MenuData, cityId: string) => {
    sessionStorage.setItem(
      `${MENU_STORAGE_KEY}_${cityId}`,
      JSON.stringify(data),
    );
  };

  const getMenuFromStorage = (cityId: string): MenuData | null => {
    try {
      const stored = sessionStorage.getItem(`${MENU_STORAGE_KEY}_${cityId}`);
      if (!stored) return null;
      return JSON.parse(stored);
    } catch {
      return null;
    }
  };

  const fetchMenu = async (cityId: string = cityDetails.id) => {
    try {
      setLoading(true);

      const payload: any = {
        view: "common",
        cityID: cityId,
      };
      const response = await MenuService.getMenuList(payload);

      if (response?.msgCode === "1" && response?.data) {
        const data = response.data;

        setMenuData(data);
        saveMenuToStorage(response.data, cityId);
        setError(null);
      } else {
        throw new Error(response?.message || "Failed to fetch menu");
      }
    } catch (err: any) {
      console.error("Error fetching menu:", err);
      setError(err.message || "Failed to load menu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!cityDetails?.id) return;

    const storedMenu = getMenuFromStorage(cityDetails.id);
    if (storedMenu) {
      setMenuData(storedMenu);
      setLoading(false);
      return;
    }

    fetchMenu(cityDetails.id);
  }, [cityDetails.id]);

  return {
    menuData,
    menuList: menuData?.menuList || [],
    common: menuData?.common,
    loading,
    error,
    refetch: fetchMenu,
  };
};
