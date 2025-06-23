import React from "react";
import Image from "next/image";
import { Link } from "lucide-react";

// Placeholder SVG components - replace these with your own SVG elements
const DecorationSVG1 = () => (
  <svg width="200" height="300" viewBox="0 0 200 300" className="absolute">
    <path
      d="M50 20 Q80 50 60 100 Q40 150 70 200 Q100 250 80 280"
      stroke="url(#gradient1)"
      strokeWidth="3"
      fill="none"
    />
    <defs>
      <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3B82F6" />
        <stop offset="100%" stopColor="#8B5CF6" />
      </linearGradient>
    </defs>
  </svg>
);

const DecorationSVG2 = () => (
  <svg width="150" height="200" viewBox="0 0 150 200" className="absolute">
    <path
      d="M20 180 Q50 150 40 100 Q30 50 60 20 Q90 50 80 100"
      stroke="url(#gradient2)"
      strokeWidth="4"
      fill="none"
    />
    <defs>
      <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#06B6D4" />
        <stop offset="100%" stopColor="#3B82F6" />
      </linearGradient>
    </defs>
  </svg>
);

const DecorationSVG3 = () => (
  <svg width="180" height="250" viewBox="0 0 180 250" className="absolute">
    <path
      d="M160 30 Q130 60 150 110 Q170 160 140 210 Q110 240 120 220"
      stroke="url(#gradient3)"
      strokeWidth="3"
      fill="none"
    />
    <defs>
      <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8B5CF6" />
        <stop offset="100%" stopColor="#EC4899" />
      </linearGradient>
    </defs>
  </svg>
);

interface FeaturesLogo {
  src: string;
  alt: string;
  width: number;
  height: number;
}

const FeatureLogos: FeaturesLogo[] = [
  { src: "SDG4.svg", alt: "Axure", width: 120, height: 40 },
  { src: "oracle.svg", alt: "Oracle Academy", width: 140, height: 40 },
  { src: "cdcc.svg", alt: "CDGC", width: 100, height: 40 },
  { src: "bikesetu.svg", alt: "BikeSetu", width: 130, height: 40 },
  { src: "radio.svg", alt: "Pin Store", width: 110, height: 40 },
  { src: "bobble.svg", alt: "Bobble AI", width: 120, height: 40 },
  { src: "ed.svg", alt: "EDU", width: 100, height: 40 },
  { src: "designstudio.svg", alt: "Design Studio", width: 140, height: 40 },
];
const HeroSection = () => {
  return (
    <section className="relative min-h-screen bg-black items-center overflow-hidden">
      {/* Background Decorative SVGs - Replace these with your own */}
      <div>
        <Image
          src="/HeroSection/Ellipse1.svg"
          alt="HackxIcon"
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
      <nav className="relative z-15 flex justify-between items-center px-8 ">
        <Image
          src="/HeroSection/logo.svg"
          alt="HackxIcon"
          width={100}
          height={100}
          className=""
        />
        <Image
          src="/HeroSection/ChipsSpline1.svg"
          alt="Register Now"
          width={895}
          height={820}
          className="item-center top-0 mt-0 mx-auto"
        />

        <Image
          src="/HeroSection/registernow.svg"
          alt="Register Now"
          width={131}
          height={50}
          className=""
        />
      </nav>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] px-8 text-center">
        {/* Subtitle */}
        <Image
          src="/HeroSection/department.svg"
          alt="Join Now "
          width={720}
          height={52}
          className="mt-10"
        />
        <Image
          src="/HeroSection/presents.svg"
          alt="Join Now "
          width={120}
          height={30}
          className="mt-8   "
        />

        {/* Main Title */}
        <div className="flex flex-col items-center justify-center text-center gap-0">
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
            className=""
          />
        </div>

        {/* Features */}
        <div className="flex space-x-6 mb-12">
          {FeatureLogos.map((logo, index) => (
            <div key={index} className="p-4">
              <img
                src={`/HeroSection/${logo.src}`}
                alt={logo.alt}
                width={logo.width}
                height={logo.height}
              />
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-8 md:gap-16 mb-12">
          <Image
            src="/HeroSection/stats.svg"
            alt="Join Now "
            width={1000}
            height={185}
          />
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
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
