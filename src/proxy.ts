import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import LocationService from "@/services/location.service";
import { getDeviceType } from "@/utils/device";
import {
  City,
  CITY_COOKIE_KEY,
  CITY_SESSION_HEADER,
  DEFAULT_CITY,
} from "@/constants/city";

export type { City };
export {
  CITY_COOKIE_KEY,
  CITY_SESSION_HEADER,
  DEFAULT_CITY,
  LOCATION_STORAGE_KEY,
} from "@/constants/city";

const citySlugPages = [
  "pathology",
  "category",
  "diseases",
  "tests",
  "radiology",
  "premium-health-checkup",
  "health-risk",
];

let cityListCache: City[] | null = null;
let cityListCachedAt = 0;
const CITY_LIST_TTL_MS = 5 * 60 * 1000;

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

async function getCachedCityList(): Promise<City[] | null> {
  if (cityListCache && Date.now() - cityListCachedAt < CITY_LIST_TTL_MS) {
    return cityListCache;
  }

  const payload = {
    view: "city_list",
    deviceType: getDeviceType ? getDeviceType() : "Android",
  };

  const cityResponse = await LocationService.getCityList(payload as any);
  if (cityResponse?.msgCode === "1") {
    cityListCache = sortCities(cityResponse.result.cityList);
    cityListCachedAt = Date.now();
    return cityListCache;
  }

  return cityListCache;
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

  if (!citySlugFromUrl) {
    if (cityCookie) {
      return NextResponse.next();
    }

    const response = NextResponse.next();
    response.cookies.set(CITY_COOKIE_KEY, JSON.stringify(DEFAULT_CITY), {
      path: "/",
      sameSite: "lax",
    });
    return response;
  }

  try {
    const cityList = await getCachedCityList();
    const response = NextResponse.next();

    if (cityList) {
      response.headers.set(CITY_SESSION_HEADER, JSON.stringify(cityList));

      let selectedCity = DEFAULT_CITY;

      if (cityCookie) {
        try {
          selectedCity = JSON.parse(cityCookie);
        } catch {}
      }

      const cityFromUrl = cityList.find((c) => c.slug === citySlugFromUrl);
      if (cityFromUrl) {
        selectedCity = cityFromUrl;
        response.cookies.set(CITY_COOKIE_KEY, JSON.stringify(selectedCity), {
          path: "/",
          sameSite: "lax",
        });
      } else if (!cityCookie) {
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

  if (!cityCookie) {
    const response = NextResponse.next();
    response.cookies.set(CITY_COOKIE_KEY, JSON.stringify(DEFAULT_CITY), {
      path: "/",
      sameSite: "lax",
    });
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|assets/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2)$).*)",
  ],
};
