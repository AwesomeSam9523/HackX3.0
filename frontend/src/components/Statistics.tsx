import React from "react";

const HackathonStats = () => {
  return (
    <>
      <div className="flex flex-row items-center justify-center gap-12">
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="text-white text-6xl font-Roboto font-extrabold">50+</div>
          <div className="text-white font-bold">UNIVERSITIES</div>
        </div>
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="text-white text-6xl  font-extrabold font-mono">2000+</div>
          <div className="text-white font-bold">PARTICIPANTS</div>
        </div>
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="text-white text-6xl  font-extrabold font-mono">25+</div>
          <div className="text-white font-bold">PATENTS</div>
        </div>
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="text-white text-6xl  font-extrabold font-mono">850+</div>
          <div className="text-white font-bold">PROJECTS</div>
        </div>
      </div>
    </>
  );
};

export default HackathonStats;
