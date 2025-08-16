import React from "react";
import { cardData, Card, CardProps } from "./WhyUsCard";

const WhyUsSection = () => {
  return (
    <div className="relative z-10">
      <div className="flex flex-col items-center justify-center gap-5">
        <button className="font-avgardn text-offwhite mt-4 mt-20 rounded-full border-2 border-white bg-transparent px-10 py-3 text-lg font-bold tracking-wider uppercase transition-all duration-300">
          WHY SHOULD YOU PARTICIPATE IN
        </button>
        <div className="font-kinetikaUltra text-offwhite mb-8 px-4 text-center text-5xl leading-[79.9%] font-black md:px-0 md:text-6xl">
          MUJ HACKX 3.0?
        </div>
      </div>

      <div className="relative mx-auto grid max-w-[1100px] grid-cols-1 justify-items-center gap-4 px-4 py-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Corner Borders */}
        <span className="absolute -top-1 left-4 h-[15px] w-[15px] border-3 border-r-0 border-b-0 border-white sm:-top-2 sm:left-2" />
        <span className="absolute -top-1 right-4 h-[15px] w-[15px] border-3 border-b-0 border-l-0 border-white sm:-top-2 sm:right-2" />
        <span className="absolute -bottom-1 left-4 h-[15px] w-[15px] border-3 border-t-0 border-r-0 border-white sm:-bottom-2 sm:left-2" />
        <span className="absolute right-4 -bottom-1 h-[15px] w-[15px] border-3 border-t-0 border-l-0 border-white sm:right-2 sm:-bottom-2" />

        {cardData.map((card: CardProps, index: number) => (
          <div className="flex w-full justify-center" key={index}>
            <Card
              icon={card.icon}
              title={card.title}
              description={card.description}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default WhyUsSection;
