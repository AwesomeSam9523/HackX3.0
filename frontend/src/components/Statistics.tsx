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
        <div className="flex justify-center">
          <div className="mx-auto mr-4 grid max-w-4xl grid-cols-2 justify-items-center gap-x-8 gap-y-8 md:mr-0 md:flex md:flex-row md:items-center md:justify-center md:gap-12">
            <div className="flex flex-col items-center justify-center gap-0">
              <div className="font-kinetikaUltra text-5xl text-white sm:text-6xl md:text-7xl">
                50+
              </div>
              <div className="font bold font-avgardn text-xl text-white">
                UNIVERSITIES
              </div>
            </div>
            <div className="flex flex-col items-center justify-center gap-0">
              <div className="font-kinetikaUltra text-5xl font-extrabold text-white sm:text-6xl md:text-7xl">
                2000+
              </div>
              <div className="font bold font-avgardn text-xl text-white">
                PARTICIPANTS
              </div>
            </div>
            <div className="flex flex-col items-center justify-center gap-0">
              <div className="font-kinetikaUltra text-5xl font-extrabold text-white sm:text-6xl md:text-7xl">
                25+
              </div>
              <div className="font bold font-avgardn text-xl text-white">
                PATENTS
              </div>
            </div>
            <div className="flex flex-col items-center justify-center gap-0">
              <div className="font-kinetikaUltra text-5xl font-extrabold text-white sm:text-6xl md:text-7xl">
                850+
              </div>
              <div className="font bold font-avgardn text-xl text-white">
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
