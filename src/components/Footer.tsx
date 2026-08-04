"use client";

import { useState } from "react";
import {
  ChevronRight,
  ChevronDown,
  Facebook,
  Linkedin,
  Youtube,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Tags from "./Tags";
import { useCity } from "@/context/CityContext";
import { useCartContext } from "@/context/CartContext";
import NewsLetter from "@/app/account/newsletter";
import { useDashboard } from "@/context/DashboardContext";

export default function Footer() {
  const [showSupportPopup, setShowSupportPopup] = useState(false);
  const pathname = usePathname();
  const { cityDetails } = useCity();
  const selectedCity = cityDetails;
  const isTestDetailPage = /^\/tests\/[^/]+\/[^/]+$/.test(pathname);
  const isBookingDetailPage = pathname === "/account/bookings/detail";

  // Use the dynamic userPhone for the cart hook
  const { cartCount, cartSubtotal } = useCartContext();
  const { homeData } = useDashboard();

  const hasItems = cartCount > 0;
  const isCartOrCheckout =
    pathname === "/cart" ||
    pathname === "/checkout" ||
    pathname === "/account/help" ||
    pathname === "/account" ||
    pathname === "/order";

  const shouldShowCartPopup = hasItems && !isCartOrCheckout;

  return (
    <>
      <NewsLetter />

      <footer className="bg-[#F5F5F5] px-4 py-6 text-base tx-gray-footer">
        <Tags />

        <div className="mt-6">
          <h4 className="mb-2 font-semibold text-[#424040]">Company</h4>
          <div className="grid grid-cols-2 gap-y-1 gap-x-6 text-base">
            <Link href="/about-us" className="hover:tx-green">
              About Us
            </Link>
            <Link href="/blog" className="hover:tx-green">
              Blogs
            </Link>
            <Link href="/for-doctors/modern-lab" className="hover:tx-green">
              Modern Lab
            </Link>
            <Link href="/gallery" className="hover:tx-green">
              Gallery
            </Link>
            <Link href="/for-doctors/modern-imaging" className="hover:tx-green">
              Modern Imaging
            </Link>
            <Link href="/reach-us" className="hover:tx-green">
              Reach Us
            </Link>
            <Link href="/our-milestones" className="hover:tx-green">
              Our Milestones
            </Link>
            <Link href="/career" className="hover:tx-green">
              Career
            </Link>
            <Link href="/corporate-tieup" className="hover:tx-green">
              Corporate Tieup
            </Link>
            <Link href="/page/privacy-policy" className="hover:tx-green">
              Privacy Policy
            </Link>
            <Link href="/ipo" className="hover:tx-green">
              IPO Documents
            </Link>
            <Link href="/page/terms-amp-condition" className="hover:tx-green">
              Terms & Conditions
            </Link>
            <div className="grid grid-cols-1 gap-1">
              <Link
                href={`/home-sample-collection/${cityDetails?.slug}`}
                className="hover:tx-green"
              >
                Home Sample Collection
              </Link>
              <Link href={`/paynow`} className="hover:tx-green">
                Pay Now
              </Link>
            </div>
            {/* <Link href="/page/shipping-amp-delivery" className="hover:tx-green">
              Cancellation & Return Policy
            </Link> */}
          </div>
        </div>

        <hr className="my-4 border-gray-300" />

        <div
          className={`mt-6 ${
            (shouldShowCartPopup || isTestDetailPage) && !isBookingDetailPage
              ? "pb-24"
              : ""
          }`}
        >
          <div className="mb-4 flex items-center justify-between">
            <Link href="/">
              <img
                src="/assets/images/logo/mdrc-logo.svg"
                alt="Modern Diagnostics"
                className="h-8"
              />
            </Link>
            <div className="flex items-center gap-3">
              <Link
                href="https://www.facebook.com/MdrcIndia/?_rdr"
                className="rounded bg-white p-2 text-gray-600"
              >
                <Facebook size={18} />
              </Link>
              <Link
                href="https://www.youtube.com/channel/UCwZECfhGeCu8o6CvAST95CQ"
                className="rounded bg-white p-2 text-gray-600"
              >
                <Youtube size={18} />
              </Link>
              <Link
                href="https://www.linkedin.com/company/modern-diagnostic-research-centre"
                className="rounded bg-white p-2 text-gray-600"
              >
                <Linkedin size={18} />
              </Link>
              <Link
                href="https://x.com/mdrcindia"
                className="rounded bg-white p-2 text-gray-600"
              >
                <img src="/assets/svg/twitter.svg" alt="" />
              </Link>
            </div>
          </div>
          <p className="mt-4 text-xs text-gray-400">
            ©{new Date().getFullYear()} All rights reserved. Modern Diagnostic &
            Research Centre Limited.
          </p>
        </div>
      </footer>

      {/* DYNAMIC CART POPUP */}
      {shouldShowCartPopup && !isTestDetailPage && !isBookingDetailPage && (
        <div className="fixed bottom-0 left-0 w-full bg-white shadow-[0_-4px_15px_rgba(0,0,0,0.15)] p-4 rounded-t-xl z-50 animate-in slide-in-from-bottom duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img src="/assets/svg/cart.svg" alt="cart" />
              <div>
                <div className="text-xl font-bold">
                  ₹{cartSubtotal}/-{" "}
                  <span className="text-gray-400 font-normal text-sm">
                    ({cartCount} Items)
                  </span>
                </div>
                <Link href="/cart">
                  <div className="text-sm text-green-500 flex gap-1 items-center">
                    View Cart <ChevronDown size={14} />
                  </div>
                </Link>

                {homeData?.top_text && (
                  <p className="mt-1 text-xs text-gray-500 font-medium">
                    {homeData.top_text}
                  </p>
                )}
              </div>
            </div>
            <Link href="/cart">
              <button className="bg-red-500 text-white py-2 px-8 rounded-lg font-semibold hover:bg-red-600 transition-colors">
                Proceed
              </button>
            </Link>
          </div>
        </div>
      )}

      {/* Floating Support Button */}
      <div
        className={`fixed ${
          shouldShowCartPopup ? "bottom-28" : "bottom-6"
        } right-6 z-30 transition-all duration-300`}
      >
        <button
          onClick={() => setShowSupportPopup(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-[#05AF79] to-[#0ECE91] text-white px-5 py-2.5 rounded-xl shadow-lg"
        >
          <img
            src="/assets/images/icon/phone2.svg"
            alt="phone"
            className="w-4 h-4"
          />
          <span className="text-sm font-medium">Call / Chat</span>
        </button>
      </div>

      {/* Support Popup Modal */}
      {showSupportPopup && (
        <>
          <div
            className="fixed inset-0 bg-black/30 z-40"
            onClick={() => setShowSupportPopup(false)}
          />
          <div className="fixed bottom-0 left-0 right-0 z-50">
            <div className="bg-white rounded-t-2xl shadow-lg p-6 pb-2 relative max-w-md mx-auto">
              <button
                onClick={() => setShowSupportPopup(false)}
                className="absolute top-4 right-4 text-gray-500"
              >
                <X size={24} />
              </button>
              <div className="text-center font-semibold border-b border-gray-200 pb-2">
                Talk With Us
              </div>
              <Link href={`tel:${cityDetails?.phone || selectedCity?.phone}`}>
                <div className="p-4 flex justify-between items-center border-b border-gray-200 hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-xl">
                      <img
                        src="/assets/images/icon/phone-icon.svg"
                        className="w-7 h-7"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        Call to Book Health Test
                      </p>
                      <p className="text-xs text-gray-500">
                        {cityDetails?.phone || selectedCity?.phone}
                      </p>
                    </div>
                  </div>
                  <ChevronRight />
                </div>
              </Link>
              <Link
                href={`https://wa.me/${cityDetails?.whatsapp || selectedCity?.whatsapp}`}
              >
                <div className="p-4 flex justify-between items-center border-gray-200 hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-100 p-2 rounded-xl">
                      <img
                        src="/assets/images/icon/whatsapp.svg"
                        className="w-7 h-7"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Chat on Whatsapp</p>
                      <p className="text-xs text-gray-500">
                        Book For Scans and Blood Tests
                      </p>
                    </div>
                  </div>
                  <ChevronRight />
                </div>
              </Link>
            </div>
          </div>
        </>
      )}
    </>
  );
}
