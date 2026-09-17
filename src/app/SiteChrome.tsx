"use client";

import { Suspense, useEffect } from "react";
import { usePathname } from "next/navigation";
import { ToastContainer } from "react-toastify";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ModalWrapper from "../components/modals/ModalWrapper";

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isMriLanding = pathname === "/lp/radio/mri-scan-in-gurgaon";

  useEffect(() => {
    document.documentElement.classList.toggle("mri-landing-active", isMriLanding);
    document.body.classList.toggle("mri-landing-active", isMriLanding);
    return () => {
      document.documentElement.classList.remove("mri-landing-active");
      document.body.classList.remove("mri-landing-active");
    };
  }, [isMriLanding]);

  if (isMriLanding) {
    return <>{children}</>;
  }

  return (
    <>
      <div className="w-full max-w-[430px] bg-white">
        <Header />
        <main>{children}</main>
        <Suspense fallback={null}>
          <ModalWrapper />
        </Suspense>
        <Footer />
      </div>

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
      />
    </>
  );
}
