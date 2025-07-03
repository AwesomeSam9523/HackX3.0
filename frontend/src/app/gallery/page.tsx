"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { GalleryImage } from "../../../types/gallery";
import { galleryData } from "../../../data/galleryData";
import XComponent from "@/components/XComponent";

const Page = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sectionRef.current) {
      gsap.fromTo(
        sectionRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
        },
      );
    }
  }, []);

  const renderImageGrid = (images: GalleryImage[]) => {
    const tallImage = images.find((img) => img.size === "tall");
    const largeImage = images.find((img) => img.size === "large");
    const smallImages = images.filter((img) => img.size === "small");

    return (
      <div className="flex flex-wrap items-center justify-center gap-4 bg-transparent p-6">
        {/* Left Tall Image */}
        {tallImage && (
          <div className="h-[340px] w-[220px] overflow-hidden rounded-2xl">
            <Image
              src={tallImage.src}
              alt={tallImage.src}
              width={220}
              height={340}
              className="h-full w-full object-cover grayscale"
            />
          </div>
        )}

        {/* Middle Column */}
        <div className="flex flex-col gap-4">
          {/* Top Row */}
          <div className="flex gap-4">
            {smallImages.slice(0, 2).map((img, i) => (
              <div
                key={`top-${i}`}
                className="h-[170px] w-[170px] overflow-hidden rounded-2xl"
              >
                <Image
                  src={img.src}
                  alt={img.src}
                  width={170}
                  height={170}
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
          {/* Bottom Row */}
          <div className="flex gap-4">
            {smallImages.slice(2, 4).map((img, i) => (
              <div
                key={`bottom-${i}`}
                className="h-[170px] w-[170px] overflow-hidden rounded-2xl"
              >
                <Image
                  src={img.src}
                  alt={img.src}
                  width={170}
                  height={170}
                  className="h-full w-full object-cover grayscale"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right Large Image */}
        {largeImage && (
          <div className="h-[340px] w-[340px] overflow-hidden rounded-2xl">
            <Image
              src={largeImage.src}
              alt={largeImage.src}
              width={340}
              height={340}
              className="h-full w-full object-cover"
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-blue-500 via-black to-black text-white"
    >
      <Navbar />
      <XComponent />
      <div className="mx-auto mb-8 w-fit rounded-full border border-white/30 bg-white/10 px-20 py-3 text-center backdrop-blur-sm">
        <span className="font-sans text-lg font-bold tracking-tighter text-white">
          GLIMPSE OF OUR PREVIOUS EDITIONS
        </span>
      </div>

      <h2 className="font-nortune mb-16 text-center text-9xl font-extrabold tracking-wide">
        GALLERY
      </h2>

      <div className="space-y-16 px-4 md:px-8">
        {galleryData.map((section, idx) => (
          <div key={idx} className="relative space-y-8">
            {/* Section Title with SVG corners */}
            <div className="relative mx-auto w-fit px-8 py-2">
              {/* Top Left Corner */}
              <div className="absolute top-0 left-0">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M2 2L2 8M2 2L8 2"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="square"
                  />
                </svg>
              </div>

              {/* Top Right Corner */}
              <div className="absolute top-0 right-0">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M22 2L22 8M22 2L16 2"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="square"
                  />
                </svg>
              </div>

              {/* Bottom Left Corner */}
              <div className="absolute bottom-0 left-0">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M2 22L2 16M2 22L8 22"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="square"
                  />
                </svg>
              </div>

              {/* Bottom Right Corner */}
              <div className="absolute right-0 bottom-0">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M22 22L22 16M22 22L16 22"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="square"
                  />
                </svg>
              </div>

              <h3 className="text-center text-xl font-bold tracking-wider text-white">
                {section.title}
              </h3>
            </div>

            {/* Grid Container with Corner Decorators */}
            <div className="relative">
              {/* Top Left Corner Decorator */}
              <div className="absolute top-0 left-80 hidden h-8 w-8 border-t-4 border-l-4 border-white md:block"></div>

              {/* Top Right Corner Decorator */}
              <div className="absolute top-0 right-80 hidden h-8 w-8 border-t-4 border-r-4 border-white md:block"></div>

              {/* Bottom Left Corner Decorator */}
              <div className="absolute bottom-0 left-80 hidden h-8 w-8 border-b-4 border-l-4 border-white md:block"></div>

              {/* Bottom Right Corner Decorator */}
              <div className="absolute right-80 bottom-0 hidden h-8 w-8 border-r-4 border-b-4 border-white md:block"></div>

              {renderImageGrid(section.images)}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Page;
