import React from "react";
import Image from "next/image";
import XComponent from "./XComponent";

const Background = () => {
  return (
    <div>
      <XComponent />

      <div className="absolute left-1/2 -z-10 block h-[60rem] w-[100rem] -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-transparent bg-radial from-[#368BCC] to-[#020D85] blur-[200px]"></div>
      <div className="hidden">
        <Image
          src="/HeroSection/X.svg"
          alt="HackxIcon"
          width={895}
          height={1000}
          className="absolute top-1/2 left-1/2 -z-100 -translate-x-1/2 -translate-y-1/2 opacity-40 mix-blend-overlay"
        />
      </div>
    </div>
  );
};
export default Background;
