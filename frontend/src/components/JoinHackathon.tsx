import React from "react";
import Image from "next/image";
import RegisterButton from "./RegisterButton";
const JoinHackathonBanner = () => {
  return (
    
     <div className="relative flex w-full max-w-[950px] h-[180px] items-center justify-between overflow-hidden rounded-full bg-[#0a0f2b] px-15 py-10 md:py-8">
  {/* Left Content */}
  <div className="flex flex-col gap-3 text-white">
    <h2 className="text-lg sm:text-xl md:text-2xl font-extrabold leading-tight">
      JOIN THE <br className="sm:hidden" /> HACKATHON
    </h2>
   <RegisterButton/>
  </div>

  {/* Right Image */}
<div className="relative mb-40 w-[500px] h-[300px] sm:w-[400px] sm:h-[400px] md:w-[800px] md:h-[500px]">
  <Image
    src="/HeroSection/ChipsSpline3.svg"
    alt="Glowing Shape"
    fill
    className="object-cover  "
    style={{ transform: "rotate(240deg)" }}
    priority
  />
</div>


</div>

  );
};

export default JoinHackathonBanner;
