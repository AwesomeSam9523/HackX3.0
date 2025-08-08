import React from "react";
import Image from "next/image";
//import RegisterButton from "./RegisterButton";
const BecomeAmbassadorBanner = () => {
  return (
    <div className="relative my-20 flex hidden h-[180px] w-full max-w-[1100px] items-center overflow-hidden rounded-full bg-[#181c27] px-8 py-6 shadow-lg md:block">
      {/* Left Image */}
      <div className="absolute top-1/3 top-90 -left-90 h-[90rem] w-[90rem] -translate-x-1/12 -translate-y-1/2">
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
        <h2 className="font-kinetikaUltra text-offwhite absolute top-[0.15rem] -right-[12rem] w-full text-center text-2xl leading-tight font-extrabold tracking-wide uppercase md:text-3xl">
          BECOME THE CAMPUS <br />
          <span className="inline-block pl-28">AMBASSADOR!</span>
        </h2>
        <button className="text-offwhite absolute top-[5.5rem] right-[3.2rem] self-end rounded-full border-2 border-white px-5 py-1 text-base font-bold transition hover:bg-white hover:text-[#181c27]">
          APPLY NOW!
        </button>
      </div>
    </div>
  );
};

export default BecomeAmbassadorBanner;
