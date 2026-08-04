"use client";
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import BannerSlider from "@/components/BannerSlider";
import { X, Search, Loader2, Trash2 } from "lucide-react";
import FaqAccordion from "@/components/FaqAccordion";
import Link from "next/link";
import { HealthItem, useItems } from "@/hooks/useItems";
import { useCity } from "@/context/CityContext";
import { useCart } from "@/hooks/useCart";
import { useUser } from "@/context/userContext";
import { toast } from "react-toastify";
import { useModalStore } from "@/app/store/modal.store";
import RecommendedPackages from "@/components/RecommendedPackages";

interface FilterData {
  Category?: { filterID: string; name: string }[];
  Diseases?: { filterID: string; name: string }[];
}

export default function PathologyItem() {
  const { cityDetails } = useCity();
  const [isToggled, setIsToggled] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState("");
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [cartItemMap, setCartItemMap] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState<Record<string, boolean>>({});
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(searchValue);

  const { user } = useUser();
  const { open } = useModalStore();

  const {
    handleAddToCart,
    removeFromCart,
    loading: cartLoading,
    cartItems,
    fetchCartList,
  } = useCart(user?.userID, user?.userPhone, "");

  const [selectedDiseases, setSelectedDiseases] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [diseaseSearch, setDiseaseSearch] = useState("");
  const [categorySearch, setCategorySearch] = useState("");
  const [temporarySelectedDiseases, setTemporarySelectedDiseases] = useState<
    string[]
  >([]);
  const bannerCache = useRef<any[]>([]);

  const [temporarySelectedCategories, setTemporarySelectedCategories] =
    useState<string[]>([]);

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

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchValue);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchValue]);

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
      pageType: "Pathology",
      departmentID: "2",
      cityID: cityDetails?.id,
      typeID: isToggled ? "1" : "1,2",
      sortBy: selectedSort,
      diseaseID: selectedDiseases.join(","),
      categoryID: selectedCategories.join(","),
      search: debouncedSearch,
    }),
    [
      isToggled,
      selectedSort,
      selectedDiseases,
      selectedCategories,
      debouncedSearch,
    ],
  );

  const {
    items,
    banners,
    filters = {},
    title,
    hasMore,
    fetchNextPage,
    loadingMore,
    initialLoading,
    hasFetchedOnce,
    relatedCartItems,
    page,
  } = useItems(hookParams);

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

  const prevFiltersRef = useRef(hookParams);
  useEffect(() => {
    if (JSON.stringify(prevFiltersRef.current) !== JSON.stringify(hookParams)) {
      prevFiltersRef.current = hookParams;
    }
  }, [hookParams]);

  const toggleFilter = (filterID: string, type: "category" | "disease") => {
    if (type === "category") {
      setTemporarySelectedCategories((prev) =>
        prev.includes(filterID)
          ? prev.filter((id) => id !== filterID)
          : [...prev, filterID],
      );
    } else if (type === "disease") {
      setTemporarySelectedDiseases((prev) =>
        prev.includes(filterID)
          ? prev.filter((id) => id !== filterID)
          : [...prev, filterID],
      );
    }
  };

  const removeFilter = (type: "disease" | "category", filterName: string) => {
    const { Category = [], Diseases = [] } = filters as FilterData;

    const getFilterID = (name: string, data: any[]) => {
      const item = data.find((item) => item.name === name);
      return item ? item.filterID : null;
    };

    if (type === "disease") {
      const diseaseID = getFilterID(filterName, Diseases);
      if (diseaseID) {
        setSelectedDiseases((prev) => prev.filter((d) => d !== diseaseID));
        setTemporarySelectedDiseases((prev) =>
          prev.filter((d) => d !== diseaseID),
        );
      }
    } else {
      const categoryID = getFilterID(filterName, Category);
      if (categoryID) {
        setSelectedCategories((prev) => prev.filter((c) => c !== categoryID));
        setTemporarySelectedCategories((prev) =>
          prev.filter((c) => c !== categoryID),
        );
      }
    }
  };

  const handlePathologyClick = () => {
    setSelectedDiseases(temporarySelectedDiseases);
    setSelectedCategories(temporarySelectedCategories);
    setIsFilterOpen(false);
  };

  const getFilterLabel = useCallback(
    (id: string, type: "disease" | "category") => {
      const { Category = [], Diseases = [] } = filters as FilterData;
      const data = type === "disease" ? Diseases : Category;
      const filter = data.find((item) => item.filterID === id);
      return filter ? filter.name : id;
    },
    [filters],
  );

  const { Category = [], Diseases = [] }: FilterData = filters;

  const filteredDiseases = Diseases.filter((disease: { name: string }) =>
    disease.name.toLowerCase().includes(diseaseSearch.toLowerCase()),
  );

  const filteredCategories = Category.filter((category: { name: string }) =>
    category.name.toLowerCase().includes(categorySearch.toLowerCase()),
  );

  // All selected filters for display
  const allSelectedFilters = [
    ...temporarySelectedDiseases.map((id) => ({
      type: "disease" as const,
      id,
    })),
    ...temporarySelectedCategories.map((id) => ({
      type: "category" as const,
      id,
    })),
  ];

  const formatPrice = (val: string) => {
    const num = Math.floor(parseFloat(val));
    return isNaN(num) ? "₹0" : `₹${num.toLocaleString("en-IN")}`;
  };
  if (banners.length && bannerCache.current.length === 0) {
    bannerCache.current = banners;
  }

  return (
    <div className="">
      {isFilterOpen && (
        <>
          <div
            className="fixed inset-0 bg-opacity-50 backdrop-blur-[1px] z-40"
            onClick={() => setIsFilterOpen(false)}
          />

          {/* Slide-in Panel - NEW DESIGN */}
          <div className="fixed top-0 left-0 h-full w-[75%] bg-white z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto translate-x-0">
            {/* Close Button */}
            <button
              onClick={() => setIsFilterOpen(false)}
              className="absolute right-4 top-4 p-2 hover:bg-gray-100 rounded-full z-50"
            >
              <X size={24} />
            </button>

            <div className="p-6">
              {/* Selected Filters - NEW DESIGN */}
              {allSelectedFilters.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-bold mb-3 text-gray-700">
                    FILTERS
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {allSelectedFilters.map((filter) => (
                      <button
                        key={`${filter.type}-${filter.id}`}
                        onClick={() =>
                          removeFilter(
                            filter.type,
                            getFilterLabel(filter.id, filter.type),
                          )
                        }
                        className="bg-white border border-gray-400 px-3 py-1.5 rounded text-xs font-medium text-gray-700 flex items-center gap-2 hover:bg-gray-50"
                      >
                        {getFilterLabel(filter.id, filter.type).toUpperCase()}
                        <X size={14} />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Filter By Section */}
              <div className="mb-6">
                <h3 className="text-sm font-bold mb-4 text-gray-700">
                  FILTER BY
                </h3>
              </div>

              {/* Diseases/Risk Areas - NEW DESIGN */}
              <div className="mb-6 bg-white rounded-lg shadow-sm p-4">
                <h3 className="text-sm font-bold mb-3 text-gray-700">
                  DISEASES/RISK AREAS
                </h3>
                <div className="relative mb-4">
                  <input
                    type="text"
                    placeholder="Search"
                    value={diseaseSearch}
                    onChange={(e) => setDiseaseSearch(e.target.value)}
                    className="w-full px-3 py-2 border-b-2 border-gray-300 focus:border-red-500 outline-none text-sm"
                  />
                  <Search
                    className="absolute right-2 top-2 text-red-500"
                    size={20}
                  />
                </div>
                <div className="max-h-64 overflow-y-auto pr-2">
                  {filteredDiseases.map((disease) => (
                    <label
                      key={disease.filterID}
                      className="flex items-center mb-3 cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        checked={temporarySelectedDiseases.includes(
                          disease.filterID,
                        )}
                        onChange={() =>
                          toggleFilter(disease.filterID, "disease")
                        }
                        className="w-5 h-5 mr-3 accent-blue-600 cursor-pointer"
                      />
                      <span className="text-base font-medium group-hover:text-blue-600">
                        {disease.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Categories - NEW DESIGN */}
              <div className="mb-6 bg-white rounded-lg shadow-sm p-4">
                <h3 className="text-sm font-bold mb-3 text-gray-700">
                  CATEGORIES
                </h3>
                <div className="relative mb-4">
                  <input
                    type="text"
                    placeholder="Search"
                    value={categorySearch}
                    onChange={(e) => setCategorySearch(e.target.value)}
                    className="w-full px-3 py-2 border-b-2 border-gray-300 focus:border-red-500 outline-none text-sm"
                  />
                  <Search
                    className="absolute right-2 top-2 text-red-500"
                    size={20}
                  />
                </div>
                <div className="max-h-64 overflow-y-auto pr-2">
                  {filteredCategories.map((category) => (
                    <label
                      key={category.filterID}
                      className="flex items-center mb-3 cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        checked={temporarySelectedCategories.includes(
                          category.filterID,
                        )}
                        onChange={() =>
                          toggleFilter(category.filterID, "category")
                        }
                        className="w-5 h-5 mr-3 accent-blue-600 cursor-pointer"
                      />
                      <span className="text-base font-medium group-hover:text-blue-600">
                        {category.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Apply Button - NEW DESIGN */}
              <button
                onClick={handlePathologyClick}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-3 mb-24 px-4 rounded-md font-medium flex items-center justify-center gap-2 transition-colors"
              >
                Apply Filters
                <span className="text-lg">›</span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* Show shimmer effect while banners are loading */}
      {initialLoading && bannerCache.current.length === 0 ? (
        <div className="shimmer-wrapper">
          <div className="shimmer-beam" />
        </div>
      ) : (
        <BannerSlider banners={bannerCache.current} />
      )}

      <section className="grid p-4 bg-[#F9F9F9] mb-2">
        <div className="">
          <h2 className="font-semibold text-xl tx-blue">{title}</h2>
        </div>
      </section>

      <section>
        <div className="bg-white flex justify-center pb-4 pt-2">
          <div className="px-4 w-full">
            {/* Top bar */}
            <div className="flex items-center justify-between mb-3 text-xs font-medium text-gray-700">
              <div className="flex items-center gap-4">
                {/* Filter button opens sidebar */}
                <button
                  onClick={() => setIsFilterOpen(true)}
                  className="flex items-center gap-1"
                >
                  <img src="/assets/svg/filter.svg" alt="" className="w-6" />
                  <span className="text-sm text-gray-700">Filter</span>
                </button>
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

            {items.map((item, index) => {
              const discountValue = parseFloat(item.percentage);
              const showDiscount = !isNaN(discountValue) && discountValue > 0;
              const isItemInCart = !!cartItemMap[item.itemID];
              const processing = isProcessing[item.itemID];
              return (
                <div key={index} className="min-w-full px-1 mt-6">
                  <div className="rounded-xl shadow-md bg-white overflow-hidden">
                    <div className="relative gradient-blue-2 text-white p-4 rounded-xl">
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
            })}
            {/* Load More Button */}
            {hasFetchedOnce && !initialLoading && hasMore && (
              <div className="w-full text-center">
                <button
                  onClick={fetchNextPage}
                  disabled={loadingMore}
                  className={`mt-6 mb-4 py-2 px-6 rounded text-[#189ED3] border font-medium shadow
                  ${
                    loadingMore
                      ? "border-gray-400 cursor-not-allowed"
                      : "border-[#189ED3]"
                  }`}
                >
                  {loadingMore ? "Loading..." : "Load More"}
                </button>
              </div>
            )}

            {/* End message */}
            {!hasMore && page > 1 && (
              <p className="text-center py-6 text-gray-400">
                You’ve reached the end
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="mb-6 px-4">
        <Link href={`/tests/mri-left-knee-joint/${cityDetails?.slug}`}>
          <div className="flex items-center justify-between gradient-green rounded-2xl px-5 py-4 shadow-lg">
            <p className="text-white font-medium text-base">
              Can't find what you're
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
      {/* <section>
        <div className="bg-white px-4 py-6 rounded-xl border-1 shadow-sm m-2 mb-8 border-gray-100">
          <h2 className="text-xl font-semibold mb-4">
            What is Vitamin Screening
          </h2>
          <p className="text-gray-700 text-base mb-6">
            A comprehensive vitamin screen moves beyond checking for a single
            deficiency and instead provides a complete snapshot of your
            nutritional status. This type of panel is typically ordered when
            symptoms are generalized or when a person has multiple risk factors
            for deficiency. It analyzes the levels of both fat-soluble vitamins
            (which are stored in the body's tissues) and key water-soluble
            vitamins (which need regular replenishment).
          </p>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              Fat-Soluble Vitamins (Stored in Liver & Fat Tissues)
            </h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>
                <span className="font-semibold text-[#05AF79]">
                  Vitamin D (25-Hydroxy):
                </span>{" "}
                Crucial for bone health, immune function, and calcium
                absorption. The most commonly tested vitamin.
              </li>
              <li>
                <span className="font-semibold text-[#05AF79]">
                  Vitamin A (Retinol):
                </span>{" "}
                Essential for vision, immune defense, and skin health.
              </li>
              <li>
                <span className="font-semibold text-[#05AF79]">
                  Vitamin E (Alpha-Tocopherol):
                </span>{" "}
                A key antioxidant that protects cells from damage.
              </li>
              <li>
                <span className="font-semibold text-[#05AF79]">
                  Vitamin K (often K1):
                </span>{" "}
                Vital for proper blood clotting and bone metabolism.
              </li>
            </ul>
          </div>
          <a href="#" className="tx-green font-medium hover:underline">
            ...Read More
          </a>
        </div>
      </section> */}

      <section>
        <FaqAccordion pageType={"pathology"} />
      </section>
      {relatedCartItems && relatedCartItems.length > 0 && (
        <section className="p-4 bg-[#EAF6FD] mt-6">
          <RecommendedPackages relatedCartItems={relatedCartItems} />
        </section>
      )}
    </div>
  );
}
