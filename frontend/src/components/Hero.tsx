"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import { motion, useAnimation, useMotionValue } from "framer-motion";
import Navbar from "@/components/Navbar";
import HackathonStats from "./Statistics";
import JoinHackathonBanner from "./JoinHackathon";

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

// Framer Motion Circular Text Component
const CircularText = ({
  text,
  spinDuration = 20,
  onHover = "speedUp",
  className = "",
  radius = 45,
}) => {
  const letters = Array.from(text);
  const controls = useAnimation();
  const rotation = useMotionValue(0);

  useEffect(() => {
    const start = rotation.get();
    controls.start({
      rotate: start + 360,
      transition: {
        rotate: {
          from: start,
          to: start + 360,
          ease: "linear",
          duration: spinDuration,
          repeat: Infinity,
        },
      },
    });
  }, [spinDuration, controls, rotation]);

  const handleHoverStart = () => {
    const start = rotation.get();
    if (!onHover) return;

    let duration = spinDuration;
    switch (onHover) {
      case "slowDown":
        duration = spinDuration * 2;
        break;
      case "speedUp":
        duration = spinDuration / 4;
        break;
      case "pause":
        controls.stop();
        return;
      case "goBonkers":
        duration = spinDuration / 10;
        break;
      default:
        duration = spinDuration;
    }

    controls.start({
      rotate: start + 360,
      transition: {
        rotate: {
          from: start,
          to: start + 360,
          ease: "linear",
          duration: duration,
          repeat: Infinity,
        },
      },
    });
  };

  const handleHoverEnd = () => {
    const start = rotation.get();
    controls.start({
      rotate: start + 360,
      transition: {
        rotate: {
          from: start,
          to: start + 360,
          ease: "linear",
          duration: spinDuration,
          repeat: Infinity,
        },
      },
    });
  };

  return (
    <motion.div
      className={`absolute inset-0 h-full w-full ${className}`}
      style={{ rotate: rotation }}
      initial={{ rotate: 0 }}
      animate={controls}
      onMouseEnter={handleHoverStart}
      onMouseLeave={handleHoverEnd}
    >
      {letters.map((letter, i) => {
        const rotationDeg = (360 / letters.length) * i;
        const radians = (rotationDeg * Math.PI) / 180;
        const x = Math.cos(radians) * radius;
        const y = Math.sin(radians) * radius;

        return (
          <span
            key={i}
            className="absolute text-[8px] font-[850] font-extrabold tracking-wide text-white uppercase"
            style={{
              left: "50%",
              top: "50%",
              transform: `translate(-50%, -50%) translate(${x}px, ${y}px) rotate(${rotationDeg + 90}deg)`,
              transformOrigin: "center",
            }}
          >
            {letter}
          </span>
        );
      })}
    </motion.div>
  );
};

// Updated Prize Pool Circle Component
const PrizePoolCircle = () => {
  const text = "TOTAL PRIZE POOL • TOTAL PRIZE POOL • ";

  return (
    <div
      className="relative"
      style={{
        width: "106.5246353149414px",
        height: "108.4100341796875px",
        background: "#D9D9D91A",
        backdropFilter: "blur(51.37692642211914px)",
        borderRadius: "50%",
        position: "absolute",
        zIndex: 20,
        top: "23px",
        right: "100px",
        transform: "translate(40%, -40%)",
      }}
    >
      <CircularText
        text={text}
        spinDuration={15}
        onHover="speedUp"
        radius={45}
      />
      {/* Center text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className="text-2xl font-bold text-white"
          style={{ transform: "rotate(-15.51deg)" }}
        >
          ₹5L+
        </span>
      </div>
    </div>
  );
};

const HeroSection = () => {
  return (
    <section className="relative min-h-screen items-center overflow-hidden bg-black">
      <Navbar />
      <div className="relative z-10 mt-10 flex min-h-[80vh] flex-col items-center justify-center px-8 text-center">
        <button className="font-avgardn mt-4 rounded-full border-2 border-white bg-transparent px-10 py-3 text-lg tracking-tight text-white uppercase transition-all duration-300">
          DEPARTMENT OF COMPUTER SCIENCE AND ENGINEERING, SCSE, FOSTA
        </button>
        <div className="font-avgardn relative mt-6 inline-block px-4 py-2 text-white">
          <span className="absolute top-0 left-0 h-[10px] w-[10px] border-3 border-r-0 border-b-0 border-white" />
          <span className="absolute top-0 right-0 h-[10px] w-[10px] border-3 border-b-0 border-l-0 border-white" />
          <span className="absolute bottom-0 left-0 h-[10px] w-[10px] border-3 border-t-0 border-r-0 border-white" />
          <span className="absolute right-0 bottom-0 h-[10px] w-[10px] border-3 border-t-0 border-l-0 border-white" />
          PRESENTS
        </div>

        <div className="relative mt-4 flex flex-col items-center justify-center text-center leading-none">
          <Image
            src="/HeroSection/HACKX 3.0.svg"
            alt="HACKX 3.0 Logo"
            width={800}
            height={200}
            className="ml-16 h-auto w-full max-w-[800px] object-contain"
            priority
          />
          <div className="font-kinetikaUltra m-0 -mt-4 p-0 text-4xl leading-none font-extrabold">
            MUJ&apos;S LARGEST HACKATHON
          </div>
          <PrizePoolCircle />
        </div>

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
        <HackathonStats />
        <div className="mt-15 mb-15 flex flex-col gap-4 sm:flex-row">
          <JoinHackathonBanner />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
