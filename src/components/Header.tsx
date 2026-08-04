"use client";

import { useLocations } from "@/hooks/useLocations";
import { MENU_STORAGE_KEY, useMenu } from "@/hooks/useMenu";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "@/context/userContext"; // Import user context
import {
  Menu,
  Search,
  X,
  ChevronRight,
  Star,
  LocateFixed,
  ChevronLeft,
} from "lucide-react";
import { useModalStore } from "../app/store/modal.store";
// import TopHeader from "./TopHeader";
import searchService from "@/services/search";
import { useCart } from "@/hooks/useCart";
import { useDashboard } from "@/context/DashboardContext";
import { useCity } from "@/context/CityContext";
import Cookies from "js-cookie";
import MenuService from "@/services/menu";
import { ContactInquiryModal } from "./modals/ContactInquiryModal";
import { useCartContext } from "@/context/CartContext";
import { toast } from "react-toastify";
// Add interface for API menu structure
interface ApiMenuItem {
  title: string;
  link: string;
  type?: string;
  child: ApiMenuItem[];
}

// Helper function to transform API menu to component format
const transformMenuItem = (item: ApiMenuItem): any => {
  return {
    title: item.title,
    href: item.link === "#" ? undefined : item.link,
    type: item.type,
    children:
      item.child?.length > 0 ? item.child.map(transformMenuItem) : undefined,
  };
};

interface MenuItem {
  title: string;
  link: string;
  type?: string;
  child: MenuItem[];
}

interface MenuData {
  menuList: MenuItem[];
  common: {
    cityId: string;
    cityName: string;
    citySlug: string;
  };
}

export default function Header() {
  const {
    cities,
    loading: locationLoading,
    error: locationError,
  } = useLocations();

  const { menuList } = useMenu();
  const { homeData } = useDashboard();
  const { cityDetails, updateCityDetails } = useCity();

  const pathname = usePathname();
  const isHome = pathname === "/";

  const [expandedAccordion, setExpandedAccordion] = useState<number | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fullSuggestions, setFullSuggestions] = useState([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [openMenu, setOpenMenu] = useState(false);
  const [openLocation, setOpenLocation] = useState(false);
  const [openStack, setOpenStack] = useState<number[]>([]);
  const [openInquiry, setOpenInquiry] = useState(false);
  const [locating, setLocating] = useState(false);

  const { open } = useModalStore();
  const searchPlaceholder = "Search for a Test, Nearest Centres";
  const router = useRouter(); // Get the Next.js router instance

  const [searchValue, setSearchValue] = useState("");
  const [displayedPlaceholder, setDisplayedPlaceholder] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const { user, setUser } = useUser();
  const { clearCart } = useCart(user?.userID, user?.userPhone, "");
  const { clearCartContext, cartCount } = useCartContext();
  const didSetDefault = useRef(false);
  const modalInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (openMenu) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [openMenu]);

  const saveMenuToStorage = (data: MenuData, cityId: string) => {
    sessionStorage.setItem(
      `${MENU_STORAGE_KEY}_${cityId}`,
      JSON.stringify(data),
    );
  };

  const handleSelectCity = async (cityName: string) => {
    if (cityName === cityDetails?.name) {
      return setOpenLocation(false);
    }

    const selectedCityDetails = cities.find((city) => city.name === cityName);

    if (!selectedCityDetails) return;

    updateCityDetails(selectedCityDetails);

    sessionStorage.removeItem(`${MENU_STORAGE_KEY}_${selectedCityDetails.id}`);

    if (user?.userID && user?.userPhone) {
      await clearCart();
    }

    const payload: any = {
      view: "common",
      cityID: selectedCityDetails?.id,
    };

    const response = await MenuService.getMenuList(payload);

    if (response?.msgCode === "1" && response?.data) {
      const data = response.data;
      saveMenuToStorage(data, selectedCityDetails.id);
    } else {
      throw new Error(response?.message || "Failed to saved menu");
    }

    setOpenLocation(false);

    router.push("/");
    router.refresh();
  };

  // Search Placeholder Animation
  useEffect(() => {
    if (!isSearchFocused && searchValue === "") {
      let currentIndex = 0;
      let timeoutId: ReturnType<typeof setTimeout>;

      const animate = () => {
        if (currentIndex <= searchPlaceholder.length) {
          setDisplayedPlaceholder(searchPlaceholder.slice(0, currentIndex));
          currentIndex++;
          timeoutId = setTimeout(animate, 50);
        } else {
          timeoutId = setTimeout(() => {
            currentIndex = 0;
            setDisplayedPlaceholder("");
            animate();
          }, 1000);
        }
      };
      animate();
      return () => clearTimeout(timeoutId);
    } else {
      setDisplayedPlaceholder(searchPlaceholder);
    }
  }, [isSearchFocused, searchValue]);

  const menu = menuList.map(transformMenuItem);

  const handleLogout = async () => {
    try {
      clearCartContext();
    } catch (err) {
      console.error("Cart clear failed", err);
    }
    toast.success("Logged out successfully!");
    localStorage.removeItem("auth_user");
    Cookies.remove("auth_user", { path: "/" });
    setUser(null);
    setOpenMenu(false);
    router.push("/");
    // open("login")
  };

  const handleModalOpen = async () => {
    setIsModalOpen(true);
    try {
      const response = await searchService.globalSearch(cityDetails?.id);
      setFullSuggestions(response?.result?.itemList);
      setFilteredSuggestions(response?.result?.itemList);
    } catch (error) {
      console.error("Error fetching search suggestions:", error);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSearchValue("");
  };

  const getAcronym = (text: string) => {
    return text
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toLowerCase();
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchValue(query);

    if (query.length >= 2) {
      const filtered = fullSuggestions.filter((item: any) => {
        const name = item?.name?.toLowerCase() || "";

        const acronym = getAcronym(name);

        return (
          name.includes(query) || // normal search
          acronym.includes(query) // APSP match
        );
      });

      setFilteredSuggestions(filtered);
    } else {
      setFilteredSuggestions(fullSuggestions);
    }
  };

  useEffect(() => {
    if (openMenu) {
      didSetDefault.current = false;
    }
  }, [openMenu]);

  useEffect(() => {
    if (openMenu && !didSetDefault.current && menu?.length) {
      const defaultIndex = menu.findIndex(
        (item: any) => item.title === "Book Your Blood Test",
      );

      if (defaultIndex !== -1) {
        setExpandedAccordion(defaultIndex);
        didSetDefault.current = true;
      }
    }
  }, [openMenu, menu]);

  useEffect(() => {
    if (isModalOpen) {
      setTimeout(() => {
        modalInputRef.current?.focus();
      }, 0);
    }
  }, [isModalOpen]);

  const findMatchedCity = (detectedCity: string) => {
    if (!detectedCity) return null;

    const normalized = detectedCity.toLowerCase();

    return cities.find((city) => {
      const cityName = city.name.toLowerCase();
      const citySlug = city.slug.toLowerCase();

      return (
        normalized.includes(cityName) ||
        normalized.includes(citySlug) ||
        cityName.includes(normalized)
      );
    });
  };

  const handleUseCurrentLocation = async () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported");
      return;
    }

    setLocating(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

          const res = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`,
          );

          const data = await res.json();

          let cityName = "";

          if (data.results.length > 0) {
            const components = data.results[0].address_components;

            const cityComponent = components.find((c: any) =>
              c.types.includes("locality"),
            );

            const districtComponent = components.find((c: any) =>
              c.types.includes("administrative_area_level_2"),
            );

            cityName =
              cityComponent?.long_name || districtComponent?.long_name || "";
          }

          if (!cityName) {
            toast.error("City not detected");
            setLocating(false);
            return;
          }

          const matchedCity = findMatchedCity(cityName);

          if (matchedCity) {
            await handleSelectCity(matchedCity.name);
          } else {
            toast.info(`We are not available at ${cityName}`);
          }
        } catch (err) {
          console.error(err);
          toast.error("Location detection failed");
        }

        setLocating(false);
      },
      (error) => {
        console.error(error);
        toast.error("Please allow location access");
        setLocating(false);
      },
    );
  };

  const isTestDetailPage = /^\/tests\/[^/]+\/[^/]+$/.test(pathname);
  const hasItems = cartCount > 0;
  const isCartOrCheckout =
    pathname === "/cart" ||
    pathname === "/checkout" ||
    pathname === "/account/help" ||
    pathname === "/account" ||
    pathname === "/order";

  const shouldShowCartPopup = hasItems && !isCartOrCheckout;

  const citiesWithImages = cities.filter((city) => city.image);
  const citiesWithoutImages = cities.filter((city) => !city.image);

  return (
    <>
      {/* {!isHome && <TopHeader />} */}

      {/* ================= HEADER MAIN ================= */}
      <header className="sticky top-0 z-40 bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 py-2">
          <Link href="/">
            <img
              src="/assets/images/logo/mdrc-logo.svg"
              alt="MDRC"
              className="h-8"
            />
          </Link>

          {/* Location Selector */}
          <button
            onClick={() => setOpenLocation(true)}
            className="flex items-center gap-1 text-sm font-medium text-gray-700"
            disabled={locationLoading}
          >
            <img
              src="/assets/images/header/location.svg"
              alt="location"
              className="h-6"
            />
            {cityDetails?.name || "Loading..."}
          </button>

          <div className="flex gap-2">
            <Link href={`tel:${cityDetails?.phone}`}>
              <button className="h-9 w-9 rounded-full bg-[#EEEEEE] tx-blue flex items-center justify-center">
                <img
                  src="/assets/images/header/call1.svg"
                  alt="Call"
                  className="h-8"
                />
              </button>
            </Link>

            {user?.userID ? (
              <div className="flex gap-2">
                <Link href="/account">
                  <button className="h-9 w-9 rounded-full bg-[#EEEEEE] border border-neutral-200 tx-blue flex items-center justify-center">
                    {user?.userImage ? (
                      <img
                        src={user?.userImage || "/assets/images/header/user.svg"}
                        alt="Profile"
                        className="rounded-full object-cover h-full w-full"
                      />
                    ) : (
                      user?.userFirstName.charAt(0).toUpperCase() +
                      user?.userLastName.charAt(0).toUpperCase()
                    )}
                  </button>
                </Link>
              </div>
            ) : (
              <button
                onClick={() => open("login")}
                className="h-9 w-9 rounded-full bg-[#EEEEEE] tx-blue flex items-center justify-center"
              >
                <img src="/assets/images/header/user.svg" alt="Login" />
              </button>
            )}
          </div>
        </div>

        {!isHome && (
          <div className="flex gap-2 px-4 pb-3">
            <div className="relative flex-1" onClick={handleModalOpen}>
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                placeholder={displayedPlaceholder}
                className="w-full h-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:gradient-blue"
              />
              <img
                src="/assets/images/header/search.svg"
                alt="Search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sky-600"
              />
            </div>

            <button
              onClick={() => setOpenMenu(true)}
              className="h-10 w-10 rounded-lg border border-gray-300 flex items-center justify-center tx-blue"
            >
              <Menu size={20} />
            </button>
          </div>
        )}
      </header>

      {/* ================= SEARCH MODAL ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 justify-center">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-white max-w-[430px]">
            <div className="flex items-center gap-2 p-4 shadow-lg">
              <button onClick={handleModalClose}>
                <svg
                  width="26"
                  height="26"
                  viewBox="0 0 26 26"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M19.998 10.98H7.82805L13.418 5.28042L11.998 3.84277L3.99805 11.9996L11.998 20.1566L13.408 18.7189L7.82805 13.0192H19.998V10.98Z"
                    fill="#333333"
                  />
                </svg>
              </button>
              <div className="relative flex-1">
                <input
                  ref={modalInputRef}
                  type="text"
                  value={searchValue}
                  onChange={handleSearchChange}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  placeholder={displayedPlaceholder}
                  className="w-full h-11 rounded-lg border py-2 border-gray-300 px-4 text-sm focus:outline-none"
                />
                <img
                  src="/assets/images/header/search.svg"
                  alt="Search"
                  className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-sky-600"
                />
              </div>
            </div>
            {/* {filteredSuggestions?.length > 0 && (
              <div className="mt-2 h-full overflow-y-auto p-4 mb-5">
                <ul>
                  {filteredSuggestions.map((suggestion: any, index: number) => (
                    <Link
                      href={`/tests/${suggestion.slug}/${cityDetails?.id}`}
                      key={index}
                      onClick={() => {
                        handleModalClose();
                      }}
                    >
                      <li className="px-4 py-3 border-b border-dashed border-neutral-300 cursor-pointer flex justify-between items-center w-full gap-4">
                        <div className="font-medium">{suggestion.name}</div>
                        <div className="text-sm text-gray-500">
                          {suggestion.label}
                        </div>
                      </li>
                    </Link>
                  ))}
                </ul>
              </div>
            )} */}

            {searchValue.length >= 0 && (
              <div className="h-full overflow-y-auto p-4 pb-20 mb-5">
                {filteredSuggestions?.length > 0 ? (
                  <ul>
                    {filteredSuggestions.map(
                      (suggestion: any, index: number) => (
                        <Link
                          href={`/tests/${suggestion.slug}/${cityDetails?.slug}`}
                          key={index}
                          onClick={handleModalClose}
                        >
                          <li className="px-4 py-3 border-b border-dashed border-neutral-300 cursor-pointer flex justify-between items-center w-full gap-4 hover:bg-gray-50 transition">
                            <div className="font-medium">{suggestion.name}</div>
                            <div className="text-sm text-gray-500">
                              {suggestion.label}
                            </div>
                          </li>
                        </Link>
                      ),
                    )}
                  </ul>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="bg-[#EAF6FD] p-4 rounded-full mb-4">
                      {/* <Search size={28} className="tx-blue" /> */}
                      <img
                        src="/assets/images/header/search.svg"
                        alt="MDRC"
                        className="h-6"
                      />
                    </div>

                    <h4 className="text-lg font-semibold text-[#36a4d3] mb-1">
                      No Results Found
                    </h4>

                    <p className="text-sm text-gray-500 max-w-[260px]">
                      We couldn’t find anything for
                      <span className="font-medium text-gray-700">
                        {" "}
                        "{searchValue}"
                      </span>
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= HOME PAGE HEADER EXTENSION ================= */}
      {isHome && (
        <>
          {/* ================= STICKY SEARCH BAR ================= */}
          <div className="sticky top-[52px] z-30 bg-dark-blue">
            <div className="px-4 py-3 flex gap-2">
              <div
                className="relative flex-1 bg-white rounded-lg"
                onClick={handleModalOpen}
              >
                <input
                  type="text"
                  value={searchValue}
                  onChange={handleSearchChange}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  placeholder={displayedPlaceholder}
                  className="w-full rounded-lg px-4 py-2 text-sm focus:outline-none"
                />
                <img
                  src="/assets/images/header/search.svg"
                  alt="Search"
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                />
              </div>

              <button
                onClick={() => setOpenMenu(true)}
                className="h-10 w-10 rounded-lg bg-white flex items-center justify-center"
              >
                <Menu size={20} className="tx-blue" />
              </button>
            </div>
          </div>

          {/* ================= NON-STICKY HOME CONTENT ================= */}
          <section className="bg-dark-blue px-4 pb-6 rounded-b-[24px]">
            {/* Top text */}
            {homeData?.top_text && (
              <div className="py-3 text-center text-white mb-2">
                <div className="relative inline-block">
                  <p className="px-3 font-medium">{homeData?.top_text}</p>
                  <span className="pointer-events-none absolute left-1/2 top-full h-[2px] w-24 -translate-x-1/2 translate-y-1.5 rounded-full gradient-blue" />
                </div>
              </div>
            )}

            {/* Call / WhatsApp / Upload */}
            <div className="grid grid-cols-3 text-white text-xs">
              <Link href={`tel:${cityDetails?.phone}`}>
                <div className="flex items-center justify-center gap-2">
                  <div className="p-2 bg-dark-blue shadow-md rounded-lg">
                    <img
                      src="/assets/images/header/call-color.svg"
                      className="h-5"
                    />
                  </div>
                  <span>
                    Book on{" "}
                    <div>
                      <strong>Call</strong>
                    </div>
                  </span>
                </div>
              </Link>

              <Link href={`https://wa.me/${cityDetails?.whatsapp}`}>
                <div className="flex items-center justify-center gap-2">
                  <div className="p-2 bg-dark-blue shadow-md rounded-lg">
                    <img
                      src="/assets/images/header/whatsapp-color.svg"
                      className="h-5"
                    />
                  </div>
                  <span>
                    Chat on{" "}
                    <div>
                      <strong>WhatsApp</strong>
                    </div>
                  </span>
                </div>
              </Link>

              <div
                className="flex items-center cursor-pointer justify-center gap-2"
                onClick={() => setOpenInquiry(true)}
              >
                <div className="p-2 bg-dark-blue shadow-md rounded-lg">
                  <img
                    src="/assets/images/header/prescription-color.svg"
                    className="h-5"
                  />
                </div>
                <span>
                  Upload{" "}
                  <div>
                    <strong>Prescription</strong>
                  </div>
                </span>
              </div>
            </div>
          </section>
        </>
      )}

      {/* ================= MENU SIDEBAR ================= */}
      <div
        className={`fixed inset-0 z-50 transition ${
          openMenu ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        <div
          onClick={() => {
            setOpenMenu(false);
            setOpenStack([]);
          }}
          className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
            openMenu ? "opacity-100" : "opacity-0"
          }`}
        />

        <aside
          className={`fixed left-0 top-0 h-full w-[90%] max-w-[380px] bg-white z-[70]
            transform transition-transform duration-300 ease-in-out
            ${openMenu ? "translate-x-0" : "-translate-x-full"} 
            ${isTestDetailPage || shouldShowCartPopup ? "pb-24" : ""}`}
        >
          {/* TOP HEADER: USER INFO - Added Login Trigger */}
          <div
            className={`flex items-center gap-3 gradient-blue px-4 py-3 text-white`}
          >
            <div
              className={`flex items-center gap-2 ${!user?.userID ? "cursor-pointer" : ""}`}
              onClick={() => {
                if (!user?.userID) {
                  open("login");
                  setOpenMenu(false);
                }
              }}
            >
              <img
                src={user?.userImage || "/assets/images/logo/avtar.svg"}
                alt="User"
                className="h-10 w-10 rounded-full bg-white"
              />
              <span className="font-semibold text-lg">
                {user?.userID
                  ? `${user?.userFirstName} ${user?.userLastName}`
                  : "Login/Sign-up"}
              </span>
            </div>
            <button
              className="ml-auto"
              onClick={(e) => {
                e.stopPropagation();
                setOpenMenu(false);
                setOpenStack([]);
                setExpandedAccordion(null);
              }}
            >
              <X size={18} />
            </button>
          </div>

          <div className="relative h-[calc(100%-64px)] overflow-hidden">
            <nav
              className={`absolute top-0 left-0 w-full h-full space-y-0 overflow-y-auto bg-white transition-transform duration-300 ease-in-out ${
                openStack.length > 0 ? "-translate-x-full" : "translate-x-0"
              }`}
            >
              {menu.map((item: any, i: number) => {
                const isExpanded = expandedAccordion === i;

                return (
                  <div
                    key={i}
                    className={`border-b border-gray-100 ${i === menu.length - 1 ? "border-b-0" : ""}`}
                  >
                    {item.children ? (
                      <>
                        <button
                          onClick={() =>
                            setExpandedAccordion(isExpanded ? null : i)
                          }
                          className={`flex w-full items-center justify-between px-4 py-3 text-left transition-colors ${
                            isExpanded ? "bg-gray-50" : "bg-white"
                          }`}
                        >
                          <span className="font-bold text-gray-800 tracking-tight uppercase text-[13px]">
                            {item.title}
                          </span>
                          <div
                            className={`p-0.5 rounded transition-all ${
                              isExpanded
                                ? "bg-emerald-600 text-white"
                                : "border border-emerald-600 text-emerald-600"
                            }`}
                          >
                            <ChevronRight
                              size={16}
                              className={`transition-transform duration-300 ${isExpanded ? "rotate-90" : ""}`}
                            />
                          </div>
                        </button>

                        <div
                          className={`overflow-hidden transition-all duration-300 ease-in-out ${
                            isExpanded
                              ? "max-h-[1000px] opacity-100"
                              : "max-h-0 opacity-0"
                          }`}
                        >
                          <div className="bg-white">
                            {item.children.map((sub: any, subIdx: number) => (
                              <div key={subIdx}>
                                {sub.children ? (
                                  <button
                                    onClick={() => setOpenStack([i, subIdx])}
                                    className="flex w-full items-center justify-between px-4 py-2 border-t border-gray-50 text-gray-600 hover:bg-gray-50"
                                  >
                                    <span className="text-sm">{sub.title}</span>
                                    <ChevronRight
                                      size={14}
                                      className="text-gray-400"
                                    />
                                  </button>
                                ) : (
                                  <Link
                                    href={sub.href || "#"}
                                    onClick={() => {
                                      setOpenMenu(false);
                                      setOpenStack([]);
                                    }}
                                    className="block px-4 py-2 border-t border-gray-50 text-gray-600 text-sm hover:bg-gray-50"
                                  >
                                    {sub.title}
                                  </Link>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    ) : (
                      <Link
                        onClick={() => {
                          setOpenMenu(false);
                        }}
                        href={item.href || "#"}
                        className="block px-4 py-2 font-bold text-gray-800 uppercase text-[13px]"
                      >
                        {item.title}
                      </Link>
                    )}
                  </div>
                );
              })}

              {/* Footer Branding */}
              <div className="p-4 mt-6 border-t border-gray-50">
                <p className="font-bold text-gray-800 text-[13px] mb-1">
                  Download Modern Diagnostic Lab App
                </p>
                <div className="flex items-center gap-1 mb-4">
                  <span className="font-bold text-emerald-600 text-xs">
                    4.8 Rating
                  </span>
                  <Star size={12} className="fill-yellow-400 text-yellow-400" />
                </div>
                <div className="flex gap-2">
                  <Link
                    href={
                      "https://play.google.com/store/apps/details?id=com.mdrcindia.booking"
                    }
                    target="_blank"
                  >
                    <img
                      src="/assets/images/logo/google-play.svg"
                      className="h-9"
                      alt="Play Store"
                    />
                  </Link>
                  <Link
                    href={
                      "https://apps.apple.com/us/app/modern-diagnostic-health-app/id6504657715"
                    }
                    target="_blank"
                  >
                    <img
                      src="/assets/images/logo/app-store.svg"
                      className="h-9"
                      alt="App Store"
                    />
                  </Link>
                </div>
              </div>

              {/* Added Logout Button */}
              {user?.userID && (
                <div className="px-4 pb-10">
                  <button
                    onClick={handleLogout}
                    className="w-full py-2.5 text-red-600 font-bold border border-red-200 rounded-lg hover:bg-red-50 text-[13px] uppercase tracking-tight"
                  >
                    Logout
                  </button>
                </div>
              )}
            </nav>

            {/* LAYER 3: SIDEBAR SLIDE-IN */}
            <div
              className={`absolute top-0 left-0 w-full h-full bg-white transition-transform duration-300 ease-in-out ${
                openStack.length > 0 ? "translate-x-0" : "translate-x-full"
              }`}
            >
              {openStack.length > 0 && (
                <>
                  <button
                    onClick={() => setOpenStack([])}
                    className="flex items-center gap-2 px-4 py-3 text-gray-800 font-semibold border-b border-gray-100 w-full bg-gray-50"
                  >
                    <ChevronLeft size={20} />
                    <span className="text-[15px]">
                      {menu[openStack[0]]?.children[openStack[1]]?.title}
                    </span>
                  </button>

                  <nav className="overflow-y-auto h-full pb-20">
                    {menu[openStack[0]]?.children[openStack[1]]?.children?.map(
                      (third: any, k: number) => (
                        <Link
                          key={k}
                          href={third.href || "#"}
                          onClick={() => {
                            setOpenMenu(false);
                            setOpenStack([]);
                          }}
                          className="block px-6 py-2 border-b border-gray-50 text-gray-700 text-sm active:bg-blue-50"
                        >
                          {third.title}
                        </Link>
                      ),
                    )}
                  </nav>
                </>
              )}
            </div>
          </div>
        </aside>
      </div>

      {/* ================= LOCATION SHEET ================= */}
      <div
        className={`fixed inset-0 z-[60] flex items-end justify-center bg-black/40 transition-opacity duration-300
        ${
          openLocation
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setOpenLocation(false)}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className={`
            w-full max-w-md bg-white rounded-t-2xl
            shadow-[0_-8px_24px_rgba(0,0,0,0.12)]
            transition-transform duration-300 ease-out
            max-h-[90vh] flex flex-col
            ${openLocation ? "translate-y-0" : "translate-y-full"}
          `}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">
              Select Your City
            </h3>
            <button
              onClick={() => setOpenLocation(false)}
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>

          <div className="px-4 pt-4 pb-6 overflow-y-auto flex-1">
            <button
              onClick={handleUseCurrentLocation}
              disabled={locating}
              className={`w-full flex items-center justify-center gap-2.5 gradient-blue
  text-white py-3.5 rounded-md text-base font-normal tracking-wide
  ${locating ? "opacity-70 cursor-not-allowed" : ""}`}
            >
              {locating ? (
                <>
                  <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                  Detecting Location...
                </>
              ) : (
                <>
                  <LocateFixed size={18} className="mt-[1px]" />
                  Use My Current Location
                </>
              )}
            </button>

            <div className="flex items-center my-5">
              <span className="flex-1 h-px bg-gray-200" />
              <span className="px-3 text-sm text-gray-400 uppercase tracking-wide">
                OR
              </span>
              <span className="flex-1 h-px bg-gray-200" />
            </div>

            <div className="relative mb-5">
              <input
                placeholder="Search Your City"
                className="w-full rounded-md border border-gray-200 bg-gray-50
                px-3.5 py-2.5 pl-10 text-sm text-gray-800 placeholder:text-gray-400
                focus:outline-none focus:ring-1 focus:ring-[#328de2] focus:bg-white"
              />
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </div>

            <div className="border border-gray-200 rounded-md overflow-hidden">
              <div className="grid grid-cols-3">
                {cities.length > 0 ? (
                  citiesWithImages.map((city) => (
                    <button
                      key={city.id}
                      onClick={() => handleSelectCity(city.name)}
                      className={`
                        flex flex-col items-center justify-center gap-2 py-4 text-sm
                        text-gray-800 bg-white active:bg-gray-50
                      `}
                    >
                      {city.image && (
                        <img
                          src={city.image}
                          className="h-16 w-auto object-contain"
                          alt={city.name}
                          onError={(e) =>
                            (e.currentTarget.src = "/fallback-city.png")
                          }
                        />
                      )}
                      <span>{city.name}</span>
                    </button>
                  ))
                ) : (
                  <div className="col-span-3 py-8 text-center text-gray-500">
                    {locationLoading
                      ? "Loading cities..."
                      : locationError || "No cities available"}
                  </div>
                )}
              </div>
            </div>

            {citiesWithoutImages.length > 0 && (
              <div className="rounded-md p-3">
                <p className="text-center my-4 text-lg font-medium text-gray-600 mb-3">
                  Other Cities
                </p>

                <div className="grid grid-cols-2 gap-y-1.5 text-gray-700">
                  {citiesWithoutImages.map((city) => (
                    <button
                      key={city.id}
                      onClick={() => handleSelectCity(city.name)}
                      className="text-left py-1.5 hover:text-[#0B5ED7] active:bg-gray-50 px-1 rounded border-b border-gray-200"
                    >
                      {city.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <ContactInquiryModal
        isOpen={openInquiry}
        onClose={() => setOpenInquiry(false)}
      />
    </>
  );
}
