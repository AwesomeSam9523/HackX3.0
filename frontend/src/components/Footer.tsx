"use client";

import React, { useState } from "react";
import { Instagram, Phone, Target } from "lucide-react";
import Image from "next/image";
import RegisterButton from "./RegisterButton";
import { contactInfo } from "../../data/contactDetails";
import { useIsMobile } from "@/hooks/isMobile";

import ChipsSpline from "../../public/ChipsSpline4.svg";
import ChipsSplineMobile from "../../public/ChipsSpline5.svg";

const Footer: React.FC = () => {
  const [isContactExpanded, setIsContactExpanded] = useState(false);
  const isMobile = useIsMobile();

  const toggleContact = () => {
    setIsContactExpanded(!isContactExpanded);
  };

  return (
    <div className="text-offwhite relative z-20 overflow-hidden bg-black">
      <div className="absolute inset-0 z-0" />

      <div className="relative z-10 flex flex-col items-center justify-end px-6 text-center">
        <div className="mb-12">
          <div className="relative px-4 py-4">
            <div className="absolute top-0 left-0 h-6 w-6">
              <div className="absolute top-0 left-0 h-4 w-1 bg-white"></div>
              <div className="absolute top-0 left-0 h-1 w-4 bg-white"></div>
            </div>

            <div className="absolute top-0 right-0 h-6 w-6">
              <div className="absolute top-0 right-0 h-4 w-1 bg-white"></div>
              <div className="absolute top-0 right-0 h-1 w-4 bg-white"></div>
            </div>

            <div className="absolute bottom-0 left-0 h-6 w-6">
              <div className="absolute bottom-0 left-0 h-4 w-1 bg-white"></div>
              <div className="absolute bottom-0 left-0 h-1 w-4 bg-white"></div>
            </div>

            <div className="absolute right-0 bottom-0 h-6 w-6">
              <div className="absolute right-0 bottom-0 h-4 w-1 bg-white"></div>
              <div className="absolute right-0 bottom-0 h-1 w-4 bg-white"></div>
            </div>

            <span className="text-offwhite w-full text-2xl font-bold tracking-tighter uppercase md:text-4xl">
              THIS IS YOUR CALL
            </span>
          </div>
        </div>

        {/* Main Headline */}
        <div className="mb-16 max-w-full text-center">
          <h1 className="leading-tighter font-kinetikaUltra text-offwhite text-4xl leading-8 font-extrabold uppercase md:text-5xl lg:text-6xl lg:leading-12">
            <span className="block">LET&apos;S IGNITE INNOVATION</span>
            <span className="block">IN THE WORLD OF TECHNOLOGY</span>
            <span className="block">ONE PROJECT A TIME.</span>
          </h1>
        </div>

        <div className="mb-8 w-3/4">
          <RegisterButton isFooterButton={true} />
        </div>

        <div className="z-10">
          <p className="text-base font-bold tracking-tighter text-[#429df2] lg:text-lg">
            ©2025 MUJHACKX, ALL RIGHTS RESERVED.
          </p>
        </div>
      </div>

      <div className="relative w-full">
        <div className="absolute inset-x-0 bottom-0 z-0 h-[400px] transform" />

        {/* footer gradient */}
        <div
          className="absolute left-1/2 block h-[60rem] w-[100rem] -translate-x-1/2 transform rounded-full"
          style={{
            background: "radial-gradient(circle, #368BCC, #020D85)",
            backdropFilter: "blur(200px)",
            WebkitBackdropFilter: "blur(75px)",
            filter: "blur(200px)",
            WebkitFilter: "blur(75px)",
          }}
        ></div>

        {/* Contact Us Expanded Panel */}
        {isContactExpanded && (
          <div className="absolute right-10 bottom-32 z-30">
            <div className="bg-footer w-72 rounded-3xl py-8 backdrop-blur-sm">
              <div className="mb-6 flex items-center justify-center">
                <div className="flex items-center gap-3">
                  <Phone size={24} className="text-offwhite" />
                  <span className="text-offwhite text-xl font-bold uppercase">
                    CONTACT US
                  </span>
                </div>
              </div>

              <div className="space-y-6">
                {contactInfo.map((contact, index) => (
                  <div key={index} className="text-center">
                    <h3 className="mb-2 text-xl font-bold text-cyan-400">
                      {contact.name}
                    </h3>
                    <p className="text-offwhite mb-1 text-lg">
                      {contact.phone}
                    </p>
                    <a
                      href={`mailto:${contact.email}`}
                      className="text-offwhite underline transition-colors hover:text-cyan-400"
                    >
                      {contact.email}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="z-20 mt-12 flex items-center justify-between px-8 lg:absolute lg:right-0 lg:bottom-10 lg:left-0">
          {/* Social Links - Centered */}
          <div className="flex flex-1 justify-center">
            <div className="bg-footer flex w-fit items-center rounded-full p-2 backdrop-blur-sm lg:gap-4 lg:px-6 lg:py-4">
              <a
                href="https://jaipur.manipal.edu/"
                className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-white/10"
              >
                <Target size={24} className="text-offwhite" />
              </a>
              <a
                href="https://www.instagram.com/muj.hackx/"
                className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-white/10"
              >
                <Instagram size={24} className="text-offwhite" />
              </a>
              <a
                href="https://www.linkedin.com/company/mujhackx/"
                className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-white/10"
              >
                <Image
                  src={"/linkedin.svg"}
                  alt={"linkedinicon"}
                  width={28}
                  height={28}
                />
              </a>
            </div>
          </div>

          {/* Contact Us Button - Absolute Right */}
          <div className="absolute right-10 hidden flex-1 justify-end lg:flex">
            <button
              onClick={toggleContact}
              className="bg-footer flex items-center gap-3 rounded-full px-6 py-6 backdrop-blur-sm transition-all hover:scale-110"
            >
              <Phone size={20} className="text-offwhite" />
              <span className="text-offwhite font-semibold tracking-wide uppercase">
                Contact Us
              </span>
            </button>
          </div>
        </div>

        <Image
          src={isMobile ? ChipsSplineMobile : ChipsSpline}
          alt="HackxIcon"
          width={1200}
          height={1800}
          className="relative z-10 w-full pb-0 lg:mx-auto"
        />
      </div>
    </div>
  );
};

export default Footer;
