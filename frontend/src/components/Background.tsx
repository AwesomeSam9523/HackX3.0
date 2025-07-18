import React from "react";
import Image from "next/image";
import XComponent from "./XComponent";

const Background = () => {
  return (
    <div>
      <XComponent />

      <div className="absolute left-1/2 -z-10 block h-[60rem] w-[100rem] -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-transparent bg-radial from-[#368BCC] to-[#020D85] blur-[200px]"></div>
      <div className="pointer-events-none absolute top-0 left-0 z-6 flex h-screen w-full items-start lg:items-center lg:justify-center">
        <Image
          src={"/ChipsSpline1.svg"}
          alt="Background decoration"
          width={384}
          height={384}
          className="absolute top-0 left-1/2 z-7 h-auto w-[30rem] max-w-none -translate-x-1/2 transform sm:h-full sm:w-[40rem] sm:-translate-y-2/5 lg:max-w-full"
          priority
        />
        <Image
          src={"/ChipsSpline2.svg"}
          alt="Background decoration"
          width={384}
          height={384}
          className="absolute top-[210%] right-0 z-7 h-auto w-[8rem] max-w-none -translate-y-1/2 transform sm:h-full sm:w-[40rem] sm:translate-x-[28%] lg:top-1/2 lg:max-w-full"
          priority
        />
        <Image
          src={"/ChipsSpline3.svg"}
          alt="Background decoration"
          width={384}
          height={384}
          className="absolute top-3/4 left-0 z-7 h-auto w-[8rem] max-w-none transform sm:h-full sm:w-[40rem] sm:-translate-x-[28%] lg:max-w-full"
          priority
        />
      </div>
    </div>
  );
};
export default Background;
