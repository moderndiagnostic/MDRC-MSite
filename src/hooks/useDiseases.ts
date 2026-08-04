// useCart.ts

import { useState, useEffect, useRef } from "react";
import { diseasesService } from "@/services/diseasesService";

// types.ts

export type DiseasesItem = {
  id: string;
  image: string;
  meta_description: string;
  meta_keywords: string;
  meta_title: string;
  name: string;
  slug: string;
};

export const useDiseases = () => {
  const [diseasesItems, setDiseasesItems] = useState<DiseasesItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const loadinRef = useRef(false);

  const fetchDiseasesList = async () => {
    if (loadinRef.current) return;
    loadinRef.current = true;
    try {
      setLoading(true);
      const response = await diseasesService.getDiseasesList();
      if (response?.msgCode === "1") {
        setDiseasesItems(response?.data?.diseasesList || []);
      } else {
        setError("Failed to load diseases.");
      }
    } catch (err) {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
      loadinRef.current = false;
    }
  };

  useEffect(() => {
    fetchDiseasesList();
  }, []);

  return { diseasesItems, loading, error, fetchDiseasesList };
};
