import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import LocationService from "@/services/location.service";
import { getDeviceType } from "@/utils/device";

export interface City {
  id: string;
  name: string;
  image: string;
  phone: string;
  slug: string;
  whatsapp: string;
}

export const DEFAULT_CITY = {
  id: "MQ==",
  name: "Gurugram",
  slug: "gurgaon",
  phone: "01246712000",
  whatsapp: "918586988847",
  image:
    "https://www.mdrcindia.com/uploads/item_category/img_69787d7a04a483.00199320.svg",
};

export const CITY_COOKIE_KEY = "cityDetail";
export const LOCATION_STORAGE_KEY = "mdrc_location_data";
export const CITY_SESSION_HEADER = "x-city-list";

const citySlugPages = [
  "pathology",
  "category",
  "diseases",
  "tests",
  "radiology",
  "premium-health-checkup",
  "health-risk",
];

const sortCities = (cityList: City[]): City[] => {
  return [...cityList].sort((a, b) => {
    const aHasValidImage = a.image && a.image !== "" && a.image !== "#";
    const bHasValidImage = b.image && b.image !== "" && b.image !== "#";

    if (aHasValidImage && !bHasValidImage) return -1;
    if (!aHasValidImage && bHasValidImage) return 1;
    return 0;
  });
};

function extractCitySlug(pathname: string): string | null {
  const segments = pathname.split("/").filter(Boolean);
  if (!citySlugPages.includes(segments[0])) return null;
  return segments.length > 1 ? segments[segments.length - 1] : null;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const protectedPaths = ["/account", "/checkout", "/cart"];
  const isProtected = protectedPaths.some(
    (p) => pathname === p || pathname.startsWith(p + "/"),
  );

  if (isProtected) {
    const authCookie = request.cookies.get("auth_user")?.value;

    let isLoggedIn = false;

    try {
      if (authCookie) {
        const user = JSON.parse(authCookie);

        if (user?.userID) {
          isLoggedIn = true;
        }
      }
    } catch {
      isLoggedIn = false;
    }

    if (!isLoggedIn) {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      url.searchParams.set("login", "true");
      return NextResponse.redirect(url);
    }
  }

  const cityCookie = request.cookies.get(CITY_COOKIE_KEY)?.value;
  const citySlugFromUrl = extractCitySlug(pathname);

  try {
    const payload = {
      view: "city_list",
      deviceType: getDeviceType ? getDeviceType() : "Android",
    };

    const response = NextResponse.next();
    const cityResponse = await LocationService.getCityList(payload as any);

    if (cityResponse?.msgCode === "1") {
      const cityList = sortCities(cityResponse.result.cityList);
      response.headers.set(CITY_SESSION_HEADER, JSON.stringify(cityList));

      let selectedCity = DEFAULT_CITY;

      if (cityCookie) {
        try {
          selectedCity = JSON.parse(cityCookie);
        } catch {}
      }

      if (citySlugFromUrl) {
        const cityFromUrl = cityList.find((c) => c.slug === citySlugFromUrl);
        if (cityFromUrl) {
          selectedCity = cityFromUrl;
          response.cookies.set(CITY_COOKIE_KEY, JSON.stringify(selectedCity), {
            path: "/",
            sameSite: "lax",
          });
        }
      }

      if (!cityCookie) {
        response.cookies.set(CITY_COOKIE_KEY, JSON.stringify(selectedCity), {
          path: "/",
          sameSite: "lax",
        });
      }
      return response;
    }
  } catch (err) {
    console.error("Failed to fetch city data:", err);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"],
};
