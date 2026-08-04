"use client";

import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { City, DEFAULT_CITY } from "@/proxy";

interface CityContextType {
  cityDetails: City;
  updateCityDetails: (city: City) => void;
}

const CityContext = createContext<CityContextType | null>(null);

export const CityProvider = ({ children }: any) => {
  const [cityDetails, setCityDetails] = useState<City | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const cookieCity = Cookies.get("cityDetail");

    if (cookieCity) {
      try {
        const parsedCity = JSON.parse(cookieCity);
        setCityDetails(parsedCity);
      } catch {
        setCityDetails(DEFAULT_CITY);
        Cookies.remove("cityDetail");
      }
    } else {
      setCityDetails(DEFAULT_CITY);
    }
  }, []);

  const updateCityDetails = (city: City) => {
    setCityDetails(city);
    Cookies.set("cityDetail", JSON.stringify(city), {
      path: "/",
      expires: 7,
      sameSite: "lax",
    });
  };

  if (!cityDetails) return null;

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
