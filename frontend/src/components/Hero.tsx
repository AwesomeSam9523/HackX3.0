import React from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import HackathonStats from "./Statistics";
import JoinHackathonBanner from "./JoinHackathon";
import PrizePoolCircle from "./PrizePoolCircle";
import LightBoxOthers from "./LightBoxOthers";
import Timer from "@/components/Timer";
import Themes from "@/components/Themes";
import Sponsors from "@/components/Sponsors";
import RegisterButton from "@/components/RegisterButton";

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
      <div className="relative z-10 mt-4 flex min-h-[80vh] flex-col items-center justify-center px-4 text-center lg:px-8">
        {/* Subtitle */}
        <button className="font-avgardn text-offwhite mt-4 rounded-full border-2 border-white bg-transparent px-10 py-3 text-xs font-bold tracking-tight uppercase transition-all duration-300 lg:text-lg">
          DEPARTMENT OF COMPUTER SCIENCE AND ENGINEERING, SCSE, FOSTA
        </button>
        <div className="font-avgardn text-offwhite relative mt-6 inline-block px-4 py-2 font-bold">
          {/* Corner Borders */}
          <span className="absolute top-0 left-0 h-[10px] w-[10px] border-3 border-r-0 border-b-0 border-white" />
          <span className="absolute top-0 right-0 h-[10px] w-[10px] border-3 border-b-0 border-l-0 border-white" />
          <span className="absolute bottom-0 left-0 h-[10px] w-[10px] border-3 border-t-0 border-r-0 border-white" />
          <span className="absolute right-0 bottom-0 h-[10px] w-[10px] border-3 border-t-0 border-l-0 border-white" />
          PRESENTS
        </div>

        {/* Main Title - Using SVG version from second code with fallback to text version */}
        <div className="relative mt-8 flex flex-col items-center justify-center text-center leading-none">
          {/* SVG Logo Version (from second code) */}
          <div className="font-kinetikaUltra text-offwhite absolute -top-5 left-0 m-0 p-0 text-3xl leading-none font-extrabold tracking-[0.2rem] lg:hidden">
            MUJ
          </div>
          <Image
            src="/HeroSection/HACKX 3.0.svg"
            alt="HACKX 3.0 Logo"
            width={800}
            height={200}
            className="h-auto w-full max-w-[800px] object-contain lg:ml-16"
            priority
          />

          <div className="font-kinetikaUltra text-offwhite m-0 -mt-4 p-0 text-xl leading-none font-extrabold lg:text-4xl">
            MUJ&apos;S LARGEST HACKATHON
          </div>

          {/* Prize Pool Circle from second version */}
          <PrizePoolCircle />
        </div>

        <div className="font-kinetikaUltra text-offwhite relative mt-12 flex w-full flex-col items-center gap-8 overflow-hidden py-2 uppercase lg:hidden">
          <div className="text-base">
            Join the ultimate tech showdown a hackathon where your ideas ignite,
            your code transforms, and your innovations shine!
          </div>
          <div className="w-1/2">
            <RegisterButton />
          </div>
        </div>

        {/* Features - SDG Logos */}
        <div className="mt-10 flex flex-wrap items-center justify-center lg:mt-20 lg:flex-nowrap lg:space-x-4">
          {FeatureLogos.map((logo, index) => (
            <div key={index} className="p-4">
              <Image
                src={`/HeroSection/${logo.src}`}
                alt={logo.alt}
                width={90}
                height={90}
                className="h-20 w-20 object-contain"
              />
            </div>
          ))}
        </div>

        {/* Stats */}
        <HackathonStats />

        {/* CTA Buttons */}
        <div className="mb:mt-12 -mt-7 mb-7 flex-col gap-4 sm:flex-row md:mb-15 lg:mt-15 lg:flex">
          <JoinHackathonBanner />
        </div>
        <div className="w-full">
          <Timer />
        </div>

        {/*light boxes*/}
        <LightBoxOthers name="home" id={0} />

        <div className="mt-16 w-full lg:mt-32">
          <Themes />
        </div>

        <div className="mt-16 w-full lg:mt-32">
          <Sponsors />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
