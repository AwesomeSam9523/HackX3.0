import React from "react";
import { Instagram, Linkedin, Target } from "lucide-react";
import Image from "next/image";
const Footer: React.FC = () => {
  return (
    <div className="min-h-screen z-20 bg-black text-white relative overflow-hidden"
    >
    <div
  className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-[2000px] h-[1000px] z-0"
  style={{
    background: 'radial-gradient(ellipse at center, #57E3FF 0%, #020D85 100%)',
    opacity: 0.4,
    borderRadius: '50%',
    filter: 'blur(40px)',
  }}
/>

      {/* Main Content Container */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 ">

        {/* Header Badge */}
        <div className="mb-12">
          <div className="relative px-4 py-4">
            {/* Top Left Corner */}
            <div className="absolute top-0 left-0 w-6 h-6">
              <div className="absolute top-0 left-0 w-6 h-1 bg-white"></div>
              <div className="absolute top-0 left-0 w-1 h-6 bg-white"></div>
            </div>

            {/* Top Right Corner */}
            <div className="absolute top-0 right-0 w-6 h-6">
              <div className="absolute top-0 right-0 w-6 h-1 bg-white"></div>
              <div className="absolute top-0 right-0 w-1 h-6 bg-white"></div>
            </div>

            {/* Bottom Left Corner */}
            <div className="absolute bottom-0 left-0 w-6 h-6">
              <div className="absolute bottom-0 left-0 w-6 h-1 bg-white"></div>
              <div className="absolute bottom-0 left-0 w-1 h-6 bg-white"></div>
            </div>

            {/* Bottom Right Corner */}
            <div className="absolute bottom-0 right-0 w-6 h-6">
              <div className="absolute bottom-0 right-0 w-6 h-1 bg-white"></div>
              <div className="absolute bottom-0 right-0 w-1 h-6 bg-white"></div>
            </div>

            <span className="text-4xl font-bold tracking-tighter uppercase text-white">
              THIS IS YOUR CALL
            </span>
          </div>
        </div>

        {/* Main Headline */}
        <div className="text-center max-w-full mb-16">
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-black uppercase leading-tighter tracking-tighter">
            <span className="block">LET&apos;S IGNITE INNOVATION</span>
            <span className="block">IN THE WORLD OF TECHNOLOGY</span>
            <span className="block">ONE PROJECT A TIME</span>
          </h1>
        </div>

        {/* CTA Button */}
        <div className="mb-8">
          <button className="bg-transparent border-2 border-white hover:bg-white/10 transition-all duration-300 px-5 py-5 rounded-full text-2xl font-semibold uppercase tracking-tight text-white">
            REGISTER NOW
          </button>
        </div>

        {/* Copyright - Positioned in center */}
        <div className="z-10">
          <p className="text-lg  text-[#429df2] font-bold tracking-tighter">
            ©2025 MUJHACKX, ALL RIGHTS RESERVED.
          </p>
        </div>
      </div>

<div className="z-10 relative w-full">
  {/* Spline Image */}
  <Image
    src="/ChipsSpline4.svg"
    alt="HackxIcon"
    width={1200}
    height={1800}
    className="mx-auto "
  />
  {/* Social Icons - Centered on top of image */}
  <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20">
  
 
    <div className="bg-black/40 backdrop-blur-sm px-6 py-4 rounded-full flex items-center gap-4 w-fit">
      <a
        href="#"
        className="w-12 h-12 flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer rounded-full"
      >
        <Target size={24} className="text-white" />
      </a>
      <a
        href="#"
        className="w-12 h-12 flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer rounded-full"
      >
        <Instagram size={24} className="text-white" />
      </a>
      <a
        href="#"
        className="w-12 h-12 flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer rounded-full"
      >
        <Linkedin size={24} className="text-white" />
      </a>
    </div>
    
  </div>

  
</div>

       
      </div>
  );
};

export default Footer;
