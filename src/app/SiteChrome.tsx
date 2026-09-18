"use client";

import { Suspense, useEffect } from "react";
import { usePathname } from "next/navigation";
import { ToastContainer } from "react-toastify";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ModalWrapper from "../components/modals/ModalWrapper";

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLpLanding =
    pathname === "/lp/radio/mri-scan-in-gurgaon" ||
    pathname === "/lp/imaging/pet-scan-in-gurgaon";
  const isPetLanding = pathname === "/lp/imaging/pet-scan-in-gurgaon";

  useEffect(() => {
    document.documentElement.classList.toggle("mri-landing-active", isLpLanding && !isPetLanding);
    document.body.classList.toggle("mri-landing-active", isLpLanding && !isPetLanding);
    document.documentElement.classList.toggle("pet-landing-active", isPetLanding);
    document.body.classList.toggle("pet-landing-active", isPetLanding);
    return () => {
      document.documentElement.classList.remove("mri-landing-active", "pet-landing-active");
      document.body.classList.remove("mri-landing-active", "pet-landing-active");
    };
  }, [isLpLanding, isPetLanding]);

  if (isLpLanding) {
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
