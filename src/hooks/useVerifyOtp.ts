import { useState } from "react";
import AuthService from "@/services/auth.service";
import { getDeviceType } from "@/utils/device";
import { useUser } from "@/context/userContext";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useModalStore } from "@/app/store/modal.store";
import { toast } from "react-toastify";

export const useVerifyOtp = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setUser } = useUser(); // Access setUser from context
  const router = useRouter();
  const { open, close } = useModalStore();

  const setAuthCookie = (user: any) => {
    Cookies.set("auth_user", JSON.stringify(user), {
      path: "/",
      sameSite: "lax",
    });
  };

  const verify = async (userName: string, otp: string) => {
    try {
      setLoading(true);
      setError(null);

      // ✅ BODY HOOK ME BAN RAHI HAI
      const body = {
        view: "signin",
        userName,
        deviceType: getDeviceType(),
        action: "otp_verify",
        otp,
      };

      const res = await AuthService.verifyOtp(body);
      if (res?.msgCode !== "1") {
        setError(res?.msg || "Invalid OTP");
        throw res;
      }

      const customer = res.result.customer;
      const userData = {
        userID: customer.userID,
        userPhone: customer.userPhone,
        userFirstName: customer.userFirstName,
        userLastName: customer.userLastName,
        userEmail: customer.userEmail,
      };

      const isNewUser = customer.userFirstName === "Guest";
      toast.success(
        `${
          customer.userFirstName
            ? customer.userLastName
              ? `${customer.userFirstName} ${customer.userLastName}`
              : customer.userFirstName
            : "User"
        } logged in successfully!`,
      );
      setAuthCookie(userData);
      setUser(userData);
      localStorage.setItem("auth_user", JSON.stringify(userData));
      if (isNewUser) {
        open("profile", customer.userPhone, true);
      } else {
        close();
        router.replace("/");
      }
      return res;
    } catch (err) {
      setError("Invalid OTP. Please try again.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { verify, loading, error };
};
