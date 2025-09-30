"use client";
import React, { useEffect, useRef, useState } from "react";
import LightBoxOthers from "./LightBoxOthers";

interface CounterProps {
  end: number;
  duration?: number;
  suffix?: string;
  className?: string;
}

const Counter: React.FC<CounterProps> = ({
  end,
  duration = 4000,
  suffix = "",
  className = "",
}) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const counterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 },
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    const startTime = Date.now();
    const startValue = 0;

    const updateCount = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = Math.floor(
        startValue + (end - startValue) * easeOutQuart,
      );

      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        setCount(end);
      }
    };

    const animationId = requestAnimationFrame(updateCount);
    return () => cancelAnimationFrame(animationId);
  }, [isVisible, end, duration]);

  return (
    <div ref={counterRef} className={className}>
      {count}
      {suffix}
    </div>
  );
};

const HackathonStats: React.FC = () => {
  return (
    <>
      <div className="mt-20 mb-20 flex flex-col items-center justify-center gap-10 lg:mt-25">
        <LightBoxOthers name="about" id={2} />

        <div className="font-avgardn text-offwhite relative inline-block px-6 py-3 font-bold tracking-wider">
          {/* Corner Borders */}
          <span className="absolute top-0 left-0 h-[10px] w-[10px] border-3 border-r-0 border-b-0 border-white" />
          <span className="absolute top-0 right-0 h-[10px] w-[10px] border-3 border-b-0 border-l-0 border-white" />
          <span className="absolute bottom-0 left-0 h-[10px] w-[10px] border-3 border-t-0 border-r-0 border-white" />
          <span className="absolute right-0 bottom-0 h-[10px] w-[10px] border-3 border-t-0 border-l-0 border-white" />
          HACKATHON STATS
        </div>

        <div className="flex justify-center">
          <div className="mx-auto mr-4 grid max-w-4xl grid-cols-2 justify-items-center gap-x-8 gap-y-8 md:mr-0 md:flex md:flex-row md:items-center md:justify-center md:gap-12">
            <div className="flex flex-col items-center justify-center gap-0">
              <Counter
                end={50}
                suffix="+"
                duration={2500}
                className="font-kinetikaUltra text-offwhite text-5xl sm:text-6xl md:text-7xl"
              />
              <div className="font bold font-avgardn text-offwhite text-xl">
                UNIVERSITIES
              </div>
            </div>

            <div className="flex flex-col items-center justify-center gap-0">
              <Counter
                end={2000}
                suffix="+"
                duration={3000}
                className="font-kinetikaUltra text-offwhite text-5xl font-extrabold sm:text-6xl md:text-7xl"
              />
              <div className="font bold font-avgardn text-offwhite text-xl">
                PARTICIPANTS
              </div>
            </div>

            <div className="flex flex-col items-center justify-center gap-0">
              <Counter
                end={25}
                suffix="+"
                duration={2000}
                className="font-kinetikaUltra text-offwhite text-5xl font-extrabold sm:text-6xl md:text-7xl"
              />
              <div className="font bold font-avgardn text-offwhite text-xl">
                PATENTS
              </div>
            </div>

            <div className="flex flex-col items-center justify-center gap-0">
              <Counter
                end={850}
                suffix="+"
                duration={2800}
                className="font-kinetikaUltra text-offwhite text-5xl font-extrabold sm:text-6xl md:text-7xl"
              />
              <div className="font bold font-avgardn text-offwhite text-xl">
                PROJECTS
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HackathonStats;
