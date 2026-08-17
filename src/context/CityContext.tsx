"use client";

import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { City, CITY_COOKIE_KEY, DEFAULT_CITY } from "@/constants/city";

interface CityContextType {
  cityDetails: City;
  updateCityDetails: (city: City) => void;
}

const CityContext = createContext<CityContextType | null>(null);

export const CityProvider = ({ children }: any) => {
  const [cityDetails, setCityDetails] = useState<City>(DEFAULT_CITY);

  useEffect(() => {
    const cookieCity = Cookies.get(CITY_COOKIE_KEY);

    if (cookieCity) {
      try {
        setCityDetails(JSON.parse(cookieCity));
      } catch {
        setCityDetails(DEFAULT_CITY);
        Cookies.remove(CITY_COOKIE_KEY);
      }
    }
  }, []);

  const updateCityDetails = (city: City) => {
    setCityDetails(city);
    Cookies.set(CITY_COOKIE_KEY, JSON.stringify(city), {
      path: "/",
      expires: 7,
      sameSite: "lax",
    });
  };

  return (
    <CityContext.Provider value={{ cityDetails, updateCityDetails }}>
      {children}
    </CityContext.Provider>
  );
};

export const useCity = () => {
  const context = useContext(CityContext);
  if (!context) throw new Error("useCity must be used within a CityProvider");
  return context;
};
