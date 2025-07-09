import React from "react";
import Image from "next/image";

const JoinHackathonBanner = () => {
  return (
    <div className="relative flex h-[180px] w-full max-w-[950px] items-center justify-between overflow-hidden rounded-full bg-[#0a0f2b] px-18 py-12 md:py-8">
      {/* Left Content */}
      <div className="z-10 flex flex-col items-start gap-3 text-white">
        <h2 className="font-kinetikaUltra text-left text-xl leading-tight font-extrabold text-nowrap sm:text-lg md:text-2xl lg:text-3xl">
          JOIN THE HACKATHON!
        </h2>
        <button className="xs:px-5 xs:py-3 xs:text-base min-h-[34px] w-full max-w-xs transform rounded-full border-2 border-white bg-transparent px-2 py-1.5 text-sm font-extrabold tracking-wide whitespace-nowrap text-white shadow-lg transition-all duration-300 hover:scale-105 hover:border-white/30 hover:bg-white hover:text-black hover:shadow-xl focus:scale-105 focus:ring-4 focus:ring-white/50 focus:outline-none active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 sm:min-h-[48px] sm:px-6 sm:py-3 sm:text-lg md:min-h-[52px] md:w-3/5 md:px-4 md:py-1.5 md:text-base lg:min-h-[36px]">
          REGISTER NOW
        </button>
      </div>

      {/* Right Image */}
      <div className="relative mb-40 h-[300px] w-[500px] sm:h-[400px] sm:w-[400px] md:h-[500px] md:w-[800px]">
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
