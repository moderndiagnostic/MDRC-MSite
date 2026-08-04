"use client";

import { useEffect, useState, useRef } from "react";
import ItemService from "@/services/item.service";
import { getDeviceType } from "@/utils/device";
import { useParams } from "next/navigation";
import { useCity } from "@/context/CityContext";
import { useUser } from "@/context/userContext";

export function useItemDetail() {
  const { slug } = useParams<{ slug: string[] }>();
  const itemSlug = Array.isArray(slug) ? slug[0] : "";
  const [itemDetail, setItemDetail] = useState<any>(null);
  const [relatedCartItems, setRelatedCartItems] = useState<any>(null);
  const [itemDesc, setItemDesc] = useState<any>(null);
  const [featureList, setFeatureList] = useState<any[]>([]);
  const [itemTabs, setItemTabs] = useState<any[]>([]);
  const [callBlock, setCallBlock] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { cityDetails } = useCity();
  const { user } = useUser();
  const isReady = Boolean(cityDetails?.id && itemSlug);

  const loadingRef = useRef(false);

  const fetchItemDetail = async () => {
    if (loadingRef.current) return;
    if (!isReady) return;

    loadingRef.current = true;
    setLoading(true);

    try {
      const body = {
        view: "item_detail",
        userID: user?.userID ?? "",
        deviceType: getDeviceType(),
        userPhone: user?.userPhone ?? "",
        cityID: cityDetails?.id,
        itemSlug,
      };

      const res = await ItemService.getItemDetail(body);

      setItemDetail(res?.result?.itemDetail || null);
      setItemDesc(res?.result?.descList || null);
      setFeatureList(res?.result?.featureList || []);
      setItemTabs(res?.result?.itemTabs || []);
      setCallBlock(res?.result?.callBlock || []);
      setRelatedCartItems(res?.result?.relatedCartItems || null);
    } catch (err) {
      console.log(err);
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isReady) return;
    fetchItemDetail();
  }, [itemSlug, cityDetails?.id]);

  return {
    itemDetail,
    loading,
    itemDesc,
    itemTabs,
    featureList,
    callBlock,
    relatedCartItems,
  };
}
