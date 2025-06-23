//Made navbar in hero.tsx 
"use client"
import React from 'react';
import Image from 'next/image';

const Navbar: React.FC = () => {
  return (
    <div className="relative w-full h-32">
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
          <button className="text-xl tracking-tighter bg-white/10 backdrop-blur-sm text-white font-semibold px-8 py-3 rounded-full border border-white/20 hover:bg-white/20 hover:border-white/30 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
            REGISTER NOW
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;