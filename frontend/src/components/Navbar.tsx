import React from "react";
import Image from "next/image";
import RegisterButton from "@/components/RegisterButton";

const Navbar: React.FC = () => {
  return (
    <div className="relative z-50 h-32 w-full">
      {/* Navbar content */}
      <div className="flex h-full items-center justify-between px-8">
        {/* Logo section */}
        <div className="flex items-center">
          <Image
            src="hackxlogo.svg"
            alt="HackX 3.0 Logo"
            width={120}
            height={48}
            className="h-12 w-auto"
            priority
          />
        </div>

        {/* Register button */}
        <div>
          <RegisterButton />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
