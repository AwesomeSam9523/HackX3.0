import React from "react";

const HackathonStats = () => {
  return (
    <>
      <div className="mt-25 mb-20 flex flex-col items-center justify-center gap-10">
        {" "}
        <div className="font-avgardn relative inline-block px-6 py-3 font-bold tracking-wider text-white">
          {/* Corner Borders */}
          <span className="absolute top-0 left-0 h-[10px] w-[10px] border-3 border-r-0 border-b-0 border-white" />
          <span className="absolute top-0 right-0 h-[10px] w-[10px] border-3 border-b-0 border-l-0 border-white" />
          <span className="absolute bottom-0 left-0 h-[10px] w-[10px] border-3 border-t-0 border-r-0 border-white" />
          <span className="absolute right-0 bottom-0 h-[10px] w-[10px] border-3 border-t-0 border-l-0 border-white" />
          HACKATHON STATS
        </div>
        <div className="flex flex-row items-center justify-center gap-12">
          <div className="flex flex-col items-center justify-center gap-0">
            <div className="font-kinetikaUltra text-6xl text-white">50+</div>
            <div className="font bold font-avgardn text-xl text-white">
              UNIVERSITIES
            </div>
          </div>
          <div className="flex flex-col items-center justify-center gap-0">
            <div className="font-kinetikaUltra text-6xl font-extrabold text-white">
              2000+
            </div>
            <div className="font bold font-avgardn text-xl text-white">
              PARTICIPANTS
            </div>
          </div>
          <div className="flex flex-col items-center justify-center gap-0">
            <div className="font-kinetikaUltra text-6xl font-extrabold text-white">
              25+
            </div>
            <div className="font bold font-avgardn text-xl text-white">
              PATENTS
            </div>
          </div>
          <div className="flex flex-col items-center justify-center gap-0">
            <div className="font-kinetikaUltra text-6xl font-extrabold text-white">
              850+
            </div>
            <div className="font bold font-avgardn text-xl text-white">
              PROJECTS
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HackathonStats;
