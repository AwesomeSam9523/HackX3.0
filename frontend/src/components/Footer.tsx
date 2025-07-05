import React from "react";
import { Instagram, Linkedin, Target } from "lucide-react";
import Image from "next/image";
import RegisterButton from "./RegisterButton";
const Footer: React.FC = () => {
  return (
    <div className="relative z-20 min-h-screen overflow-hidden bg-black text-white">
      <div
        className="absolute bottom-0 left-1/2 z-0 h-[1000px] w-[2000px] -translate-x-1/2 translate-y-1/2 transform"
        style={{
          background:
            "radial-gradient(ellipse at center, #57E3FF 0%, #020D85 100%)",
          opacity: 0.4,
          borderRadius: "50%",
          filter: "blur(40px)",
        }}
      />

      {/* Main Content Container */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">
        {/* Header Badge */}
        <div className="mb-12">
          <div className="relative px-4 py-4">
            {/* Top Left Corner */}
            <div className="absolute top-0 left-0 h-6 w-6">
              <div className="absolute top-0 left-0 h-4 w-1 bg-white"></div>
              <div className="absolute top-0 left-0 h-1 w-4 bg-white"></div>
            </div>

            {/* Top Right Corner */}
            <div className="absolute top-0 right-0 h-6 w-6">
              <div className="absolute top-0 right-0 h-4 w-1 bg-white"></div>
              <div className="absolute top-0 right-0 h-1 w-4 bg-white"></div>
            </div>

            {/* Bottom Left Corner */}
            <div className="absolute bottom-0 left-0 h-6 w-6">
              <div className="absolute bottom-0 left-0 h-4 w-1 bg-white"></div>
              <div className="absolute bottom-0 left-0 h-1 w-4 bg-white"></div>
            </div>

            {/* Bottom Right Corner */}
            <div className="absolute right-0 bottom-0 h-6 w-6">
              <div className="absolute right-0 bottom-0 h-4 w-1 bg-white"></div>
              <div className="absolute right-0 bottom-0 h-1 w-4 bg-white"></div>
            </div>

            <span className="w-full text-2xl font-bold tracking-tighter text-white uppercase md:text-4xl">
              THIS IS YOUR CALL
            </span>
          </div>
        </div>

        {/* Main Headline */}
        <div className="mb-16 max-w-full text-center">
          <h1 className="leading-tighter font-nortune text-5xl tracking-wide uppercase md:text-7xl lg:text-9xl">
            <span className="block">LET&apos;S IGNITE INNOVATION</span>
            <span className="block">IN THE WORLD OF TECHNOLOGY</span>
            <span className="block">ONE PROJECT A TIME</span>
          </h1>
        </div>

        {/* CTA Button */}
        <div className="mb-8">
          <RegisterButton />
        </div>

        {/* Copyright - Positioned in center */}
        <div className="z-10">
          <p className="text-lg font-bold tracking-tighter text-[#429df2]">
            ©2025 MUJHACKX, ALL RIGHTS RESERVED.
          </p>
        </div>
      </div>

      <div className="relative z-10 w-full">
        {/* Spline Image */}
        <Image
          src="/ChipsSpline4.svg"
          alt="HackxIcon"
          width={1200}
          height={1800}
          className="mx-auto"
        />
        {/* Social Icons - Centered on top of image */}
        <div className="absolute bottom-10 left-1/2 z-20 -translate-x-1/2 transform">
          <div className="flex w-fit items-center gap-4 rounded-full bg-black/40 px-6 py-4 backdrop-blur-sm">
            <a
              href="#"
              className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-white/10"
            >
              <Target size={24} className="text-white" />
            </a>
            <a
              href="#"
              className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-white/10"
            >
              <Instagram size={24} className="text-white" />
            </a>
            <a
              href="#"
              className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-white/10"
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
