
import "./globals.css";
import { Roboto } from "next/font/google";
import { GoogleTagManager } from "@next/third-parties/google";
import { UserProvider } from "@/context/userContext";
import { CityProvider } from "@/context/CityContext";
import { CartProvider } from "@/context/CartContext";
import { DashboardProvider } from "@/context/DashboardContext";

import Header from "../components/Header";
import Footer from "../components/Footer";
import ModalWrapper from "../components/modals/ModalWrapper";
import { ToastContainer } from "react-toastify";
// import SmoothScroll from "@/components/FastScroll";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <GoogleTagManager gtmId="GTM-M26TV87" />
      <body
        suppressHydrationWarning
        className={`${roboto.className} bg-[#F5F7FA] flex justify-center`}
      >
        {/* <SmoothScroll /> */}
        <UserProvider>
          <CityProvider>
            <DashboardProvider>
              <CartProvider>
                <div className="w-full max-w-[430px] bg-white">
                  <Header />
                  <main>{children}</main>
                  <ModalWrapper />
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
              </CartProvider>
            </DashboardProvider>
          </CityProvider>
        </UserProvider>
      </body>
    </html>
  );
}
