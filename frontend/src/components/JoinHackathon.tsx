import React from "react";
import Image from "next/image";
//import RegisterButton from "./RegisterButton";
const JoinHackathonBanner = () => {
  return (
    <div className="relative flex h-[180px] w-full max-w-[950px] items-center justify-between overflow-hidden rounded-full bg-[#0a0f2b] px-18 py-12 md:py-8">
      {/* Left Content */}
      <div className="flex flex-col gap-3 text-white">
        <h2 className="font-kinetikaUltra text-left text-xl leading-tight font-extrabold sm:text-lg md:text-2xl">
          JOIN THE <br className="sm:hidden" /> HACKATHON
        </h2>
        <button className="rounded-full border-2 border-white p-2 text-sm">
          REGISTER NOW
        </button>
      </div>

      {/* Right Image */}
      <div className="relative mb-40 h-[300px] w-[500px] sm:h-[400px] sm:w-[400px] md:h-[500px] md:w-[800px]">
        <Image
          src="/HeroSection/ChipsSpline3.svg"
          alt="Glowing Shape"
          fill
          className="object-cover"
          style={{ transform: "rotate(240deg)" }}
          priority
        />
      </div>
    </div>
  );
};

export default JoinHackathonBanner;
