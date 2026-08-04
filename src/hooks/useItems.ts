"use client";

import { useEffect, useState, useRef } from "react";
import ItemService from "@/services/item.service";
import { getDeviceType } from "@/utils/device";
import { useCity } from "@/context/CityContext";
import { useUser } from "@/context/userContext";

type UseItemsParams = {
  pageType: string;
  cityID?: string;
  categorySlug?: string; // maps to API categoryID
  departmentID?: string;
  typeID?: string;
  sortBy?: string;
  search?: string;
  diseaseSlug?: string;
  diseaseID?: string;
  categoryID?: string;
};

export interface HealthItem {
  itemID: string;
  priceID: string;
  name: string;
  slug: string;
  inCart: boolean;
  price: string;
  mrp: string;
  percentage: string;
  url: string;
  line1?: string;
  line2?: string;
  is_package: string;
  department: string;
}

export function useItems({
  pageType,
  categorySlug = "",
  departmentID = "",
  typeID = "",
  sortBy = "",
  search = "",
  diseaseSlug = "",
  diseaseID = "",
  categoryID = "",
}: UseItemsParams) {
  const [items, setItems] = useState<HealthItem[]>([]);
  const [banners, setBanners] = useState<any[]>([]);
  const [relatedCartItems, setRelatedCartItems] = useState<any[]>([]);
  const [filters, setFilters] = useState<any[]>([]);
  const [radiologyAndImagingTest, setRadiologyAndImagingTest] = useState<any[]>(
    [],
  );
  const [title, setTitle] = useState("");
  const [certificateImage, setCertificateImage] = useState("");
  const { cityDetails } = useCity();
  const [message, setMessage] = useState("");

  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasFetchedOnce, setHasFetchedOnce] = useState(false);

  const loadingRef = useRef(false);
  const { user } = useUser();
  const isReady = Boolean(cityDetails?.id);

  const fetchItems = async (pageNo: number, reset = false) => {
    if (loadingRef.current) return;
    if (!cityDetails?.id) return;

    loadingRef.current = true;
    if (pageNo === 0) {
      setInitialLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const body = {
        view: "item_list",
        userID: user?.userID || "",
        deviceType: getDeviceType(),
        userPhone: user?.userPhone || "",
        cityID: cityDetails?.id,
        categorySlug,
        departmentID,
        typeID,
        search,
        sortBy,
        page: pageNo,
        pageType,
        diseaseSlug,
        diseaseID,
        categoryID,
      };

      const res = await ItemService.getItemList(body);
      const list = res?.result?.itemList || [];
      if (res?.msgCode === "0") {
        setMessage(res?.message);
      }
      setItems((prev) => (reset ? list : [...prev, ...list]));

      if (pageNo === 0) {
        setBanners(res?.result?.bannerList || []);
        setFilters(res?.result?.filterList || []);
        setTitle(res?.result?.title || "");
        setCertificateImage(res?.result?.certificateImage || "");
        setRadiologyAndImagingTest(res?.result.radiologyAndImagingTest || []);
        setRelatedCartItems(res?.result.relatedCartItems || [])
      }

      if (list.length < 10) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
    } catch (err) {
      setHasMore(false);
    } finally {
      loadingRef.current = false;
      setInitialLoading(false);
      setLoadingMore(false);
      setHasFetchedOnce(true);
    }
  };

  useEffect(() => {
    if (!isReady) return;

    setPage(0);
    setHasMore(false);
    setItems([]);
    setHasFetchedOnce(false);

    fetchItems(0, true);
  }, [
    pageType,
    categorySlug,
    departmentID,
    typeID,
    search,
    sortBy,
    diseaseSlug,
    diseaseID,
    categoryID,
    cityDetails?.id,
  ]);

  const fetchNextPage = () => {
    if (loadingRef.current || !hasMore) return;

    const nextPage = page + 1;
    setPage(nextPage);
    fetchItems(nextPage);
  };

  return {
    items,
    banners,
    filters,
    title,
    certificateImage,
    initialLoading,
    loadingMore,
    hasMore,
    page,
    fetchNextPage,
    hasFetchedOnce,
    message,
    radiologyAndImagingTest,
    relatedCartItems,
  };
}
