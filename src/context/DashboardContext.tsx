"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { dashboardService } from "@/services/dashboardService";
import { useUser } from "@/context/userContext";
import { useCity } from "@/context/CityContext";

type DashboardContextType = {
  homeData: any;
  loading: boolean;
  error: string;
  refetch: () => void;
};

const DashboardContext = createContext<DashboardContextType | null>(null);

export const useDashboard = () => {
  const ctx = useContext(DashboardContext);
  if (!ctx) {
    throw new Error("useDashboard must be used inside DashboardProvider");
  }
  return ctx;
};

export const DashboardProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { user } = useUser();
  const { cityDetails, updateCityDetails } = useCity();

  const [homeData, setHomeData] = useState<any>({
    banner: [],
    diseases: [],
    category: [],
    items: [],
    cityDetail: null,
    popular_category: [],
    healthTestAndPackages: [],
    radiologyAndImagingTest: [],
    pathologyCatAndItem: [],
    homeHealthTestsBanner: [],
    meta_title: "",
    meta_keyword: "",
    meta_description: "",
    meta_schema: "",
    favicon: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const loadingRef = useRef(false);

  const fetchDashboardData = async () => {
    if (!cityDetails?.id || loadingRef.current) return;

    loadingRef.current = true;
    setLoading(true);

    try {
      const payload = {
        view: "dashboard",
        userID: user?.userID ?? "",
        userPhone: user?.userPhone ?? "",
        deviceType: "Android",
        cityID: cityDetails.id,
        appVersion: "1.4",
      };

      const response = await dashboardService.getDashboardData(payload);

      if (response?.msgCode === "1") {
        setHomeData(response.result || []);

        const apiCityDetail = response.result.cityDetail;
        if (apiCityDetail?.id && apiCityDetail.id !== cityDetails.id) {
          updateCityDetails(apiCityDetail);
        }

        localStorage.setItem("videourl", response.result.video_url);
      } else {
        setError("Failed to load dashboard data");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!cityDetails?.id) return;
    fetchDashboardData();
  }, [user?.userID, cityDetails?.id]);

  return (
    <DashboardContext.Provider
      value={{
        homeData,
        loading,
        error,
        refetch: fetchDashboardData,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};
