import React from "react";
import Image from "next/image";

const JoinHackathonBanner = () => {
  return (
    <div className="relative flex h-[clamp(6rem,12vw,10rem)] w-[clamp(18rem,90vw,60rem)] flex-col-reverse items-center justify-between gap-6 overflow-hidden rounded-full bg-[#0a0f2b] px-4 py-6 sm:flex-row sm:px-8 md:w-[clamp(18rem,70vw,60rem)] md:px-12 lg:px-16">
      {/* Left Content */}
      <div className="text-offwhite z-10 flex flex-col items-start">
        <h2 className="font-kinetikaUltra absolute top-[clamp(1.4rem,2.75vw,2.75rem)] left-[clamp(1.7rem,4.6vw,4.6rem)] text-left text-xl leading-tight font-extrabold text-nowrap sm:top-[clamp(0.4rem,2.4vw,2.4rem)] sm:text-lg md:text-2xl lg:text-[2rem] xl:top-[clamp(1.4rem,2.75vw,2.75rem)] 2xl:top-[clamp(1.4rem,2.5vw,2.5rem)]">
          JOIN THE HACKATHON!
        </h2>
        {/*<button */}
        <a
          href="https://unstop.com/hackathons/muj-hackx-30-manipal-university-mu-jaipur-1565633"
          target="_blank"
          rel="noopener noreferrer"
          className="text-offwhite absolute bottom-[clamp(1.4rem,3.0vw,3.0rem)] left-[clamp(1.7rem,4.6vw,4.6rem)] inline-block transform rounded-full border-[clamp(0.05rem,0.13vw,0.13rem)] border-white bg-transparent px-[clamp(0.7rem,2vw,2rem)] py-[clamp(0.3rem,0.35vw,0.35rem)] text-center text-sm text-[clamp(0.5rem,0.9vw,0.9rem)] font-extrabold tracking-wide whitespace-nowrap shadow-lg transition-all duration-300 hover:scale-105 hover:border-white/30 hover:bg-white hover:text-black hover:shadow-xl focus:scale-105 focus:ring-4 focus:ring-white/50 focus:outline-none active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 sm:bottom-[clamp(0.4rem,2.9vw,2.9rem)] xl:bottom-[clamp(1.4rem,2.9vw,2.9rem)] 2xl:bottom-[clamp(1.4rem,2.6vw,2.6rem)]"
        >
          REGISTER NOW
        </a>
      </div>

      {/* Right Image */}
      <div className="absolute -bottom-[clamp(8rem,12vw,12rem)] left-[clamp(10rem,30.5vw,30.5rem)] w-[clamp(13rem,25vw,25rem]">
        <Image
          src="/HeroSection/ChipsSpline3.svg"
          alt="Glowing Shape"
          width={1000}
          height={500}
          style={{
            transform: "translateY(37%) translateX(10%) scale(2.5)",
            height: "40rem",
          }}
          priority
        />
      </div>
    </div>
  );
};

export default JoinHackathonBanner;
