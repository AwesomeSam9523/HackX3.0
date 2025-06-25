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

const PastSponsors = () => {
  const [activeTab, setActiveTab] = useState<"sponsors" | "in-kind">(
    "sponsors",
  );
  const data = activeTab === "sponsors" ? sponsorsData : inKindSponsorsData;

  // Dynamic pill width and position
  const sponsorsRef = useRef<HTMLButtonElement>(null);
  const inKindRef = useRef<HTMLButtonElement>(null);
  const [pillStyle, setPillStyle] = useState({ width: 0, left: 0 });

  useEffect(() => {
    const sponsorsBtn = sponsorsRef.current;
    const inKindBtn = inKindRef.current;
    if (sponsorsBtn && inKindBtn) {
      if (activeTab === "sponsors") {
        setPillStyle({
          width: sponsorsBtn.offsetWidth,
          left: sponsorsBtn.offsetLeft,
        });
      } else {
        setPillStyle({
          width: inKindBtn.offsetWidth,
          left: inKindBtn.offsetLeft,
        });
      }
    }
  }, [activeTab]);

  // data for custom grid: 4, 4, 3
  const rows = [data.slice(0, 4), data.slice(4, 8), data.slice(8, 11)];

  return (
    <section className="flex min-h-screen w-full flex-col items-center bg-gradient-to-br from-black to-gray-900 px-4 py-16">
      <h2 className="mb-8 text-center text-4xl font-extrabold text-white md:text-5xl">
        OUR PAST PARTNERS
      </h2>
      <div className="relative mx-auto mb-10 box-border flex h-[86px] w-full max-w-xl items-center justify-start gap-0 overflow-hidden rounded-full border-[3px] border-[#fffff1] bg-transparent p-2">
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
        <button
          ref={sponsorsRef}
          className={`relative z-10 h-[70px] rounded-full px-10 text-2xl font-extrabold transition-all duration-200 focus:outline-none ${
            activeTab === "sponsors" ? "text-[#222]" : "text-[#fffff1]"
          }`}
          style={{ border: "none" }}
          onClick={() => setActiveTab("sponsors")}
        >
          SPONSORS
        </button>
        <button
          ref={inKindRef}
          className={`relative z-10 h-[70px] rounded-full px-10 text-2xl font-extrabold transition-all duration-200 focus:outline-none ${
            activeTab === "in-kind" ? "text-[#222]" : "text-[#fffff1]"
          }`}
          style={{ border: "none" }}
          onClick={() => setActiveTab("in-kind")}
        >
          IN-KIND SPONSORS
        </button>
      </div>
      <div className="flex w-full max-w-6xl flex-col gap-8">
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
                    width={sponsor.name === "Programming Pathshala" ? 80 : 140} //specific for this only
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
    </section>
  );
};

export default PastSponsors;
