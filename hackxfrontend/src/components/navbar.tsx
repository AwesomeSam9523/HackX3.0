

import React from "react";
import Image from "next/image";
import RegisterButton from "./RegisterButton";

const Navbar: React.FC = () => {
  return (
    <div className="relative w-full h-32 z-50">
      {/* Navbar content */}
      <div className="flex items-center justify-between px-8 h-full">
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
          <RegisterButton/>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
