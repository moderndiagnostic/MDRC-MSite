export interface City {
  id: string;
  name: string;
  image: string;
  phone: string;
  slug: string;
  whatsapp: string;
}

export const DEFAULT_CITY: City = {
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
export const DASHBOARD_STORAGE_KEY = "mdrc_dashboard";
