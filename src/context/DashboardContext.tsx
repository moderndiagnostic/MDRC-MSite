"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { dashboardService } from "@/services/dashboardService";
import { useUser } from "@/context/userContext";
import { useCity } from "@/context/CityContext";
import { DASHBOARD_STORAGE_KEY } from "@/constants/city";

type DashboardContextType = {
  homeData: any;
  loading: boolean;
  error: string;
  refetch: () => void;
};

const EMPTY_HOME_DATA = {
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
};

const DashboardContext = createContext<DashboardContextType | null>(null);

export const useDashboard = () => {
  const ctx = useContext(DashboardContext);
  if (!ctx) {
    throw new Error("useDashboard must be used inside DashboardProvider");
  }
  return ctx;
};

const cacheKey = (cityId: string, userId?: string) =>
  `${DASHBOARD_STORAGE_KEY}_${cityId}_${userId || "guest"}`;

const readDashboardCache = (cityId: string, userId?: string) => {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(cacheKey(cityId, userId));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const writeDashboardCache = (
  cityId: string,
  userId: string | undefined,
  data: any,
) => {
  try {
    sessionStorage.setItem(cacheKey(cityId, userId), JSON.stringify(data));
  } catch {}
};

export const DashboardProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { user } = useUser();
  const { cityDetails, updateCityDetails } = useCity();
  const pathname = usePathname();
  const isHome = pathname === "/";

  const [homeData, setHomeData] = useState<any>(EMPTY_HOME_DATA);
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
        const result = response.result || [];
        setHomeData(result);
        writeDashboardCache(cityDetails.id, user?.userID, result);

        const apiCityDetail = result.cityDetail;
        if (apiCityDetail?.id && apiCityDetail.id !== cityDetails.id) {
          updateCityDetails(apiCityDetail);
        }

        if (result.video_url) {
          localStorage.setItem("videourl", result.video_url);
        }
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

    const cached = readDashboardCache(cityDetails.id, user?.userID);
    if (cached) {
      setHomeData(cached);
    }

    if (!isHome) return;

    fetchDashboardData();
  }, [user?.userID, cityDetails?.id, isHome]);

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
