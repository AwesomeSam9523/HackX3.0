 import React from "react";
 import Image from "next/image";
const Background =()=>{
return (
    <div>
<div className="fixed inset-0 w-full h-full pointer-events-none z-10">
        <Image
          src="/x2.png" 
          alt="Background decoration"
          width={384}
          height={384}
          className="w-full h-full object-contain opacity-50"
        />
      </div>

      <div>
        <Image
          src="/HeroSection/Ellipse1.svg"
          alt="Gradient"
          width={1800}
          height={850}
          className="absolute z-5"
        />
      </div>
      <div className="">
        <Image
          src="/HeroSection/X.svg"
          alt="HackxIcon"
          width={895}
          height={1000}
          className="absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2 opacity-40 mix-blend-overlay"
        />
      </div>
      </div>
);
      };
      export default Background;