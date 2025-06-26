import React from "react";
import Image from "next/image";
import RegisterButton from "@/components/RegisterButton";

const Navbar: React.FC = () => {
  return (
    <div className="relative z-50 h-32 w-full">
      {/* Navbar content */}
      <div className="flex h-full justify-between px-8">
        {/* Logo section */}
        <div className="flex mt-8 items-center">
  <Image
    src="/hackxlogo.svg"
    alt="HackX 3.0 Logo"
    width={0}
    height={0}
    sizes="(max-width: 768px) 40vw, 120px"
    className="h-12 w-auto max-w-full"
    priority
  />
</div>

        <div className="relative w-full max-w-[900px] aspect-square">
 <Image
  src="/HeroSection/ChipsSpline1.svg"
  alt="HackX 3.0 Logo"
  width={0}
  height={0}
  sizes="(max-width: 768px) 80vw, 600px"
  className="w-full h-auto "
  priority
/>

</div>


        {/* Register button */}
        <div className="mt-10">
          <RegisterButton />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
