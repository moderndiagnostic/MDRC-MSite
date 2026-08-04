"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useModalStore } from "../../app/store/modal.store";

import LoginModal from "./LoginModal";
import VerifyOtpModal from "./OtpModal";
import ProfileModal from "./ProfileModal";

export default function ModalWrapper() {
  const { modal, phone, open, close } = useModalStore();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("login") === "true" && modal !== "login") {
      open("login");

      // clean URL only once
      const params = new URLSearchParams(searchParams.toString());
      params.delete("login");

      router.replace(params.toString() ? `/?${params}` : "/", {
        scroll: false,
      });
    }
  }, [searchParams, modal, open, router]);

  return (
    <>
      <LoginModal
        isOpen={modal === "login"}
        onClose={close}
        onSuccess={(phone) => open("otp", phone)}
      />

      <VerifyOtpModal
        isOpen={modal === "otp"}
        phone={phone || ""}
        onClose={close}
      />

      <ProfileModal
        isOpen={modal === "profile"}
        phone={phone || ""}
        onClose={close}
      />
    </>
  );
}
