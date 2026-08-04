// hooks/useReachUs.ts
"use client";

import { useEffect, useState } from "react";
import { reachUsService } from "@/services/reachUsService";

export interface Location {
  name: string;
  city_id: string;
  address: string;
  phone1: string;
  phone2: string;
  email1: string;
  email2: string;
  mapUrl: string;
  latitude: string;
  longitude: string;
}

export interface CallBlock {
  heading: string;
  callHeading: string;
  call: string;
  whatsappHeading: string;
  whatsapp: string;
  email: string;
}

export interface ReachUsApiResponse {
  message: string;
  msgCode: string;
  result: {
    meta_title?: string;
    meta_description?: string;
    meta_keyword?: string;
    favicon?: string;
    meta_schema?: string;
    addressList: Location[];
    callBlock: CallBlock;
  };
}

export const useReachUs = () => {
  const [data, setData] = useState<ReachUsApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);

      const response: any = await reachUsService.getAddresses();

      if (!response) {
        throw new Error("Empty API response");
      }

      // ✅ NORMALIZE RESPONSE (handles both cases safely)
      const normalized: ReachUsApiResponse = response.result
        ? response
        : {
            message: "success",
            msgCode: "1",
            result: response,
          };

      setData(normalized);
      setError(null);
    } catch (err) {
      console.error("ReachUs API error:", err);
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, loading, error, refetch: fetchData };
};
