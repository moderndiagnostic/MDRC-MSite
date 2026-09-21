"use client";

import { Suspense, useEffect } from "react";
import { usePathname } from "next/navigation";
import { ToastContainer } from "react-toastify";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ModalWrapper from "../components/modals/ModalWrapper";

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const landingPath = (pathname || "").replace(/\/$/, "");
  const isImagingLanding = landingPath.startsWith("/lp/imaging/");

  useEffect(() => {
    document.documentElement.classList.toggle("mri-landing-active", isImagingLanding);
    document.body.classList.toggle("mri-landing-active", isImagingLanding);
    return () => {
      document.documentElement.classList.remove("mri-landing-active");
      document.body.classList.remove("mri-landing-active");
    };
  }, [isImagingLanding]);

  if (isImagingLanding) {
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
