// useCart.ts

import { useState, useEffect } from "react";
import { categoriesService } from "@/services/categoriesService";

// types.ts

export type categoryItem = {
  id: string;
  image: string;
  name: string;
  slug: string;
};

export const useCategories = () => {
  const [categoriesItems, setCategoriesItems] = useState<categoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categoriesService.getCategoriesList();
      if (response?.msgCode === "1") {
        setCategoriesItems(response?.data?.categoryList || []);
      } else {
        setError("Failed to load categories.");
      }
    } catch (err) {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return { categoriesItems, loading, error, fetchCategories };
};
