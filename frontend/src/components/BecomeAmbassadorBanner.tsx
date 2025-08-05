import React from "react";
import Image from "next/image";
//import RegisterButton from "./RegisterButton";
const BecomeAmbassadorBanner = () => {
  return (
    <div className="relative my-20 flex h-[150px] w-full max-w-[1100px] items-center overflow-hidden rounded-full bg-[#181c27] px-8 py-6 shadow-lg">
      {/* Left Image */}
      <div className="absolute top-10 -left-0 -mt-8 h-[50rem] w-[50rem] -translate-x-80 -translate-y-50 md:h-[75rem] md:w-[75rem] md:-translate-x-100 md:-translate-y-80">
        <Image
          src="/HeroSection/ChipsSpline3.svg"
          alt="Glowing Shape"
          fill
          className="object-cover"
          style={{ transform: "rotate(270deg)" }}
          priority
        />
      </div>
      {/* Right Content */}
      <div className="relative z-10 ml-auto flex flex-col items-start justify-center pr-12">
        <h2 className="font-kinetikaUltra text-offwhite relative -top-3 mb-2 w-full text-center text-2xl leading-tight font-extrabold tracking-wide uppercase md:text-3xl">
          BECOME THE CAMPUS <br />
          <span className="inline-block pl-20">AMBASSADOR!</span>
        </h2>
        <button className="text-offwhite -mt-3 self-end rounded-full border-2 border-white px-5 py-1 text-base text-[0.7rem] font-bold transition hover:bg-white hover:text-[#181c27]">
          APPLY NOW!
        </button>
      </div>
    </div>
  );
};

export default BecomeAmbassadorBanner;
