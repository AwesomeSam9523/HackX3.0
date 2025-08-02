import React from "react";
import Image from "next/image";
//import RegisterButton from "./RegisterButton";
const BecomeAmbassadorBanner = () => {
  return (
    <div className="relative flex h-[180px] w-full max-w-[1100px] items-center overflow-hidden rounded-full bg-[#181c27] px-8 py-6 shadow-lg">
      {/* Left Image */}
      <div className="absolute top-1/8 -left-2 -mt-8 h-[220px] w-[380px] -translate-x-1/12 -translate-y-1/2 md:h-[260px] md:w-[420px]">
        <Image
          src="/HeroSection/ChipsSpline3.svg"
          alt="Glowing Shape"
          fill
          className="object-cover"
          style={{ transform: "rotate(300deg)" }}
          priority
        />
      </div>
      {/* Right Content */}
      <div className="relative z-10 ml-auto flex flex-col items-start justify-center pr-12">
        <h2 className="font-kinetikaUltra text-offwhite relative -top-5 mb-2 w-full text-center text-2xl leading-tight font-extrabold tracking-wide uppercase md:text-3xl">
          BECOME THE CAMPUS <br />
          <span className="inline-block pl-20">AMBASSADOR!</span>
        </h2>
        <button className="text-offwhite -mt-6 self-end rounded-full border-2 border-white px-5 py-1 text-base font-bold transition hover:bg-white hover:text-[#181c27]">
          APPLY NOW!
        </button>
      </div>
    </div>
  );
};

export default BecomeAmbassadorBanner;
