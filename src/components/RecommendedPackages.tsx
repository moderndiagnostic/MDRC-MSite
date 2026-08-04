"use client";

import { useCity } from "@/context/CityContext";
import { useUser } from "@/context/userContext";
import { useCart } from "@/hooks/useCart";
import { Loader2, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState, useRef, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { useModalStore } from "@/app/store/modal.store";
import { HealthItem } from "@/hooks/useItems";

interface PackagesProps {
  relatedCartItems: HealthItem[];
}

export default function RecommendedPackages({
  relatedCartItems,
}: PackagesProps) {
  const { open } = useModalStore();
  const { cityDetails } = useCity();
  const { user } = useUser();

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const [cartItemMap, setCartItemMap] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState<Record<string, boolean>>({});
  const [index, setIndex] = useState(0);

  const {
    handleAddToCart,
    removeFromCart,
    loading: cartLoading,
    cartItems,
    fetchCartList,
  } = useCart(user?.userID, user?.userPhone, "");

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

  const handleTouchStart = (e: any) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: any) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > 50) {
      setIndex((prev) => (prev + 1) % relatedCartItems.length);
    } else if (touchEndX.current - touchStartX.current > 50) {
      setIndex(
        (prev) =>
          (prev - 1 + relatedCartItems.length) % relatedCartItems.length,
      );
    }
  };

  const formatPrice = (val: string) => {
    const num = Math.floor(parseFloat(val));
    return isNaN(num) ? "₹0" : `₹${num.toLocaleString("en-IN")}`;
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % relatedCartItems.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="mt-2">
      <h2 className="text-xl font-semibold mb-3">Recommended Packages</h2>

      {/* Slider */}
      <div className="relative overflow-hidden">
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {relatedCartItems.map((item, i) => {
            const discountValue = parseFloat(item.percentage);
            const showDiscount = !isNaN(discountValue) && discountValue > 0;
            const isItemInCart = !!cartItemMap[item.itemID];
            const processing = isProcessing[item.itemID];
            return (
              <div key={i} className="min-w-full px-1">
                <div className="rounded-2xl shadow-md bg-white overflow-hidden">
                  <div className="relative gradient-blue-2 text-white p-4">
                    <div className="flex justify-between items-center">
                      <Link href={`/tests/${item.slug}/${cityDetails?.slug}`}>
                        <p className="text-lg font-semibold leading-snug cursor-pointer">
                          {item.name}
                        </p>
                      </Link>
                      <div className="mt-3">
                        {item.is_package === "Yes" && (
                          <span className="absolute right-4 -top-0.5 bg-[#189ED3] px-3 py-1 text-xs rounded-bl-xl rounded-br-xl shadow-2xl">
                            Package
                          </span>
                        )}
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
                        </div>

                        {/* UI FIX: Only render the white box if discount > 0 */}
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
                            <Trash2 className="size-4 text-white" />
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

        {/* DOTS WITH COUNTER */}
        <div className="flex justify-center items-center gap-2 mt-4">
          {relatedCartItems.map((_, i) =>
            index === i ? (
              <span
                key={i}
                className="bg-gradient-to-b from-[#727070] to-[#C1C1C1] text-white text-xs px-2 py-1 rounded-full font-medium"
              >
                {i + 1}/{relatedCartItems.length}
              </span>
            ) : (
              <span
                key={i}
                onClick={() => setIndex(i)}
                className="h-2 w-2 rounded-full cursor-pointer bg-gray-300"
              />
            ),
          )}
        </div>
      </div>
    </section>
  );
}
