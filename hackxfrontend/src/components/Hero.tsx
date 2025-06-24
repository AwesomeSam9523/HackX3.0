import React from "react";
import Image from "next/image";
import Navbar from "./Navbar";
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
  
  { src: "sdg2.svg", alt: "SDG 2"},
  { src: "sdg3.svg", alt: "SDG 3"},
  { src: "sdg4.svg", alt: "SDG 4"},
  { src: "sdg5.svg", alt: "SDG 5" },
  { src: "sdg6.svg", alt: "SDG 6" },
   { src: "sdg7.svg", alt: "SDG 7" },
  { src: "sdg8.svg", alt: "SDG 8",  },
  { src: "sdg9.svg", alt: "SDG 9",  },
];
const HeroSection = () => {
  return (
    <section className="relative min-h-screen bg-black  items-center overflow-hidden">

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
          className="z-5 absolute "
        />
      </div>
      <div className="">
  <Image
    src="/HeroSection/X.svg"
    alt="HackxIcon"
    width={895}
    height={1000}
    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-40 mix-blend-overlay z-10"
  />
</div>


      {/* Navigation */}
      <Navbar/>
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
      <div className="relative mt-10 z-10 flex flex-col items-center justify-center min-h-[80vh] px-8 text-center">
        {/* Subtitle */}
        <button className="bg-transparent border-2 border-white hover:bg-white/10 transition-all duration-300 px-5 py-3 rounded-full text-lg font-semibold uppercase tracking-tight text-white">
            DEPARTMENT OF COMPUTER SCIENCE AND ENGINEERING, SCSE, FOSTA
          </button>
        <Image
          src="/HeroSection/presents.svg"
          alt="Join Now "
          width={120}
          height={30}
          className="mt-8   "
        />

        {/* Main Title */}
        <div className="py-0 flex flex-col items-center justify-center text-center gap-0">
          <Image
            src="/HeroSection/hackx.svg"
            alt="Join Now "
            width={850}
            height={320}
            className="mt-2"
          />
          <Image
            src="/HeroSection/largest.svg"
            alt="Join Now "
            width={650}
            height={40}
            className="py-0"
          />
        </div>

        {/* Features */}
        <div className="flex space-x-4 mb-12">
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
        <div className="flex flex-col mt-15 items-center justify-center gap-2 md:gap-16 mb-12">
          <Image
            src="/HeroSection/stats.svg"
            alt="stats "
            width={200}
            height={50}
          />
          <Image
            src="/HeroSection/numbers.svg"
            alt="Numbers "
            width={1000}
            height={185}
          />
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col mt-15 mb-15 sm:flex-row gap-4">
          <Image
            src="/HeroSection/join.svg"
            alt="Join Now "
            width={1000}
            height={185}
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
