import React from "react";

const HackathonStats = () => {
  return (
    <>
    <div className="flex flex-col items-center justify-center mt-25 mb-20  gap-10 "> <div className="relative inline-block px-6 py-3 font-avgardn  text-white">
  {/* Corner Borders */}
  <span className="absolute top-0 left-0 h-[10px] w-[10px] border-3 border-white border-b-0 border-r-0" />
  <span className="absolute top-0 right-0 h-[10px] w-[10px] border-3 border-white border-b-0 border-l-0" />
  <span className="absolute bottom-0 left-0 h-[10px] w-[10px] border-3 border-white border-t-0 border-r-0" />
  <span className="absolute bottom-0 right-0 h-[10px] w-[10px] border-3 border-white border-t-0 border-l-0" />
  
HACKATHON STATS
</div>
      <div className="  flex flex-row items-center justify-center gap-12">
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
      </div>
    </>
  );
};

export default HackathonStats;
