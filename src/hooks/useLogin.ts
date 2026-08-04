import { useState } from "react";
import AuthService from "@/services/auth.service";
import { getDeviceType } from "@/utils/device";

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (mobile: string) => {
    try {
      setLoading(true);
      setError(null);

      // ✅ BODY HOOK ME BAN RAHI HAI
      const body = {
        view: "signin",
        userName: mobile,
        deviceType: getDeviceType(),
        action: "signIn",
        appVersion: "1.0",
      };
      const res = await AuthService.login(body);
      // optional backend check
      if (res?.msgCode !== "1") {
        setError(res?.msg || "OTP not sent");
        throw res;
      }
      return res;
    } catch (err) {
      setError("Something went wrong. Please try again.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
};
