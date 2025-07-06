import React from "react";
import { Instagram, Linkedin, Target } from "lucide-react";
import Image from "next/image";
import RegisterButton from "./RegisterButton";

const Footer: React.FC = () => {
    return (
        <div className="relative z-20 min-h-screen overflow-hidden bg-black text-white">

            <div
                className="absolute inset-0 z-0"
                style={{
                    background: "radial-gradient(ellipse at bottom center, #1e40af 0%, #1e3a8a 15%, #1a1a2e 35%, #0a0a0a 60%, #000000 100%)",
                }}
            />


            <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">

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

                        <span className="w-full text-2xl md:text-4xl font-bold tracking-tighter text-white uppercase">
              THIS IS YOUR CALL
            </span>
                    </div>
                </div>


        {/* Main Headline */}
        <div className="mb-16 max-w-full text-center">
          <h1 className="leading-tighter font-kinetikaUltra text-5xl tracking-wide uppercase md:text-7xl lg:text-9xl">
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

            <div className="relative z-10 w-full">

                <div
                    className="absolute bottom-0 inset-x-0 z-0 h-[400px] transform"
                    style={{
                        background: "radial-gradient(ellipse at bottom, #00E8FF 0%, #00479A 50%, #000A1A 100%)",
                        opacity: 0.4,
                        filter: "blur(70px)",
                    }}
                />

                <Image
                    src="/ChipsSpline4.svg"
                    alt="HackxIcon"
                    width={1200}
                    height={1800}
                    className="mx-auto relative z-10"
                />

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