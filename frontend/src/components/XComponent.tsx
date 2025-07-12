"use client";

import Image from "next/image";
import { useIsMobile } from "@/hooks/isMobile";

const XComponent = () => {
  const isMobile = useIsMobile();
  const src = isMobile ? "/x2Mobile.png" : "/x2.png";
  return (
    <div className="pointer-events-none absolute top-0 left-0 z-6 flex h-screen w-full items-start mix-blend-overlay lg:items-center lg:justify-center">
      <Image
        src={src}
        alt="Background decoration"
        width={384}
        height={384}
        className="h-auto w-full blur-[0px] lg:h-full lg:w-auto lg:blur-none"
        priority
      />
    </div>
  );
};

export default XComponent;
