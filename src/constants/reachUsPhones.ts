const CITY_PHONES: Record<string, string> = {
  guwahati: "9773598856",
  indore: "9773598857",
  yamunanagar: "9773598858",
  kurukshetra: "9773598859",
  jammu: "9773598860",
  panipat: "9773598862",
  gorakhpur: "9773598863",
  barelli: "9773598864",
  bareilly: "9773598864",
  jaipur: "9773598865",
};

function normalizeCityText(value: string) {
  return value.toLowerCase().replace(/[^a-z]/g, "");
}

export function getReachUsPhoneForLocation(name: string, address = "") {
  const haystack = normalizeCityText(`${name} ${address}`);
  for (const [city, phone] of Object.entries(CITY_PHONES)) {
    if (haystack.includes(city)) return phone;
  }
  return null;
}
