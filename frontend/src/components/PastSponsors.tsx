"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { sponsorsData, inKindSponsorsData } from "../../data/sponsorsData";

const tabOptions = [
  { key: "sponsors", label: "SPONSORS" },
  { key: "in-kind", label: "IN-KIND SPONSORS" },
  // Add more tabs here if needed
];

const PastSponsors = () => {
  const [activeTab, setActiveTab] = useState<"sponsors" | "in-kind">(
    "sponsors",
  );
  const data = activeTab === "sponsors" ? sponsorsData : inKindSponsorsData;

  // Dynamic pill width and position
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [pillStyle, setPillStyle] = useState({ width: 0, left: 0 });

  // State for dynamic pill height
  const [pillHeight, setPillHeight] = useState(70);

  useEffect(() => {
    const updatePillHeight = () => {
      setPillHeight(window.innerWidth < 768 ? 54 : 70);
    };

    updatePillHeight();
    window.addEventListener("resize", updatePillHeight);
    return () => window.removeEventListener("resize", updatePillHeight);
  }, []);

  // Ref for mobile scroll container
  const mobileScrollRef = useRef<HTMLDivElement>(null);
  const tabScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Update pill position and width
    const idx = tabOptions.findIndex((tab) => tab.key === activeTab);
    const btn = tabRefs.current[idx];
    if (btn) {
      const isMobile = window.innerWidth < 768;
      const padding = isMobile ? 8 : 12; // Reduced padding for mobile

      if (idx === 0) {
        // First tab: align pill to parent's left edge
        const width = isMobile
          ? btn.offsetWidth + btn.offsetLeft / 2 // Reduced width for mobile
          : btn.offsetWidth + btn.offsetLeft;
        setPillStyle({
          width: width,
          left: 7,
        });
      } else {
        const width = isMobile
          ? btn.offsetWidth // Reduced width for mobile
          : btn.offsetWidth;
        setPillStyle({
          width: width,
          left: btn.offsetLeft - padding + 6,
        });
      }

      // Scroll tab into view on mobile
      if (isMobile && tabScrollRef.current) {
        const scrollContainer = tabScrollRef.current;
        const btnRect = btn.getBoundingClientRect();
        const containerRect = scrollContainer.getBoundingClientRect();
        if (
          btnRect.left < containerRect.left ||
          btnRect.right > containerRect.right
        ) {
          btn.scrollIntoView({
            behavior: "smooth",
            inline: "center",
            block: "nearest",
          });
        }
      }
    }
  }, [activeTab]);

  // Add resize event listener to handle device orientation changes
  useEffect(() => {
    const handleResize = () => {
      // Recalculate pill position on resize
      const idx = tabOptions.findIndex((tab) => tab.key === activeTab);
      const btn = tabRefs.current[idx];
      if (btn) {
        const isMobile = window.innerWidth < 768;
        const padding = isMobile ? 8 : 12; // Reduced padding for mobile

        if (idx === 0) {
          const width = isMobile
            ? btn.offsetWidth + btn.offsetLeft / 2 // Reduced width for mobile
            : btn.offsetWidth + btn.offsetLeft;
          setPillStyle({
            width: width,
            left: 7,
          });
        } else {
          const width = isMobile
            ? btn.offsetWidth - 16 // Reduced width for mobile
            : btn.offsetWidth;
          setPillStyle({
            width: width,
            left: btn.offsetLeft - padding + 6,
          });
        }
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [activeTab]);

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
  const rows = [data.slice(0, 4), data.slice(4, 8), data.slice(8, 11)];

  return (
    <section
      className="flex min-h-screen w-full flex-col items-center bg-black px-4 py-16"
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
        OUR PAST PARTNERS
      </h2>

      {/* Unified pill selector for both desktop and mobile */}
      <div
        ref={tabScrollRef}
        className="scrollbar-hide relative mx-auto mb-10 flex h-[70px] w-full max-w-fit items-center justify-center gap-1 overflow-x-auto rounded-full border-2 border-[#fffff1] bg-transparent px-3 md:h-[86px] md:overflow-hidden md:border-[3px] md:px-2"
        style={{ WebkitOverflowScrolling: "touch", minWidth: "fit-content" }}
      >
        {/* Sliding pill background */}
        <div
          className="absolute z-0 rounded-full bg-[#fffff1] transition-all duration-300 ease-in-out"
          style={{
            width: pillStyle.width,
            left: pillStyle.left,
            height: pillHeight,
            top: "50%",
            transform: "translateY(-50%)",
          }}
        />
        {tabOptions.map((tab, idx) => (
          <button
            key={tab.key}
            ref={(el) => {
              tabRefs.current[idx] = el;
            }}
            className={`relative z-10 h-[54px] flex-shrink-0 rounded-full px-6 font-['AvantGarde-Bk-BT',sans-serif] text-base font-extrabold whitespace-nowrap transition-all duration-200 focus:outline-none md:h-[70px] md:px-12 md:text-2xl ${
              activeTab === tab.key ? "text-[#222]" : "text-offwhite"
            }`}
            style={{ border: "none" }}
            onClick={() => setActiveTab(tab.key as typeof activeTab)}
          >
            {tab.label}
          </button>
        ))}
      </div>

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
                  <div className="flex flex-grow items-center justify-center p-4">
                    <Image
                      src={sponsor.logo}
                      alt={sponsor.name}
                      width={
                        sponsor.name === "Programming Pathshala" ? 80 : 140
                      } //specific for this only
                      height={50}
                      className="object-contain"
                    />
                  </div>
                  {/* Text container at the bottom */}
                  <div className="bg-[#303030] p-4 text-center">
                    <div className="text-offwhite font-['AvantGarde-Bk-BT',sans-serif] text-lg font-semibold">
                      {sponsor.name}
                    </div>
                    <div className="font-['AvantGarde-Bk-BT',sans-serif] text-xs tracking-wider text-gray-400 uppercase">
                      {sponsor.type}
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
              <div className="flex flex-grow items-center justify-center p-4">
                <Image
                  src={sponsor.logo}
                  alt={sponsor.name}
                  width={sponsor.name === "Programming Pathshala" ? 80 : 140}
                  height={50}
                  className="object-contain"
                />
              </div>
              <div className="bg-[#303030] p-4 text-center">
                <div className="text-offwhite font-['AvantGarde-Bk-BT',sans-serif] text-lg font-semibold">
                  {sponsor.name}
                </div>
                <div className="font-['AvantGarde-Bk-BT',sans-serif] text-xs tracking-wider text-gray-400 uppercase">
                  {sponsor.type}
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
