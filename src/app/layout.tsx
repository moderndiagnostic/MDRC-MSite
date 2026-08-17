
import "./globals.css";
import { Roboto } from "next/font/google";
import Script from "next/script";
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
      <Script id="google-tag-manager" strategy="lazyOnload">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-M26TV87');`}
      </Script>
      <body
        suppressHydrationWarning
        className={`${roboto.className} bg-[#F5F7FA] flex justify-center`}
      >
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-M26TV87"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
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
