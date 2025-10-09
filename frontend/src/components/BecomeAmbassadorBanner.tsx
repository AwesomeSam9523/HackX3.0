import React from "react";
import Image from "next/image";
//import RegisterButton from "./RegisterButton";
const BecomeAmbassadorBanner = () => {
  return (
    <div className="relative my-[clamp(3rem,7vw,7rem)] flex h-[clamp(6.5rem,11vw,11rem)] w-[clamp(19rem,60vw,60rem)] max-w-[1100px] items-center overflow-hidden rounded-full bg-[#181c27] px-8 py-6 shadow-lg">
      {/* Left Image */}
      <div className="absolute top-1/3 top-[clamp(14rem,25vw,25rem)] -left-[clamp(24rem,30vw,30rem)] h-[clamp(55rem,110vw,110rem)] w-[clamp(55rem,90vw,90rem)] -translate-x-1/12 -translate-y-1/2 sm:-left-[clamp(10rem,30vw,30rem)]">
        <Image
          src="/HeroSection/ChipsSpline3.svg"
          alt="Glowing Shape"
          fill
          className="object-cover"
          style={{ transform: "rotate(300deg)" }}
          priority
        />
      </div>
      {/* Right Content  -top-[3.8rem] -right-[1.1rem] w-[30rem] text-[1.9rem] */}
      <div className="relative z-10 ml-auto flex flex-col items-start justify-center pr-12">
        <h2 className="font-kinetikaUltra text-offwhite absolute -top-[clamp(2.3rem,3.9vw,3.9rem)] -right-[clamp(16.8rem,8vw,8rem)] w-[30rem] text-[clamp(1.1rem,1.9vw,1.9rem)] leading-tight font-extrabold tracking-wide uppercase sm:-right-[clamp(0rem,20vw,20rem)] xl:-right-[clamp(0rem,8.3vw,8.3rem)] 2xl:-right-[clamp(0rem,6.5vw,6.5rem)]">
          BECOME THE CAMPUS <br />
          <span className="inline-block pl-[clamp(4rem,6.7vw,6.7rem)]">
            AMBASSADOR!
          </span>
        </h2>{" "}
        {/* top-[1.6rem] right-[3rem] w-[7.5rem] text-[0.7rem] */}
        <a
          href="https://forms.gle/m7rXsLXkuv4gbPHh9"
          target="_blank"
          rel="noopener noreferrer"
          className="text-offwhite absolute top-[clamp(0.85rem,1.6vw,1.6rem)] right-[clamp(0rem,3.2vw,3.2rem)] flex w-[clamp(5rem,7.5vw,7.5rem)] items-center justify-center self-end rounded-full border-2 border-white px-0 py-1 text-base text-[clamp(0.5rem,0.8vw,0.8rem)] font-bold transition hover:bg-white hover:text-[#181c27] sm:right-[clamp(0rem,2.1vw,2.1rem)] lg:w-[10rem] lg:px-3 lg:py-2 lg:text-[1rem] xl:right-[clamp(0rem,3vw,3rem)]"
        >
          APPLY NOW!
        </a>
      </div>
    </div>
  );
};

export default BecomeAmbassadorBanner;
