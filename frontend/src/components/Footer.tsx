"use client";

import React, { useState } from "react";
import { Instagram, Linkedin, Target, Phone } from "lucide-react";
import Image from "next/image";
import RegisterButton from "./RegisterButton";
import { contactInfo } from "../../data/contactDetails";

const Footer: React.FC = () => {
  const [isContactExpanded, setIsContactExpanded] = useState(false);

  const toggleContact = () => {
    setIsContactExpanded(!isContactExpanded);
  };

  return (
    <div className="relative z-20 overflow-hidden bg-black text-white">
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

            <span className="w-full text-2xl font-bold tracking-tighter text-white uppercase md:text-4xl">
              THIS IS YOUR CALL
            </span>
          </div>
        </div>

        {/* Main Headline */}
        <div className="mb-16 max-w-full text-center">
          <h1 className="leading-tighter font-kinetikaUltra text-5xl tracking-wide uppercase md:text-5xl lg:text-6xl">
            <span className="block">LET&apos;S IGNITE INNOVATION</span>
            <span className="block">IN THE WORLD OF TECHNOLOGY</span>
            <span className="block">ONE PROJECT A TIME</span>
          </h1>
        </div>

        <div className="mb-8">
          <RegisterButton />
        </div>

        <div className="z-10">
          <p className="text-lg font-bold tracking-tighter text-[#429df2]">
            ©2025 MUJHACKX, ALL RIGHTS RESERVED.
          </p>
        </div>
      </div>

      <div className="relative w-full">
        <div className="absolute inset-x-0 bottom-0 z-0 h-[400px] transform" />

        <Image
          src="/HeroSection/Ellipse1.svg"
          alt="HackxIcon"
          width={1200}
          height={1800}
          className="absolute -z-20 mx-auto w-full -translate-y-1/2 rotate-x-180 transform pb-0"
        />

        {/* Contact Us Expanded Panel */}
        {isContactExpanded && (
          <div className="absolute right-10 bottom-32 z-30">
            <div className="w-96 rounded-3xl bg-black/50 p-8 backdrop-blur-sm">
              <div className="mb-6 flex items-center justify-center">
                <div className="flex items-center gap-3">
                  <Phone size={24} className="text-white" />
                  <span className="text-xl font-bold text-white uppercase">
                    CONTACT US
                  </span>
                </div>
                <div
                  onClick={toggleContact}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10"
                ></div>
              </div>

              <div className="space-y-6">
                {contactInfo.map((contact, index) => (
                  <div key={index} className="text-center">
                    <h3 className="mb-2 text-xl font-bold text-cyan-400">
                      {contact.name}
                    </h3>
                    <p className="mb-1 text-lg text-white">{contact.phone}</p>
                    <a
                      href={`mailto:${contact.email}`}
                      className="text-white underline transition-colors hover:text-cyan-400"
                    >
                      {contact.email}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <Image
          src="/ChipsSpline4.svg"
          alt="HackxIcon"
          width={1200}
          height={1800}
          className="relative z-10 mx-auto pb-0"
        />

        <div className="absolute right-0 bottom-10 left-0 z-20 flex items-center justify-between px-8">
          {/* Social Links - Centered */}
          <div className="flex flex-1 justify-center">
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

          {/* Contact Us Button - Absolute Right */}
          <div className="absolute right-10 flex flex-1 justify-end">
            <button
              onClick={toggleContact}
              className="flex items-center gap-3 rounded-full bg-black/40 px-6 py-6 backdrop-blur-sm transition-all hover:scale-110"
            >
              <Phone size={20} className="text-white" />
              <span className="font-semibold tracking-wide text-white uppercase">
                Contact Us
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
