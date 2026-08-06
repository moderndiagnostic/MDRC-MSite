"use client";
import BannerSlider from "@/components/BannerSlider";
import FaqAccordion from "@/components/FaqAccordion";
import Link from "next/link";
import { HealthItem, useItems } from "@/hooks/useItems";
import { useParams } from "next/navigation";
import { useCity } from "@/context/CityContext";
import { toast } from "react-toastify";
import { useModalStore } from "@/app/store/modal.store";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useCart } from "@/hooks/useCart";
import { useUser } from "@/context/userContext";
import { Loader2, Trash2 } from "lucide-react";
import { ContactInquiryModal } from "@/components/modals/ContactInquiryModal";
import RecommendedPackages from "@/components/RecommendedPackages";

interface RadiologyTest {
  name: string;
  slug: string;
  short_description: string;
  image: string;
  url: string;
  starting_price?: string | null;
}

export default function DiseasesItemList() {
  const { slug } = useParams<{ slug: string[] }>();
  const { cityDetails } = useCity();
  const { open } = useModalStore();
  const { user } = useUser();
  const diseaseSlug = slug?.[1];

  const [cartItemMap, setCartItemMap] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState<Record<string, boolean>>({});
  const [slide, setSlide] = useState<number>(0);
  const [openInquiry, setOpenInquiry] = useState(false);
  const [isToggled, setIsToggled] = useState(false);
  const [selectedSort, setSelectedSort] = useState("");
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(searchValue);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchValue);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchValue]);

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

  const handleToggle = () => {
    setIsToggled(!isToggled);
  };

  const handleSortChange = (sortBy: string) => {
    setSelectedSort(sortBy);
    setIsSortDropdownOpen(false);
  };

  const handleSortDropdownToggle = () => {
    setIsSortDropdownOpen(!isSortDropdownOpen);
  };

  const hookParams = useMemo(
    () => ({
      pageType: "Diseases",
      diseaseSlug: diseaseSlug ?? "",
      cityID: cityDetails?.id,
      typeID: isToggled ? "1" : "1,2",
      sortBy: selectedSort,
      search: debouncedSearch,
    }),
    [isToggled, selectedSort, debouncedSearch],
  );

  const {
    items,
    banners,
    initialLoading,
    loadingMore,
    title,
    hasMore,
    fetchNextPage,
    hasFetchedOnce,
    page,
    relatedCartItems,

    radiologyAndImagingTest,
  } = useItems(hookParams);

  const tests = radiologyAndImagingTest as RadiologyTest[];

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

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const itemsPerSlide = 3;
  const groupedSlides = [];

  for (let i = 0; i < tests.length; i += itemsPerSlide) {
    groupedSlides.push(tests.slice(i, i + itemsPerSlide));
  }

  const totalSlides = groupedSlides.length;

  useEffect(() => {
    if (totalSlides <= 1) return;
    const timer = setInterval(() => {
      setSlide((prev) => (prev + 1) % totalSlides);
    }, 4000);
    return () => clearInterval(timer);
  }, [totalSlides]);

  const handleTouchStart = (e: any) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchMove = (e: any) => {
    touchEndX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > 50) {
      setSlide((prev) => (prev + 1) % totalSlides);
    } else if (touchEndX.current - touchStartX.current > 50) {
      setSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
    }
  };

  const showBannerShimmer =
    initialLoading && (!banners || banners.length === 0);

  return (
    <div className="">
      {showBannerShimmer ? (
        <div className="shimmer-wrapper">
          <div className="shimmer-beam" />
        </div>
      ) : (
        <BannerSlider banners={banners} />
      )}

      {title.trim() !== "" && (
        <section className="grid p-4 bg-[#F9F9F9] mb-2">
          <div className="">
            <h2 className="font-semibold text-xl tx-blue">
              {title} Tests/Packages
            </h2>
          </div>
        </section>
      )}

      <section>
        <div className="bg-white flex justify-center pb-4 pt-2">
          <div className="px-4 w-full">
            {/* Top bar */}
            <div className="flex items-center justify-between mb-3 text-xs font-medium text-gray-700">
              <div className="flex items-center gap-4">
                {/* Sort dropdown */}
                <div className="relative">
                  <button
                    className="flex items-center gap-1"
                    onClick={handleSortDropdownToggle}
                  >
                    <img src="/assets/svg/sort.svg" alt="" className="w-6" />
                    <span className="text-sm text-gray-700">Sort</span>
                  </button>
                  {/* Dropdown */}
                  {isSortDropdownOpen && (
                    <div className="absolute top-10 mt-2 w-40 bg-white shadow-lg rounded-md z-10 border border-gray-400">
                      <ul>
                        <li
                          className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-200"
                          onClick={() => handleSortChange("")}
                        >
                          Latest
                        </li>
                        <li
                          className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-200"
                          onClick={() => handleSortChange("name_a_z")}
                        >
                          Name (A-Z)
                        </li>
                        <li
                          className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-200"
                          onClick={() => handleSortChange("name_z_a")}
                        >
                          Name (Z-A)
                        </li>
                        <li
                          className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-200"
                          onClick={() => handleSortChange("price_l_h")}
                        >
                          Price (Low to High)
                        </li>
                        <li
                          className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-200"
                          onClick={() => handleSortChange("price_h_l")}
                        >
                          Price (High to Low)
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1">
                <div className="flex items-center space-x-3">
                  {/* Toggle Switch */}
                  <div
                    onClick={handleToggle}
                    className={`relative inline-block w-10 h-6 cursor-pointer transition-all duration-300 rounded-full
                      ${isToggled ? "bg-green-400" : "bg-[#c4babac7]"}`}
                  >
                    <div
                      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-all duration-300
                        ${isToggled ? "translate-x-4" : "translate-x-0"}`}
                    ></div>
                  </div>
                  <label className="text-sm font-semibold">Package</label>
                </div>
              </div>
            </div>

            <div className="relative flex-1 py-2">
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder={"Search"}
                className="w-full h-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:gradient-blue"
              />
              <img
                src="/assets/images/header/search.svg"
                alt="Search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sky-600"
              />
            </div>

            {items.length < 0 ? (
              <div className="p-6 text-center bg-gradient-to-b from-[#F0FAFF] to-white rounded-xl mt-6">
                <div className="mx-auto w-16 h-16 rounded-full bg-[#189ED3]/10 flex items-center justify-center mb-4">
                  <span className="text-[#189ED3] text-2xl font-bold">!</span>
                </div>
                <h2 className="text-xl text-center font-semibold text-[#1160a5] mb-2">
                  Not Available
                </h2>
              </div>
            ) : (
              items.map((item, index) => {
                const discountValue = parseFloat(item.percentage);
                const showDiscount = !isNaN(discountValue) && discountValue > 0;
                const isItemInCart = !!cartItemMap[item.itemID];
                const processing = isProcessing[item.itemID];

                return (
                  <div key={index} className="min-w-full px-1 mt-6">
                    <div className="rounded-xl shadow-md bg-white overflow-hidden">
                      <div className="relative gradient-blue-2 text-white p-4 rounded-xl">
                        <div className="flex justify-between items-center">
                          <Link
                            href={`/tests/${item.slug}/${cityDetails?.slug}`}
                          >
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
                            <div className="flex gap-2 items-center">
                              {parseFloat(item.mrp) > 0 && (
                                <span className="line-through text-sm opacity-70">
                                  {formatPrice(item.mrp)}
                                </span>
                              )}
                              <span className="text-xl font-semibold">
                                {formatPrice(item.price)}
                              </span>
                            </div>
                            <div className="text-end mt-2">
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
                        <Link href={`/tests/${item.slug}/${cityDetails?.slug}`}>
                          <button className="flex-1 w-full border border-gray-400 rounded-lg py-2 text-gray-700 font-medium">
                            View Details
                          </button>
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
              })
            )}

            {hasFetchedOnce && !initialLoading && hasMore && (
              <div className="w-full text-center">
                <button
                  onClick={fetchNextPage}
                  disabled={loadingMore}
                  className={`mt-4 mb-2 py-2 px-6 rounded text-[#189ED3] border font-medium shadow
                  ${loadingMore ? "border-gray-400 cursor-not-allowed" : "border-[#189ED3]"}`}
                >
                  {loadingMore ? "Loading..." : "Load More"}
                </button>
              </div>
            )}
            {!hasMore && page > 1 && (
              <p className="text-center py-6 text-gray-400">
                You’ve reached the end
              </p>
            )}

            {/* Bottom CTA */}
            <div className="mt-8 rounded-xl cursor-pointer bg-[#E6F8FF] flex items-center justify-between px-4 py-3">
              <div
                onClick={() => setOpenInquiry(true)}
                className="flex gap-4 items-center"
              >
                <img src="/assets/images/logo/call.svg" alt="call" />
                <div>
                  <h4 className="text-[14px] tx-blue font-semibold">
                    Unable To Find The Right Test/Scan ?
                  </h4>
                  <p className="text-sm font-medium tx-blue">
                    Request a Call Back
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="mb-8 px-4">
        <Link href={`/tests/mri-left-knee-joint/${cityDetails?.slug}`}>
          <div className="flex items-center justify-between gradient-green rounded-2xl px-5 py-4 shadow-lg">
            <p className="text-white font-medium text-base">
              Can’t find what you’re
              <br />
              looking for?
            </p>
            <div className="relative flex items-center justify-center">
              {/* Pulse ring */}
              <span className="absolute inline-flex h-12 w-12 rounded-full bg-white opacity-30 animate-ping"></span>

              {/* Icon container */}
              <div className="relative  rounded-full h-14 w-14 flex items-center justify-center shadow-[0_0_15px_rgba(0,0,0,0.15)] ">
                <img
                  src="/assets/images/logo/whatsapp.svg"
                  alt="WhatsApp"
                  className="h-12 w-12"
                />
              </div>
            </div>
          </div>
        </Link>
      </section>

      <section>
        <FaqAccordion pageType={"diseases"} pageSlug={diseaseSlug} />
      </section>

      {relatedCartItems && relatedCartItems.length > 0 && (
        <section className="p-4">
          <RecommendedPackages relatedCartItems={relatedCartItems} />
        </section>
      )}

      {groupedSlides?.length > 0 && (
        <section className="my-4 bg-gradient-to-b from-[#E6F8FF] to-[#FFFFFF] py-6 px-4">
          <h2 className="text-center text-xl font-semibold text-gray-800 mb-6">
            Other Test by Conditions
          </h2>
          <div className="overflow-hidden relative px-1 pb-4">
            <div
              className="flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${slide * 100}%)` }}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {groupedSlides.map((group, groupIdx) => (
                <div
                  key={groupIdx}
                  className="min-w-full grid grid-cols-3 gap-4 px-2"
                >
                  {group.map((test, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-2xl shadow-[0_0_6px_rgba(0,0,0,0.15)] p-3 flex flex-col items-center text-center justify-between"
                    >
                      <div className="flex flex-col items-center">
                        <Link
                          href={`/diseases/${cityDetails?.slug}/${test.slug}`}
                        >
                          <img
                            src={test.image}
                            alt={test.name}
                            className="h-16 w-auto object-contain mb-4"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "/assets/images/placeholder.png";
                            }}
                          />
                          <p className="tx-light-blue font-medium text-sm line-clamp-2 leading-tight">
                            {test.name}
                          </p>
                        </Link>
                        {/* Price Logic: Only show if price exists and is not empty */}
                        {test.starting_price && test.starting_price !== "" && (
                          <p className="text-gray-600 text-[11px] mt-1">
                            {test.starting_price}
                          </p>
                        )}
                      </div>

                      <Link
                        href={`/diseases/${cityDetails?.slug}/${test.slug}`}
                        className="w-full"
                      >
                        <button className="mt-3 w-full border border-emerald-500 tx-green rounded-lg px-2 py-1.5 text-[10px] font-bold hover:bg-emerald-50 transition-colors uppercase">
                          VIEW MORE
                        </button>
                      </Link>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Dots / Pagination */}
            {totalSlides > 1 && (
              <div className="flex justify-center items-center gap-2 mt-6">
                {groupedSlides.map((_, i) =>
                  slide === i ? (
                    <span
                      key={i}
                      className="bg-gradient-to-b from-[#727070] to-[#C1C1C1] text-white text-[10px] px-2 py-0.5 rounded-full font-medium"
                    >
                      {i + 1}/{totalSlides}
                    </span>
                  ) : (
                    <span
                      key={i}
                      onClick={() => setSlide(i)}
                      className="h-2 w-2 rounded-full cursor-pointer bg-gray-300"
                    />
                  ),
                )}
              </div>
            )}
          </div>
        </section>
      )}


      <ContactInquiryModal
        isOpen={openInquiry}
        onClose={() => setOpenInquiry(false)}
      />
    </div>
  );
}
