import React from "react";

const HackathonStats = () => {
  return (
    <>
      <div className="flex flex-row items-center justify-center gap-12">
        <div className="flex flex-col items-center justify-center gap-0">
          <div className="text-white text-6xl font-kinetikaUltra ">50+</div>
          <div className="text-white text-xl font bold  font-avgardn ">UNIVERSITIES</div>
        </div>
        <div className="flex flex-col items-center justify-center gap-0">
          <div className="text-white text-6xl  font-extrabold font-kinetikaUltra ">2000+</div>
          <div className="text-white text-xl font bold  font-avgardn ">PARTICIPANTS</div>
        </div>
        <div className="flex flex-col items-center justify-center gap-0">
          <div className="text-white text-6xl  font-extrabold font-kinetikaUltra ">25+</div>
          <div className="text-white text-xl font bold font-avgardn ">PATENTS</div>
        </div>
        <div className="flex flex-col items-center justify-center gap-0">
          <div className="text-white text-6xl  font-extrabold font-kinetikaUltra ">850+</div>
          <div className="text-white text-xl font bold font-avgardn ">PROJECTS</div>
        </div>
      </div>
    </>
  );
};

export default HackathonStats;
