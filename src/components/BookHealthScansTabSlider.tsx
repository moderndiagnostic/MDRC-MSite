"use client";

import Link from "next/link";
import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { useCity } from "@/context/CityContext";
import { useUser } from "@/context/userContext";
import { useCart } from "@/hooks/useCart";
import { useDashboard } from "@/context/DashboardContext";
import { toast } from "react-toastify";
import { useModalStore } from "@/app/store/modal.store";
import { HealthItem } from "@/hooks/useItems";

interface HealthCategory {
  category_name: string;
  slug: string;
  items: HealthItem[];
}

export default function BookHealthScansTabSlider() {
  const { homeData, loading } = useDashboard();
  const [activeTab, setActiveTab] = useState<string>("");
  const [slide, setSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const { cityDetails } = useCity();
  const { user } = useUser();
  const [cartItemMap, setCartItemMap] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState<Record<string, boolean>>({});
  const { open } = useModalStore();

  const {
    handleAddToCart,
    removeFromCart,
    loading: cartLoading,
    cartItems,
    fetchCartList,
  } = useCart(user?.userID, user?.userPhone, "");

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const filtered = homeData?.healthTestAndPackages.filter(
    (cat: HealthCategory) => cat.items?.length > 0,
  );

  const currentItems = useMemo(() => {
    return (
      homeData?.healthTestAndPackages?.find(
        (cat: HealthCategory) => cat.category_name === activeTab,
      )?.items || []
    );
  }, [activeTab, homeData]);

  useEffect(() => {
    if (homeData?.healthTestAndPackages?.length > 0 && !activeTab) {
      setActiveTab(homeData.healthTestAndPackages[0].category_name);
    }
  }, [homeData, activeTab]);

  useEffect(() => {
    setSlide(0);
  }, [activeTab]);

  useEffect(() => {
    if (loading || currentItems.length <= 1 || isPaused) return;

    intervalRef.current = setInterval(() => {
      setSlide((prev) => (prev + 1) % currentItems.length);
    }, 5500);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [loading, currentItems.length, isPaused]);

  const pauseAutoSlide = () => setIsPaused(true);
  const resumeAutoSlide = () => setIsPaused(false);

  // Build cartItemMap from cartItems - PERFECT 1-TO-1 MAPPING
  useEffect(() => {
    if (Array.isArray(cartItems)) {
      const map: Record<string, string> = {};
      cartItems.forEach((item: any) => {
        if (item.cartItemID && item.cartID) {
          map[item.cartItemID] = item.cartID;
        }
      });
      setCartItemMap(map);
    }
  }, [cartItems]);

  // 🔥 PERFECT 1-CLICK ADD/REMOVE
  const onCartAction = useCallback(
    async (item: HealthItem) => {
      const itemId = item.itemID;

      // Prevent double clicks
      if (isProcessing[itemId]) return;

      if (!user || user === "null") {
        open("login");
        return;
      }

      setIsProcessing((prev) => ({ ...prev, [itemId]: true }));

      const hasCartId = cartItemMap[itemId];

      if (!hasCartId) {
        try {
          const res = await handleAddToCart({
            userID: user.userID,
            userPhone: user.userPhone,
            itemID: itemId,
            itemPriceID: item.priceID,
            cityID: cityDetails?.id,
          });
          if (res) {
            toast.success("Added to cart!");
            fetchCartList();
          }
        } catch (err) {
          toast.error("Failed to add!");
        }
      } else {
        // REMOVE - DIRECT 1 CLICK WITH CARTID
        try {
          console.log(`Removing cartID: ${hasCartId} for item: ${itemId}`);
          const success = await removeFromCart(hasCartId);
          if (success) {
            toast.success("Removed from cart!");
            fetchCartList();
          } else {
            toast.error("Failed to remove!");
          }
        } catch (err) {
          console.error("Remove error:", err);
          toast.error("Failed to remove!");
        }
      }

      setIsProcessing((prev) => ({ ...prev, [itemId]: false }));
    },
    [
      user,
      cartItemMap,
      handleAddToCart,
      removeFromCart,
      fetchCartList,
      open,
      cityDetails?.id,
      isProcessing,
    ],
  );

  const formatPrice = (val: string) => {
    const num = Math.floor(parseFloat(val));
    return isNaN(num) ? "₹0" : `₹${num.toLocaleString("en-IN")}`;
  };

  // Touch Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    pauseAutoSlide();
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        setSlide((prev) => (prev + 1) % currentItems.length);
      } else {
        setSlide(
          (prev) => (prev - 1 + currentItems.length) % currentItems.length,
        );
      }
    }
    setTimeout(resumeAutoSlide, 6000);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="animate-spin text-[#0a6baf]" size={40} />
      </div>
    );

  if (homeData?.healthTestAndPackages?.length === 0) return null;

  return (
    <section className="my-8 px-4">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Book Health Scans & Imaging Tests
      </h2>

      {/* Tabs */}
      <div className="flex gap-3 mb-4 overflow-x-auto no-scrollbar pb-2">
        {homeData?.healthTestAndPackages?.map(
          (category: HealthCategory, index: number) => (
            <button
              key={`${category.slug}-${index}`}
              onClick={() => setActiveTab(category.category_name)}
              className={`px-3 py-2 rounded-lg text-[13px] whitespace-nowrap font-medium border transition-all ${
                activeTab === category.category_name
                  ? "gradient-green text-white border-emerald-500"
                  : "text-emerald-500 border-emerald-500 hover:bg-emerald-50"
              }`}
            >
              {category.category_name}
            </button>
          ),
        )}
      </div>

      {/* Slider */}
      <div
        className="overflow-hidden relative"
        onMouseEnter={pauseAutoSlide}
        onMouseLeave={resumeAutoSlide}
      >
        <div
          key={activeTab}
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${slide * 100}%)` }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {currentItems.map((item: any, i: number) => {
            const discountValue = parseFloat(item.percentage);
            const showDiscount = !isNaN(discountValue) && discountValue > 0;
            const isItemInCart = !!cartItemMap[item.itemID];
            const processing = isProcessing[item.itemID];

            return (
              <div key={item.itemID + i} className="min-w-full px-1">
                <div className="rounded-2xl shadow-md bg-white overflow-hidden">
                  <div className="relative gradient-blue-2 text-white p-4">
                    <div className="flex justify-between items-center">
                      <Link href={`/tests/${item.slug}/${cityDetails?.slug}`}>
                        <p className="text-lg font-semibold leading-snug cursor-pointer">
                          {item.name}
                        </p>
                      </Link>

                      <div className="text-right">
                        <div className="flex gap-2 items-center justify-end">
                          {parseFloat(item.mrp) > 0 && (
                            <span className="line-through text-sm opacity-70">
                              {formatPrice(item.mrp)}
                            </span>
                          )}
                          <span className="text-xl font-semibold">
                            {formatPrice(item.price)}
                          </span>
                        </div>

                        {/* UI FIX: Only show badge if > 0 */}
                        {showDiscount && (
                          <div className="mt-2">
                            <span className="bg-white text-[#1160A5] text-sm font-semibold px-3 py-1 rounded-lg inline-block">
                              {item.percentage}% OFF
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-[auto_auto] gap-3 justify-between px-4 py-4 text-sm text-gray-600">
                    <div className="flex gap-2 items-center">
                      {item.department === "1" ? (
                        <img src="/assets/images/our-health-tests/cancer.svg" />
                      ) : (
                        <img src="/assets/images/our-health-tests/parameters.svg" />
                      )}
                      <span>{item.line1}</span>
                    </div>
                    <div className="flex gap-2 items-center">
                      {item.department === "1" ? (
                        <img src="/assets/images/our-health-tests/scan.svg" />
                      ) : (
                        <img src="/assets/images/our-health-tests/reports.svg" />
                      )}
                      <span className="text-xs">{item.line2}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 px-4 pb-4">
                    <Link
                      href={`/tests/${item.slug}/${cityDetails?.slug}`}
                      className="flex-1 w-full border border-gray-400 rounded-lg py-2 text-gray-700 font-medium text-center text-sm"
                    >
                      View Details
                    </Link>

                    <button
                      onClick={() => onCartAction(item)}
                      disabled={cartLoading || processing}
                      className={`flex-1 w-full rounded-lg py-2.5 shadow text-sm font-bold uppercase tracking-wide active:scale-95 transition-transform flex items-center justify-center ${
                        isItemInCart
                          ? "gradient-green text-white"
                          : "gradient-red text-white"
                      } ${cartLoading || processing ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      {processing ? (
                        <Loader2 className="animate-spin" size={16} />
                      ) : (
                        <span className="flex items-center justify-center gap-1 min-w-[96px]">
                          {isItemInCart && (
                            <Trash2 className="size-4 -mt-0.5 text-white" />
                          )}
                          {isItemInCart ? "Remove" : "Add to Cart"}
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Indicators */}
        {currentItems.length > 1 && (
          <div className="flex justify-center items-center gap-2 mt-4">
            {currentItems.map((_: string, i: number) =>
              slide === i ? (
                <span
                  key={i}
                  className="bg-gradient-to-b from-[#727070] to-[#C1C1C1] text-white text-[10px] px-2.5 py-1 rounded-full font-medium"
                >
                  {i + 1}/{currentItems.length}
                </span>
              ) : (
                <span
                  key={i}
                  onClick={() => {
                    setSlide(i);
                    pauseAutoSlide();
                    setTimeout(resumeAutoSlide, 8000);
                  }}
                  className="h-2 w-2 rounded-full cursor-pointer bg-gray-300 hover:bg-gray-400 transition-colors"
                />
              ),
            )}
          </div>
        )}

        {currentItems.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Test not available for this category
          </div>
        )}
      </div>
    </section>
  );
}
