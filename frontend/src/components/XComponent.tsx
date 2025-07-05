"use client";
import Image from "next/image";
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const XComponent = () => {
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!imageRef.current) return;

    const animation = gsap.fromTo(
      imageRef.current,
      {
        opacity: 1,
        filter: "blur(0px)",
      },
      {
        opacity: 0,
        filter: "blur(10px)",
        ease: "power1.out",
        scrollTrigger: {
          trigger: document.body,
          start: "top top",
          end: "+=100", // Adjust this value to change when the animation completes
          scrub: 1, // Makes the animation smooth and tied to scroll position
          markers: false, // Set to true for debugging
        },
      },
    );

    return () => {
      animation.kill(); // Clean up animation on unmount
    };
  }, []);

  return (
    <div className="pointer-events-none fixed top-0 left-0 z-2 h-screen w-full">
      <div ref={imageRef}>
        <Image
          src="/x2.png"
          alt="Background decoration"
          width={384}
          height={384}
          className="h-full w-full object-contain"
          priority
        />
      </div>
    </div>
  );
};

export default XComponent;
