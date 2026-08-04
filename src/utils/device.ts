export const getDeviceType = (): string => {
  if (typeof window === "undefined") return "Web";

  const ua = navigator.userAgent.toLowerCase();

  if (/android/.test(ua)) return "Android";
  if (/iphone|ipad|ipod/.test(ua)) return "iOS";

  return "Web";
};
