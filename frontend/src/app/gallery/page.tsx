"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { GalleryImage } from "../../../types/gallery";
import { galleryData } from "../../../data/galleryData";
import Background from "@/components/Background";
import LightBoxGallery from "@/components/LightBoxGallery";
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
      <>
        {/* Desktop Grid Layout */}
        <div className="hidden flex-col flex-wrap items-center justify-center gap-2 bg-transparent p-3 sm:gap-4 sm:p-6 lg:flex lg:flex-row">
          {/* Left Tall Image */}
          {tallImage && (
            <div className="h-[280px] w-[280px] overflow-hidden rounded-2xl sm:h-[320px] sm:w-[200px] lg:h-[360px] lg:w-[220px]">
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
          <div className="flex flex-col gap-2 sm:gap-4">
            {/* Top Row */}
            <div className="flex gap-2 sm:gap-4">
              {smallImages.slice(0, 2).map((img, i) => (
                <div
                  key={`top-${i}`}
                  className="h-[120px] w-[120px] overflow-hidden rounded-2xl sm:h-[150px] sm:w-[150px] lg:h-[170px] lg:w-[170px]"
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
            <div className="flex gap-2 sm:gap-4">
              {smallImages.slice(2, 4).map((img, i) => (
                <div
                  key={`bottom-${i}`}
                  className="h-[120px] w-[120px] overflow-hidden rounded-2xl sm:h-[150px] sm:w-[150px] lg:h-[170px] lg:w-[170px]"
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
            <div className="h-[280px] w-[280px] overflow-hidden rounded-2xl sm:h-[320px] sm:w-[320px] lg:h-[360px] lg:w-[340px]">
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

        {/* Mobile Grid Layout - 2 Columns */}
        <div className="mx-auto grid max-w-[400px] grid-cols-2 gap-3 p-4 lg:hidden">
          {/* First Image - First Column, Rows 1-2 */}
          {images[0] && (
            <div className="col-span-1 row-span-2 aspect-[1/2] overflow-hidden rounded-2xl">
              <Image
                src={images[0].src}
                alt={images[0].src}
                width={200}
                height={400}
                className="h-full w-full object-cover"
              />
            </div>
          )}

          {/* Second Image - Second Column, First Row */}
          {images[1] && (
            <div className="col-span-1 row-span-1 aspect-square overflow-hidden rounded-2xl">
              <Image
                src={images[1].src}
                alt={images[1].src}
                width={180}
                height={180}
                className="h-full w-full object-cover"
              />
            </div>
          )}

          {/* Third Image - Second Column, Second Row */}
          {images[2] && (
            <div className="col-span-1 row-span-1 aspect-square overflow-hidden rounded-2xl">
              <Image
                src={images[2].src}
                alt={images[2].src}
                width={180}
                height={180}
                className="h-full w-full object-cover"
              />
            </div>
          )}

          {/* Fourth Image - First Column, Third Row */}
          {images[3] && (
            <div className="col-span-1 row-span-1 aspect-square overflow-hidden rounded-2xl">
              <Image
                src={images[3].src}
                alt={images[3].src}
                width={180}
                height={180}
                className="h-full w-full object-cover"
              />
            </div>
          )}

          {/* Fifth Image - Second Column, Third Row */}
          {images[4] && (
            <div className="col-span-1 row-span-1 aspect-square overflow-hidden rounded-2xl">
              <Image
                src={images[4].src}
                alt={images[4].src}
                width={180}
                height={180}
                className="h-full w-full object-cover"
              />
            </div>
          )}

          {/* Sixth Image - Both Columns, Fourth and Fifth Rows */}
          {images[5] && (
            <div className="col-span-2 row-span-2 aspect-[1/1] overflow-hidden rounded-2xl">
              <Image
                src={images[5].src}
                alt={images[5].src}
                width={400}
                height={400}
                className="h-full w-full object-cover"
              />
            </div>
          )}
        </div>
      </>
    );
  };

  return (
    <div
      ref={sectionRef}
      className="text-offwhite relative min-h-screen w-full overflow-hidden bg-[rgba(0,0,0,1)]"
    >
      <Background />
      <Navbar />
      <XComponent />
      <LightBoxGallery />
      <div className="flex flex-col items-center justify-center gap-5">
        <button className="font-avgardn text-offwhite mt-20 rounded-full border-2 border-white bg-transparent px-4 py-3 text-base font-bold tracking-wider uppercase transition-all duration-300 lg:px-10 lg:text-lg">
          GLIMPSE OF OUR PREVIOUS EDITIONS
        </button>
        <div className="font-kinetikaUltra text-offwhite mb-8 text-center text-5xl leading-[79.9%] font-black md:text-6xl">
          GALLERY
        </div>
      </div>

      <div className="flex flex-col items-center justify-start space-y-8 px-2 sm:space-y-16 sm:px-4 md:px-8">
        {galleryData.map((section, idx) => (
          <div key={idx} className="relative space-y-4 sm:space-y-8">
            {/* Section Title with SVG corners */}
            <div className="relative mx-auto w-fit px-6 py-2 sm:px-8">
              {/* Top Left Corner */}
              <div className="absolute top-0 left-0">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="sm:h-6 sm:w-6"
                >
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
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="sm:h-6 sm:w-6"
                >
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
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="sm:h-6 sm:w-6"
                >
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
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="sm:h-6 sm:w-6"
                >
                  <path
                    d="M22 22L22 16M22 22L16 22"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="square"
                  />
                </svg>
              </div>

              <h3 className="text-offwhite text-center text-lg font-bold tracking-wider sm:text-xl">
                {section.title}
              </h3>
            </div>

            {/* Grid Container with Corner Decorators */}
            <div className="relative">
              {/* Corner Decorators - Hidden on mobile */}
              {/* Top Left Corner Decorator */}
              <div className="absolute top-0 left-20 hidden h-6 w-6 border-t-4 border-l-4 border-white sm:left-40 sm:h-8 sm:w-8 lg:left-0 lg:block"></div>

              {/* Top Right Corner Decorator */}
              <div className="absolute top-0 right-20 hidden h-6 w-6 border-t-4 border-r-4 border-white sm:right-40 sm:h-8 sm:w-8 lg:right-0 lg:block"></div>

              {/* Bottom Left Corner Decorator */}
              <div className="absolute bottom-0 left-20 hidden h-6 w-6 border-b-4 border-l-4 border-white sm:left-40 sm:h-8 sm:w-8 lg:left-0 lg:block"></div>

              {/* Bottom Right Corner Decorator */}
              <div className="absolute right-20 bottom-0 hidden h-6 w-6 border-r-4 border-b-4 border-white sm:right-40 sm:h-8 sm:w-8 lg:right-0 lg:block"></div>

              {renderImageGrid(section.images)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;
