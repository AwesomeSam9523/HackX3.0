"use client";
import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { sponsorsData } from "../../data/sponsorsData";

const PastSponsors = () => {
  // Removed tab state since we only have sponsors now
  const data = sponsorsData;

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
        : 288 + 16; // 16px gap
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

  // data for custom grid: 4, 4, 3
  const rows = [
    data.slice(0, 4),
    data.slice(4, 8),
    data.slice(8, 12),
    data.slice(12, 16),
    data.slice(16, 20),
    data.slice(20, 23),
  ];

  return (
    <section
      className="flex w-full flex-col items-center bg-black px-4 py-16"
      style={{ position: "relative", zIndex: 0 }}
    >
      {/* Blurred ellipse background, right center, always behind content */}
      <div
        style={{
          width: "700px", // set a fixed width to avoid overflow
          maxWidth: "100vw", // never exceed viewport width
          height: "864px",
          position: "absolute",
          right: 0, // align to the right edge
          top: "50%",
          transform: "translateY(-50%)",
          filter: "blur(211.1px)",
          borderRadius: "50%",
          background: "radial-gradient(50% 50% at 50% 50%, #1a252f, #111)",
          zIndex: -1,
          pointerEvents: "none",
        }}
        aria-hidden="true"
      />
      <h2 className="font-kinetikaUltra text-offwhite mb-8 text-center text-5xl leading-[79.9%] font-black md:text-6xl">
        OUR PARTNERS
      </h2>

      <div className="flex w-full max-w-6xl flex-col gap-8">
        {/* Mobile: horizontal scrollable row, Desktop: keep grid */}
        {/* Desktop grid (md and above) */}
        <div className="hidden flex-col gap-8 md:flex">
          {rows.map((row, rowIdx) => (
            <div key={rowIdx} className="flex flex-row justify-center gap-8">
              {row.map((sponsor, idx) => (
                <div
                  key={idx}
                  className="flex h-60 w-72 flex-shrink-0 flex-col justify-between overflow-hidden rounded-2xl bg-[#212121] shadow-lg transition-transform duration-300 hover:scale-105"
                >
                  <div className="flex flex-grow items-center justify-center p-6">
                    <div className="relative h-20 w-full max-w-[200px]">
                      <Image
                        src={sponsor.logo}
                        alt={sponsor.name}
                        fill
                        className="object-contain"
                        sizes="200px"
                      />
                    </div>
                  </div>
                  {/* Text container at the bottom */}
                  <div className="bg-[#303030] p-4 text-center">
                    <div className="text-offwhite font-['AvantGarde-Bk-BT',sans-serif] text-lg font-semibold">
                      {sponsor.name}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
        {/* Mobile: horizontal scroll */}
        <div
          ref={mobileScrollRef}
          className="mt-8 flex gap-4 overflow-x-auto pb-2 md:hidden"
        >
          {data.map((sponsor, idx) => (
            <div
              key={idx}
              className="flex h-60 w-72 flex-shrink-0 flex-col justify-between overflow-hidden rounded-2xl bg-[#212121] shadow-lg transition-transform duration-300 hover:scale-105"
            >
              <div className="flex flex-grow items-center justify-center p-6">
                <div className="relative h-20 w-full max-w-[200px]">
                  <Image
                    src={sponsor.logo}
                    alt={sponsor.name}
                    fill
                    className="object-contain"
                    sizes="200px"
                  />
                </div>
              </div>
              <div className="bg-[#303030] p-4 text-center">
                <div className="text-offwhite font-['AvantGarde-Bk-BT',sans-serif] text-lg font-semibold">
                  {sponsor.name}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PastSponsors;
