"use client";

import BrandVideoSection from "@/components/BrandVideoSection";
import CustomerReviewsSlider from "@/components/CustomerReviewsSlider";
import FaqAccordion from "@/components/FaqAccordion";
import { ChevronDown } from "lucide-react";
import ParametersAccordion from "@/components/TestParameters";
import RecommendedPackages from "@/components/RecommendedPackages";
import { useCallback, useEffect, useRef } from "react";
import { useCart } from "@/hooks/useCart";
import { useUser } from "@/context/userContext";
import { useCity } from "@/context/CityContext";
import { useModalStore } from "@/app/store/modal.store";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { HealthItem } from "@/hooks/useItems";
import { useRouter } from "next/navigation";

export default function TestDetailPage({
  data,
  itemSlug,
}: {
  data: any;
  itemSlug: string;
}) {
  const testParamRef = useRef<HTMLDivElement | null>(null);
  const { cityDetails } = useCity();
  const { user } = useUser();
  const { open } = useModalStore();
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);
  const [cartItemMap, setCartItemMap] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState<Record<string, boolean>>({});
  const trackRef = useRef<HTMLDivElement | null>(null);
  const {
    handleAddToCart,
    loading: cartLoading,
    cartItems,
    fetchCartList,
  } = useCart(user?.userID, user?.userPhone, "");

  // Build cartItemMap from cartItems - PERFECT 1-TO-1 MAPPING
  useEffect(() => {
    if (Array.isArray(cartItems)) {
      const map: Record<string, string> = {};
      cartItems.forEach((item: any) => {
        if (item.cartItemID && item.cartID) {
          map[item.cartItemID] = item.cartID;
        }
      });
      setCartItemMap(map);
    }
  }, [cartItems]);

  const onAddToCart = useCallback(
    async (item: HealthItem) => {
      const itemId = item.itemID;

      if (!user?.userID) {
        open("login");
        return;
      }

      if (isProcessing[itemId]) return;

      setIsProcessing((p) => ({ ...p, [itemId]: true }));

      try {
        const res = await handleAddToCart({
          userID: user.userID,
          userPhone: user.userPhone,
          itemID: itemId,
          itemPriceID: item.priceID,
          cityID: cityDetails?.id,
        });

        if (!res) throw new Error();

        toast.success("Added to cart");
        await fetchCartList();
      } catch (e) {
        toast.error("Failed to add");
      } finally {
        setIsProcessing((p) => ({ ...p, [itemId]: false }));
      }
    },
    [user, handleAddToCart, fetchCartList, cityDetails?.id, open, isProcessing],
  );

  // const {
  //   itemDetail,
  //   relatedCartItems,
  //   itemTabs,
  //   callBlock,
  //   featureList,
  //   itemDesc,
  //   loading,
  // } = useItemDetail() as any;

  const {
    itemDetail,
    relatedCartItems,
    itemTabs,
    callBlock,
    featureList,
    descList,
  } = data;

  const itemDesc = descList;

  const isItemInCart = !!cartItemMap[itemDetail?.itemID];
  const processing = isProcessing[itemDetail?.itemID];

  // if (loading) return <p>Loading...</p>;
  if (!itemDetail) return <p>No item details available.</p>;

  useEffect(() => {
    if (!user) {
      setCartItemMap({});
      setIsProcessing({});
    }
  }, [user]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let x = 0;
    let animationId: number;
    const speed = 0.45;

    const loop = () => {
      x -= speed;

      if (Math.abs(x) >= track.scrollWidth / 2) {
        x = 0;
      }

      track.style.transform = `translateX(${x}px)`;
      animationId = requestAnimationFrame(loop);
    };

    animationId = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(animationId);
  }, []);
  return (
    <div className=" space-y-6">
      <section className="mb-3">
        <div className="w-full mx-auto px-3 py-3">
          <div className="overflow-hidden rounded-2xl shadow-md bg-white">
            {/* Top gradient section */}
            <div className="gradient-blue  px-4 pt-4 pb-4 rounded-2xl">
              <p className="text-white  font-semibold leading-snug">
                {itemDetail?.name}
              </p>

              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {itemDetail?.discount && (
                    <span className="text-xs text-white/80 line-through">
                      ₹{itemDetail?.discount}
                    </span>
                  )}

                  <span className="text-xl font-bold text-white">
                    {" "}
                    ₹{itemDetail?.price}
                  </span>
                </div>

                <button
                  onClick={() => {
                    const el = testParamRef.current;
                    if (!el) return;

                    const headerOffset = 120;
                    const y =
                      el.getBoundingClientRect().top +
                      window.pageYOffset -
                      headerOffset;

                    window.scrollTo({ top: y, behavior: "smooth" });
                  }}
                  className="inline-flex items-center gap-1 rounded-full border border-white/60 px-3 py-0 text-xs font-medium text-white bg-white/10"
                >
                  <span>{itemDetail?.subheading}</span>
                  <span>
                    <ChevronDown />
                  </span>
                </button>
              </div>
            </div>

            {/* People booked row */}
            {/* <div className="flex items-center gap-2 px-4 py-2 bg-[#f7f9fb] ">
              <img src="/assets/svg/people.svg" alt="" />
              <p className="text-sm ">
                <span className="font-semibold text-gray-800">5k People</span>
                <span className="text-gray-500"> Booked this test</span>
              </p>
            </div> */}

            {/* Coupon row */}
            {/* <div className="flex items-center gap-3 px-4 py-3 bg-[#D5FFF2]">
              <div className="h-7 w-7 rounded-full bg-[#ff4b4b] flex items-center justify-center text-white">
                <Percent className="h-4 w-4" />
              </div>
              <p className="text-sm leading-snug">
                USE <span className="font-bold">MDRC30</span> to{" "}
                <span className="font-bold">Get 30% OFF</span>{" "}
                <span className="text-gray-700">One First Order</span>
              </p>
            </div> */}
          </div>
        </div>
      </section>

      <section>
        <div className="w-fullmx-auto px-4 py-3">
          {/* Requisites header + horizontal scroll */}
          <div className="rounded-2xl gradient-light-blue  shadow-sm overflow-hidden p-5">
            <div className="">
              <h2 className="text-2xl mb-3 font-semibold tx-blue">
                Requisites
              </h2>
            </div>
            {/* Scrollable pill row - direct buttons matching image [file:2] */}
            <div className="relative overflow-hidden">
              <div ref={trackRef} className="flex gap-3 w-max">
                {[...featureList, ...featureList].map((item, index) => (
                  <div
                    key={index}
                    className="flex-shrink-0 inline-flex items-center gap-2 rounded-xl bg-gray-50"
                  >
                    <span className="h-full px-2 rounded shadow py-0 bg-white flex items-center justify-center">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-5 w-5"
                      />
                    </span>
                    <span className="text-md font-normal text-gray-800 whitespace-nowrap px-3 py-2">
                      {item.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>{" "}
          </div>

          <div className="mt-4 rounded-xl bg-white shadow-md overflow-hidden">
            {/* Green header */}
            <div className="gradient-green px-4 py-2.5 rounded-xl">
              <p className="text-sm font-semibold text-white">
                {itemDesc?.title}
              </p>
            </div>

            {/* Body */}
            <div className="px-4 py-3">
              <div
                dangerouslySetInnerHTML={{ __html: itemDesc?.desc }}
                className={`text-sm leading-relaxed text-gray-700 transition-all ${
                  expanded ? "" : "line-clamp-3"
                }`}
              />
              {itemDesc?.desc && (
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="mt-2 text-sm font-medium tx-green hover:underline"
                >
                  {expanded ? "Read less" : "Read more"}
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      <div ref={testParamRef} />

      <section>
        <ParametersAccordion itemTabs={itemTabs} itemName={itemDetail?.name} />
      </section>

      <section className="mt-6 px-4">
        {/* Bottom CTA */}
        <div className="mt-5 rounded-xl bg-[#EAF6FD] flex items-center justify-between px-4 py-3">
          <a href={`tel:${callBlock?.call}`}>
            <div className="flex gap-4 items-center">
              <img src="/assets/images/logo/call.svg" alt="call" />
              <div>
                <h4 className="text-[18px] tx-blue font-semibold ">
                  {callBlock?.heading}
                </h4>
                <p className="text-sm font-medium tx-blue ">
                  {callBlock?.callHeading}
                </p>
              </div>
            </div>
          </a>
        </div>
      </section>

      {/* Download App */}
      <section className="my-8 px-4">
        <a
          href={`https://wa.me/${callBlock?.whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="flex items-center justify-between gradient-green  rounded-2xl px-5 py-4 shadow-lg">
            <p className="text-white font-medium text-base">
              {callBlock?.whatsappHeading}
            </p>

            <div className="relative flex items-center justify-center">
              {/* Pulse ring */}
              <span className="absolute inline-flex h-12 w-12 rounded-full bg-white opacity-30 animate-ping"></span>

              {/* Icon container */}
              <div className="relative  rounded-full h-14 w-14 flex items-center justify-center shadow-[0_0_15px_rgba(0,0,0,0.15)] ">
                <img
                  src="/assets/images/logo/whatsapp.svg"
                  alt="WhatsApp"
                  className="h-12 w-12"
                />
              </div>
            </div>
          </div>
        </a>
      </section>

      {relatedCartItems && relatedCartItems.length > 0 && (
        <section className="p-4 bg-[#EAF6FD]">
          <RecommendedPackages relatedCartItems={relatedCartItems} />
        </section>
      )}

      <section>
        <BrandVideoSection />
      </section>

      <section>
        <CustomerReviewsSlider />
      </section>

      <section>
        <FaqAccordion pageType={"item"} pageSlug={itemSlug} />
      </section>

      <section className="my-8 px-4">
        <div className="relative gradient-blue  rounded-3xl overflow-hidden text-white">
          <div className="rounded-3xl overflow-hidden shadow-[0_0_15px_rgba(0,0,0,0.15)]">
            <img
              src="/assets/images/why-modern-diagnostics/why-modern-diagnostic-img.png"
              alt="Why Modern Diagnostic"
              className="w-full h-auto object-cover"
            />
          </div>

          {/* TEST DETAIL PAGE POPUP */}
          <div className="fixed bottom-0 left-0 w-full bg-white shadow-[0_-4px_15px_rgba(0,0,0,0.15)] p-4 rounded-t-xl z-50">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xl font-bold text-black">
                  {" "}
                  ₹{itemDetail?.price}
                </div>
                <div className="text-sm text-gray-500">
                  Inclusive of all taxes
                </div>
              </div>

              <button
                onClick={() => {
                  if (isItemInCart) {
                    router.push("/cart");
                  } else {
                    onAddToCart(itemDetail);
                  }
                }}
                disabled={cartLoading || processing}
                className={`py-2 px-8 rounded-lg font-semibold transition-colors flex items-center justify-center ${"bg-red-500 text-white hover:bg-red-600"} ${cartLoading || processing ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {processing ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : isItemInCart ? (
                  "Proceed"
                ) : (
                  "Add to Cart"
                )}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
