"use client";
import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { communityPartnersData } from "../../data/communityPartnersData";
import LightBoxOthers from "./LightBoxOthers";

const CommunityPartners: React.FC = () => {
  const data = communityPartnersData;

  // Ref for mobile scroll container
  const mobileScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only run auto-scroll on mobile
    const isMobile = window.innerWidth < 768;
    if (!isMobile) return;
    if (!mobileScrollRef.current) return;
    const container = mobileScrollRef.current;
    const cardWidth =
      container.firstChild instanceof HTMLElement
        ? container.firstChild.offsetWidth + 16
        : 288 + 16; // Card width + gap (w-72 = 288px)
    let currentMobileIndex = 0;
    const interval = setInterval(() => {
      currentMobileIndex = (currentMobileIndex + 1) % data.length;
      // Center the card in the viewport
      const containerWidth = container.offsetWidth;
      const scrollTo =
        currentMobileIndex * cardWidth - (containerWidth - cardWidth) / 2;
      container.scrollTo({ left: scrollTo, behavior: "smooth" });
    }, 3000);
    return () => clearInterval(interval);
  }, [data.length]);

  return (
    <section
      className="flex w-full flex-col items-center bg-black px-4 py-16"
      style={{ position: "relative", zIndex: 0 }}
    >
      <LightBoxOthers name="about" id={1} />
      {/* Blurred ellipse background, left center, always behind content */}
      {/*<div
        style={{
          width: "700px", // set a fixed width to avoid overflow
          maxWidth: "100vw", // never exceed viewport width
          height: "864px",
          position: "absolute",
          left: 0, // align to the left edge
          top: "50%",
          transform: "translateY(-50%)",
          filter: "blur(211.1px)",
          borderRadius: "50%",
          background: "radial-gradient(50% 50% at 50% 50%, #1a252f, #111)",
          zIndex: -1,
          pointerEvents: "none",
        }}
        aria-hidden="true"
      />*/}
      <h2 className="font-kinetikaUltra text-offwhite mb-8 text-center text-5xl leading-[79.9%] font-black md:text-6xl">
        COMMUNITY PARTNERS
      </h2>

      <div className="z-10 flex w-full max-w-6xl flex-col gap-8">
        {/* Desktop grid - 3 columns for 6 items (2 rows of 3) */}
        <div className="hidden place-items-center gap-6 md:grid md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {data.map((partner, idx) => (
            <div
              key={idx}
              className="flex h-60 w-72 flex-shrink-0 flex-col justify-between overflow-hidden rounded-2xl bg-[#212121] shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              {/* Image container */}
              <div className="flex flex-grow items-center justify-center p-6">
                <div
                  className={`relative w-full ${idx === 4 || idx === 5 ? "h-32 max-w-[280px]" : "h-20 max-w-[200px]"}`}
                >
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    fill
                    className="object-contain drop-shadow-sm"
                    sizes={idx === 4 || idx === 5 ? "280px" : "200px"}
                  />
                </div>
              </div>
              {/* Text container at the bottom */}
              <div className="bg-[#303030] p-4 text-center">
                <div className="text-offwhite font-['AvantGarde-Bk-BT',sans-serif] text-lg font-semibold">
                  {partner.name}
                </div>
                <div className="font-['AvantGarde-Bk-BT',sans-serif] text-xs tracking-wider text-gray-400 uppercase">
                  {partner.type}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile: horizontal scroll */}
        <div
          ref={mobileScrollRef}
          className="mt-8 flex gap-4 overflow-x-auto pb-2 md:hidden"
        >
          {data.map((partner, idx) => (
            <div
              key={idx}
              className="flex h-60 w-72 flex-shrink-0 flex-col justify-between overflow-hidden rounded-2xl bg-[#212121] shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              <div className="flex flex-grow items-center justify-center p-6">
                <div
                  className={`relative w-full ${idx === 4 || idx === 5 ? "h-32 max-w-[280px]" : "h-20 max-w-[200px]"}`}
                >
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    fill
                    className="object-contain drop-shadow-sm"
                    sizes={idx === 4 || idx === 5 ? "280px" : "200px"}
                  />
                </div>
              </div>
              <div className="bg-[#303030] p-4 text-center">
                <div className="text-offwhite font-['AvantGarde-Bk-BT',sans-serif] text-lg font-semibold">
                  {partner.name}
                </div>
                <div className="font-['AvantGarde-Bk-BT',sans-serif] text-xs tracking-wider text-gray-400 uppercase">
                  {partner.type}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CommunityPartners;
