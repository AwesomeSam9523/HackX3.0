import React from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import HackathonStats from "./Statistics";
import JoinHackathonBanner from "./JoinHackathon";
import PrizePoolCircle from "./PrizePoolCircle";
import LightBlock from "@/components/LightBlock";
import Timer from "@/components/Timer";
import Themes from "@/components/Themes";
import Sponsors from "@/components/Sponsors";

interface FeaturesLogo {
  src: string;
  alt: string;
}

const FeatureLogos: FeaturesLogo[] = [
  { src: "sdg1.svg", alt: "SDG 1" },
  { src: "sdg2.svg", alt: "SDG 2" },
  { src: "sdg3.svg", alt: "SDG 3" },
  { src: "sdg4.svg", alt: "SDG 4" },
  { src: "sdg5.svg", alt: "SDG 5" },
  { src: "sdg6.svg", alt: "SDG 6" },
  { src: "sdg7.svg", alt: "SDG 7" },
  { src: "sdg8.svg", alt: "SDG 8" },
  { src: "sdg9.svg", alt: "SDG 9" },
];

const HeroSection = () => {
  return (
    <div className="relative min-h-screen items-center overflow-hidden bg-transparent">
      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <div className="relative z-10 mt-10 flex min-h-[80vh] flex-col items-center justify-center px-8 text-center">
        {/* Subtitle */}
        <button className="font-avgardn mt-4 rounded-full border-2 border-white bg-transparent px-10 py-3 text-lg font-bold tracking-tight text-white uppercase transition-all duration-300">
          DEPARTMENT OF COMPUTER SCIENCE AND ENGINEERING, SCSE, FOSTA
        </button>
        <div className="font-avgardn relative mt-6 inline-block px-4 py-2 font-bold text-white">
          {/* Corner Borders */}
          <span className="absolute top-0 left-0 h-[10px] w-[10px] border-3 border-r-0 border-b-0 border-white" />
          <span className="absolute top-0 right-0 h-[10px] w-[10px] border-3 border-b-0 border-l-0 border-white" />
          <span className="absolute bottom-0 left-0 h-[10px] w-[10px] border-3 border-t-0 border-r-0 border-white" />
          <span className="absolute right-0 bottom-0 h-[10px] w-[10px] border-3 border-t-0 border-l-0 border-white" />
          PRESENTS
        </div>

        {/* Main Title - Using SVG version from second code with fallback to text version */}
        <div className="relative mt-4 flex flex-col items-center justify-center text-center leading-none">
          {/* SVG Logo Version (from second code) */}
          <Image
            src="/HeroSection/HACKX 3.0.svg"
            alt="HACKX 3.0 Logo"
            width={800}
            height={200}
            className="ml-16 h-auto w-full max-w-[800px] object-contain"
            priority
          />

          <div className="font-kinetikaUltra m-0 -mt-4 p-0 text-4xl leading-none font-extrabold text-white">
            MUJ&apos;S LARGEST HACKATHON
          </div>

          {/* Prize Pool Circle from second version */}
          <PrizePoolCircle />
        </div>

        {/* Features - SDG Logos */}
        <div className="mt-20 flex space-x-4">
          {FeatureLogos.map((logo, index) => (
            <div key={index} className="p-4">
              <Image
                src={`/HeroSection/${logo.src}`}
                alt={logo.alt}
                width={90}
                height={90}
              />
            </div>
          ))}
        </div>

        {/* Stats */}
        <HackathonStats />

        {/* CTA Buttons */}
        <div className="mt-15 mb-15 flex flex-col gap-4 sm:flex-row">
          <JoinHackathonBanner />
        </div>
        <div className="absolute top-[50rem] right-0 -z-10 h-[20rem] w-1/2">
          <LightBlock position="right" />
        </div>
        <div className="w-full">
          <Timer />
        </div>

        <div className="mt-32 w-full">
          <Themes />
        </div>
        <div className="absolute top-[160rem] left-0 -z-10 h-[20rem] w-1/2">
          <LightBlock position="left" />
        </div>

        <div className="mt-32 w-full">
          <Sponsors />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
