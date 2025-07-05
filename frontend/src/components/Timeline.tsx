import React from "react";

type TimelineItem = {
  date: string;
  time: string;
  points: string[];
};

const timelineData: TimelineItem[] = [
  {
    date: "31st Oct (Opening)",
    time: "10:00AM - 11:30AM",
    points: [
      "Inauguration & Speech by dignitaries",
      "Announcement of track of event",
      "HackX Rules & Guidelines",
    ],
  },
  {
    date: "31st Oct (Round 1)",
    time: "12:00PM - 8:30PM",
    points: ["HackX Round-1 begins", "Validation and checks for participant teams"],
  },
  {
    date: "1st Nov (Round 1 Cont'd)",
    time: "Till 4:00AM",
    points: ["Round 1 continues", "Mentors check team progress"],
  },
  {
    date: "1st Nov (Round 2)",
    time: "2:00PM - 5:00PM",
    points: ["Presentation pitch for Round 2 begins", "Final scoring of teams"],
  },
  {
    date: "1st Nov (Closing)",
    time: "6:00PM to 7:00PM",
    points: ["Result declaration", "Closing ceremony & speeches", "Award distribution"],
  },
];

const HackathonTimeline: React.FC = () => {
  return (
    <div className="relative px-4 py-16 max-w-5xl mx-auto z-10">
        <div className="flex flex-col items-center justify-center gap-5">
        <button className="font-avgardn mt-4 mt-20 rounded-full border-2 border-white bg-transparent px-10 py-3 text-lg font-bold tracking-wider text-white uppercase transition-all duration-300">
          HERE&apos;S HOW TH EVENT WILL PROGRESS
        </button>
        <div className="font-kinetikaUltra mb-8 text-center text-5xl leading-[79.9%] font-black text-white md:text-6xl">
          TIMELINE
        </div>
      </div>
      {/* Blue VerticalLine */}
      <div className="absolute  left-1/2 transform -translate-x-1/2 w-[8px] h-full bg-cyan-400 shadow-[0_0_17px_rgba(0,221,255,1)] z-10" />

      <div className="flex flex-col gap-15 relative z-10">
        {timelineData.map((item, index) => {
          const isLeft = index % 2 !== 0;

          return (
            <div key={index} className="relative w-full flex flex-col items-center">
              {/* white Dot */}
             <div className="absolute top-[80px] left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,1)] z-20"></div>

              {/* Container for date/time and the box */}
              <div
                className={`w-full md:w-1/2 ${
                  isLeft ? "md:ml-auto pl-20" : "md:mr-auto pr-20"
                }`}
              >
               {/* Date & Time ABOVE the box, aligned to box side */}
  <div className={`mb-2 ${isLeft ? "text-right" : "text-left"}`}>
    <div className="text-white text-xl font-bold">{item.date}</div>
    <div className="text-gray-600 font-bold text-xl">{item.time}</div>
  </div>

                {/* Content Box */}
                <div className="bg-white/15 bg-opacity-60 backdrop-blur-md px-8 py-10 rounded-xl shadow-lg font-avgardn text-white ">
                  <ul className="list-disc pl-5 space-y-2 text-xl">
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
  );
};

export default HackathonTimeline;
