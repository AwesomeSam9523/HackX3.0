import React from "react";
import TimelineBlueLine from "./TimelineBlueLine";
import LightBoxOthers from "./LightBoxOthers";

type TimelineItem = {
  date: string;
  time: string;
  points: string[];
};

const timelineData: TimelineItem[] = [
  {
    date: "29TH SEP - 15TH OCT (ROUND 1)",
    time: "",
    points: ["Online shortlisting of Participants"],
  },
  {
    date: "30TH OCT (OPENING)",
    time: "10:00AM",
    points: [
      "Inauguration & Speech by dignitaries",
      "Announcement of track of event",
      "HackX Rules & Guidelines",
    ],
  },
  {
    date: "30TH OCT (ROUND 2)",
    time: "12:00PM",
    points: [
      "HackX Round-1 begins",
      "Validation and checks for participant teams",
    ],
  },
  {
    date: "31ST OCT (ROUND 1 CONT'D)",
    time: "Till 9:00AM",
    points: ["Round 1 continues", "Mentors check team progress"],
  },
  {
    date: "31ST OCT (ROUND 2)",
    time: "11:00AM - 2:00PM",
    points: ["Presentation pitch for Round 2 begins", "Final scoring of teams"],
  },
  {
    date: "31ST OCT (CLOSING)",
    time: "4:00PM to 6:00PM",
    points: [
      "Result declaration",
      "Closing ceremony & speeches",
      "Award distribution",
    ],
  },
];

const HackathonTimeline: React.FC = () => {
  return (
    <div className="timelineBox">
      {/*light box for mobile view*/}
      <LightBoxOthers name="timeline" id={0} />
      {/*timeline*/}
      <div className="relative z-10 mx-auto max-w-5xl px-4 py-16">
        <div className="mb-10 flex flex-col items-center justify-center gap-5">
          <button className="font-avgardn text-offwhite rounded-full border-2 border-white bg-transparent px-10 py-3 text-lg font-bold tracking-wider uppercase transition-all duration-300 lg:mt-20">
            HERE&apos;S HOW THE EVENT WILL PROGRESS
          </button>
          <div className="font-kinetikaUltra text-offwhite mb-8 text-center text-5xl leading-[79.9%] font-black md:text-8xl">
            TIMELINE
          </div>
        </div>
        {/* Blue VerticalLine */}
        <TimelineBlueLine />

        <div className="relative z-10 flex flex-col gap-15">
          {timelineData.map((item, index) => {
            const isLeft = index % 2 !== 0;

            return (
              <div
                key={index}
                className="relative flex w-full flex-col items-center"
              >
                {/* Horizontal line at the top of the box  */}
                <div
                  className={`absolute ${index === 0 ? "top-[42px]" : "top-[68px]"} z-10 hidden lg:block ${
                    isLeft ? "right-15" : "left-15"
                  } w-[calc(42%-40px)]`}
                  style={{
                    height: "4px",

                    background: isLeft
                      ? "linear-gradient(to right, rgba(255,255,255,1), rgba(255,255,255,0.3))"
                      : "linear-gradient(to left, rgba(255,255,255,1), rgba(255,255,255,0.3))",
                    boxShadow:
                      "0 0 4px rgba(255,255,255,0.2), 0 0 8px rgba(255,255,255,0.4), 0 0 12px rgba(255,255,255,0.6)",
                    maskImage: isLeft
                      ? "linear-gradient(to right, black 0%, transparent 100%)"
                      : "linear-gradient(to left, black 0%, transparent 100%)",
                    WebkitMaskImage: isLeft
                      ? "linear-gradient(to right, black 0%, transparent 100%)"
                      : "linear-gradient(to left, black 0%, transparent 100%)",
                  }}
                ></div>

                {/* Diagonal connector to the dot */}
                <div
                  className={`absolute ${index === 0 ? "top-[42px]" : "top-[68px]"} z-10 hidden h-[4px] w-[56px] bg-white md:block ${
                    isLeft
                      ? "left-[500px] origin-right -rotate-[25deg]"
                      : "right-[500px] origin-left rotate-[25deg]"
                  }`}
                />
                {/* white Dot */}
                <div
                  className={`absolute ${index === 0 ? "top-[54px]" : "top-[80px]"} left-1/2 z-20 hidden h-6 w-6 -translate-x-1/2 transform rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,1)] md:block`}
                ></div>
                {/* Dot inside box, half inside-half outside (mobile only) */}
                <div className="absolute top-0 left-1/2 z-20 h-6 w-6 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,1)] md:hidden"></div>
                {/* Container for date/time and the box */}
                <div
                  className={`w-full md:w-1/2 ${
                    isLeft
                      ? "pr-0 pl-0 md:ml-auto md:pl-20"
                      : "pr-0 pl-0 md:mr-auto md:pr-20"
                  }`}
                >
                  {/* Date & Time ABOVE the box, aligned to box side ( For desktop )  */}
                  <div
                    className={`mb-2 ${isLeft ? "text-right" : "text-left"} hidden md:block`}
                  >
                    <div className="text-offwhite text-2xl font-bold">
                      {item.date}
                    </div>
                    <div className="text-2xl font-bold text-gray-600">
                      {item.time}
                    </div>
                  </div>

                  {/* Content Box */}
                  <div className="bg-opacity-60 font-avgardn text-offwhite rounded-xl bg-white/15 px-8 py-10 shadow-lg backdrop-blur-md">
                    {/* Mobile date/time */}
                    <div className="mb-4 block text-center md:hidden">
                      <div className="text-md text-offwhite font-bold">
                        {item.date}
                      </div>
                      <div className="text-md text-offwhite">{item.time}</div>
                    </div>

                    <ul className="list-disc space-y-2 pl-5 text-xl">
                      {item.points.map((point, i) => (
                        <li key={i}>{point}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HackathonTimeline;
