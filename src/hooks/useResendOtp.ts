import { useState } from "react";
import AuthService from "@/services/auth.service";
import { getDeviceType } from "@/utils/device";

export const useResendOtp = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resendOtp = async (mobile: string) => {
    try {
      setLoading(true);
      setError(null);

      const body = {
        view: "signin",
        userName: mobile,
        deviceType: getDeviceType(),
        action: "resendOtp", // ✅ ONLY CHANGE
        appVersion: "1.0",
      };

      const res = await AuthService.login(body);

      if (res?.msgCode !== "1") {
        setError(res?.msg || "OTP not resent");
        throw res;
      }

      return res;
    } catch (err) {
      setError("Failed to resend OTP");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { resendOtp, loading, error };
};
