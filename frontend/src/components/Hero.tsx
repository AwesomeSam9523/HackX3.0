 import React from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import HackathonStats from "./Statistics";
import JoinHackathonBanner from "./JoinHackathon";
// import { Link } from "lucide-react";

// // Placeholder SVG components - replace these with your own SVG elements
// const DecorationSVG1 = () => (
//   <svg width="200" height="300" viewBox="0 0 200 300" className="absolute">
//     <path
//       d="M50 20 Q80 50 60 100 Q40 150 70 200 Q100 250 80 280"
//       stroke="url(#gradient1)"
//       strokeWidth="3"
//       fill="none"
//     />
//     <defs>
//       <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
//         <stop offset="0%" stopColor="#3B82F6" />
//         <stop offset="100%" stopColor="#8B5CF6" />
//       </linearGradient>
//     </defs>
//   </svg>
// );

// const DecorationSVG2 = () => (
//   <svg width="150" height="200" viewBox="0 0 150 200" className="absolute">
//     <path
//       d="M20 180 Q50 150 40 100 Q30 50 60 20 Q90 50 80 100"
//       stroke="url(#gradient2)"
//       strokeWidth="4"
//       fill="none"
//     />
//     <defs>
//       <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
//         <stop offset="0%" stopColor="#06B6D4" />
//         <stop offset="100%" stopColor="#3B82F6" />
//       </linearGradient>
//     </defs>
//   </svg>
// );

// const DecorationSVG3 = () => (
//   <svg width="180" height="250" viewBox="0 0 180 250" className="absolute">
//     <path
//       d="M160 30 Q130 60 150 110 Q170 160 140 210 Q110 240 120 220"
//       stroke="url(#gradient3)"
//       strokeWidth="3"
//       fill="none"
//     />
//     <defs>
//       <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="100%">
//         <stop offset="0%" stopColor="#8B5CF6" />
//         <stop offset="100%" stopColor="#EC4899" />
//       </linearGradient>
//     </defs>
//   </svg>
// );

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
    <section className="relative min-h-screen items-center overflow-hidden bg-black">
      {/* <div className="fixed inset-0 w-full h-full pointer-events-none z-10">
        <Image
          src="/x2.png" 
          alt="Background decoration"
          width={384}
          height={384}
          className="w-full h-full object-contain opacity-50"
        />
      </div> */}

      <div>
        <Image
          src="/HeroSection/Ellipse1.svg"
          alt="Gradient"
          width={1800}
          height={850}
          className="absolute z-5"
        />
      </div>
      <div className="">
        <Image
          src="/HeroSection/X.svg"
          alt="HackxIcon"
          width={895}
          height={1000}
          className="absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2 opacity-40 mix-blend-overlay"
        />
      </div>

      {/* Navigation */}
      <Navbar />
      {/* <nav className="relative  z-15 flex justify-between items-center px-8 ">
        <Image
          src="/HeroSection/logo.svg"
          alt="HackxIcon"
          width={100}
          height={100}
          className=""
        />
        <Image
          src="/HeroSection/ChipsSpline1.svg"
          alt="HackxIcon"
          width={1000}
          height={100}
          className="mt-0"
        />
        <div className="">
       <button className="bg-transparent border-2 border-white hover:bg-white/10 transition-all duration-300 px-5 py-2 rounded-full text-lg font-semibold uppercase tracking-tight text-white">
            REGISTER NOW
          </button>
</div>
       
      </nav> */}

      {/* Main Content */}
      <div className="relative z-10 mt-10 flex min-h-[80vh] flex-col items-center justify-center px-8 text-center">
        {/* Subtitle */}
        <button className="rounded-full border-2 border-white bg-transparent px-5 py-3 text-lg font-semibold tracking-tight text-white uppercase transition-all duration-300 mt-4 ">
          DEPARTMENT OF COMPUTER SCIENCE AND ENGINEERING, SCSE, FOSTA
        </button>
        <div className="relative inline-block px-6 py-3 font-roboto mt-6 text-white">
  {/* Corner Borders */}
  <span className="absolute top-0 left-0 h-[10px] w-[10px] border-3 border-white border-b-0 border-r-0" />
  <span className="absolute top-0 right-0 h-[10px] w-[10px] border-3 border-white border-b-0 border-l-0" />
  <span className="absolute bottom-0 left-0 h-[10px] w-[10px] border-3 border-white border-t-0 border-r-0" />
  <span className="absolute bottom-0 right-0 h-[10px] w-[10px] border-3 border-white border-t-0 border-l-0" />
  
  PRESENTS
</div>


        {/* Main Title */}
        <div className="flex flex-col items-center justify-center gap-0 py-0 text-center">
          <Image
            src="/HeroSection/hackx.svg"
            alt="Join Now "
            width={850}
            height={320}
            className="mt-2"
          />
          <div className="font-roboto text-4xl font-extrabold">MUJ'S LARGEST HACKATHON</div>
        </div>

        {/* Features */}
        <div className="mb-12 flex space-x-4">
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
        <div className="mt-15 mb-12 flex flex-col items-center justify-center gap-2 md:gap-16">
          <div className="relative inline-block px-6 py-3 font-roboto mt-6 text-white">
  {/* Corner Borders */}
  <span className="absolute top-0 left-0 h-[10px] w-[10px] border-3 border-white border-b-0 border-r-0" />
  <span className="absolute top-0 right-0 h-[10px] w-[10px] border-3 border-white border-b-0 border-l-0" />
  <span className="absolute bottom-0 left-0 h-[10px] w-[10px] border-3 border-white border-t-0 border-r-0" />
  <span className="absolute bottom-0 right-0 h-[10px] w-[10px] border-3 border-white border-t-0 border-l-0" />
  
HACKATHON STATS
</div>
          <HackathonStats/>
        </div>

        {/* CTA Buttons */}
        <div className="mt-15 mb-15 flex flex-col gap-4 sm:flex-row">
         <JoinHackathonBanner/>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
