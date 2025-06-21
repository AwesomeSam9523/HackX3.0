import React from "react";
import { Instagram, Linkedin, Target } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-blue-900 to-blue-800 text-white relative overflow-hidden">
      {/* Main Content Container */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-12">
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
        <div className="mb-20 z-10">
          <p className="text-lg  text-[#429df2] font-bold tracking-tighter">
            ©2025 MUJHACKX, ALL RIGHTS RESERVED.
          </p>
        </div>
      </div>

      {/* 3D Spline Container - Positioned in bottom center */}
      

      {/* Social Icons Footer - Bottom center with dark background */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 ">
        <div className="bg-black/40 backdrop-blur-sm px-4 py-4 rounded-full flex  tracking-tight">
          <div className="w-12 h-12 flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer rounded-full">
            <Target size={24} className="text-white" />
          </div>
          <div className="w-12 h-12 flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer rounded-full">
            <Instagram size={24} className="text-white" />
          </div>
          <div className="w-12 h-12 flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer rounded-full">
            <Linkedin size={24} className="text-white" />
          </div>
        </div>
      </div>

      {/* Background Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-900/20 to-transparent"></div>
      <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-blue-800/50 to-transparent"></div>
    </div>
  );
};

export default Footer;
