"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";

const sponsorsData = [
  {
    logo: "/programmingpathshala.svg",
    name: "Programming Pathshala",
    type: "HIRING PARTNER",
  },
  {
    logo: "/scribbr.svg",
    name: "Scribbr",
    type: "LANGUAGE PARTNER",
  },
  {
    logo: "/quillbot.svg",
    name: "QuillBot",
    type: "LANGUAGE PARTNER",
  },
  {
    logo: "/languagetool.svg",
    name: "LanguageTool",
    type: "LANGUAGE PARTNER",
  },
  {
    logo: "/programmingpathshala.svg",
    name: "Programming Pathshala",
    type: "HIRING PARTNER",
  },
  {
    logo: "/scribbr.svg",
    name: "Scribbr",
    type: "LANGUAGE PARTNER",
  },
  {
    logo: "/quillbot.svg",
    name: "QuillBot",
    type: "LANGUAGE PARTNER",
  },
  {
    logo: "/languagetool.svg",
    name: "LanguageTool",
    type: "LANGUAGE PARTNER",
  },
  {
    logo: "/programmingpathshala.svg",
    name: "Programming Pathshala",
    type: "HIRING PARTNER",
  },
  {
    logo: "/scribbr.svg",
    name: "Scribbr",
    type: "LANGUAGE PARTNER",
  },
  {
    logo: "/quillbot.svg",
    name: "QuillBot",
    type: "LANGUAGE PARTNER",
  },
  // Repeat or add more as needed
];

const inKindSponsorsData = [
  {
    logo: "/scribbr.svg",
    name: "Scribbr",
    type: "LANGUAGE PARTNER",
  },
  {
    logo: "/quillbot.svg",
    name: "QuillBot",
    type: "LANGUAGE PARTNER",
  },
  {
    logo: "/languagetool.svg",
    name: "LanguageTool",
    type: "LANGUAGE PARTNER",
  },
  // Add more as needed
];

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

  // Ref for mobile scroll container
  const mobileScrollRef = useRef<HTMLDivElement>(null);
  const tabScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Update pill position and width
    const idx = tabOptions.findIndex((tab) => tab.key === activeTab);
    const btn = tabRefs.current[idx];
    if (btn) {
      setPillStyle({
        width: btn.offsetWidth,
        left: btn.offsetLeft,
      });
      // Scroll tab into view on mobile
      if (window.innerWidth < 768 && tabScrollRef.current) {
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
    <section className="flex min-h-screen w-full flex-col items-center bg-gradient-to-br from-black to-gray-900 px-4 py-16">
      <h2 className="font-kinetikaUltra mb-8 text-center text-4xl font-extrabold text-white md:text-5xl">
        OUR PAST PARTNERS
      </h2>
      {/* Option selector: pill for desktop, stacked for mobile */}
      {/* Desktop pill selector */}
      <div
        ref={tabScrollRef}
        className="scrollbar-hide relative mx-auto mb-10 box-border hidden h-[86px] w-full max-w-xl items-center justify-start gap-0 rounded-full border-[3px] border-[#fffff1] bg-transparent p-2 md:flex md:overflow-visible"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {/* Sliding pill background */}
        <div
          className="absolute left-0 z-0 rounded-full bg-[#fffff1] transition-all duration-300 ease-in-out"
          style={{
            width: pillStyle.width,
            left: pillStyle.left,
            height: "70px",
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
            className={`relative z-10 h-[70px] rounded-full px-10 text-2xl font-extrabold whitespace-nowrap transition-all duration-200 focus:outline-none ${
              activeTab === tab.key ? "text-[#222]" : "text-[#fffff1]"
            }`}
            style={{ border: "none" }}
            onClick={() => setActiveTab(tab.key as typeof activeTab)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {/* Mobile stacked selector */}
      <div className="mx-auto mb-10 flex w-full max-w-xs flex-col gap-3 md:hidden">
        {tabOptions.map((tab) => (
          <button
            key={tab.key}
            className={`w-full rounded-xl border-2 py-4 text-lg font-bold transition-all duration-200 focus:outline-none ${
              activeTab === tab.key
                ? "border-[#fffff1] bg-[#fffff1] text-[#222]"
                : "border-[#fffff1] bg-transparent text-[#fffff1]"
            }`}
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
                  className="flex h-60 w-72 flex-shrink-0 flex-col justify-between overflow-hidden rounded-2xl bg-[#212121] shadow-lg"
                >
                  {/* Logo container - centers the logo */}
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
                    <div className="text-lg font-semibold text-white">
                      {sponsor.name}
                    </div>
                    <div className="text-xs tracking-wider text-gray-400 uppercase">
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
          className="flex gap-4 overflow-x-auto pb-2 md:hidden"
        >
          {data.map((sponsor, idx) => (
            <div
              key={idx}
              className="flex h-60 w-72 flex-shrink-0 flex-col justify-between overflow-hidden rounded-2xl bg-[#212121] shadow-lg"
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
                <div className="text-lg font-semibold text-white">
                  {sponsor.name}
                </div>
                <div className="text-xs tracking-wider text-gray-400 uppercase">
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
