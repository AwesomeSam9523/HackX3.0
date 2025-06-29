import React from "react";
import { cardData, Card, CardProps } from "./WhyUsCard";

const WhyUsSection = () => {
  return (
    <div className="relative z-10 ">
      <div className="flex flex-col items-center  justify-center gap-5">
        <button className="font-avgardn mt-4 rounded-full border-2 border-white bg-transparent px-10 py-3 text-lg tracking-tight text-white uppercase transition-all duration-300 mt-20 ">
          WHY SHOULD YOU PARTICIPATE IN
        </button>
        <div className="mb-8 text-center font-kinetikaUltra text-5xl leading-[79.9%] font-black text-white md:text-6xl">
          MUJ HACKX 3.0?
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 justify-items-center py-10 px-85 ">
  {cardData.map((card: CardProps, index: number) => (
    <Card
      key={index}
      icon={card.icon}
      title={card.title}
      description={card.description}
    />
  ))}
</div>

    </div>
  );
};

export default WhyUsSection;
