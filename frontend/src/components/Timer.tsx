"use client";
import React, { useEffect, useState } from "react";

const TARGET_DATE = new Date("2025-10-30T09:00:00");

const events = [
  { month: "SEP", day: "30", label: "REGISTRATIONS\nBEGIN" },
  { month: "OCT", day: "12", label: "REGISTRATIONS\nEND" },
  { month: "OCT", day: "30", label: "OPENING CEREMONY\n& HACKATHON BEGINS" },
  { month: "OCT", day: "31", label: "HACKATHON ENDS\n& CLOSING CEREMONY" },
];

function getTimeLeft(targetDate: Date) {
  const now = new Date();
  const diff = targetDate.getTime() - now.getTime();
  const totalSeconds = Math.max(0, Math.floor(diff / 1000));
  const days = Math.floor(totalSeconds / (3600 * 24));
  const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { days, hours, minutes, seconds };
}

const Timer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    setTimeLeft(getTimeLeft(TARGET_DATE));

    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft(TARGET_DATE));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-offwhite mx-auto my-8 max-w-[1100px] px-2 font-['Kinetika',sans-serif] sm:px-4">
      <div className="mb-6 flex w-full justify-center sm:mb-11">
        <div className="relative mb-2 inline-block px-6 py-4 text-center font-['AvantGarde-Bk-BT',sans-serif] text-[18px] leading-[0.99] font-bold tracking-[-0.02em] uppercase sm:text-[20.34px]">
          {/* The transform: translate values below have been changed from 6px to 12px */}
          {/* Corner Borders */}
          <span className="absolute top-0 left-0 h-[10px] w-[10px] border-3 border-r-0 border-b-0 border-white" />
          <span className="absolute top-0 right-0 h-[10px] w-[10px] border-3 border-b-0 border-l-0 border-white" />
          <span className="absolute bottom-0 left-0 h-[10px] w-[10px] border-3 border-t-0 border-r-0 border-white" />
          <span className="absolute right-0 bottom-0 h-[10px] w-[10px] border-3 border-t-0 border-l-0 border-white" />
          TIME LEFT TO BEGIN
        </div>
      </div>
      <div className="label mx-auto mb-8 h-[40px] w-full max-w-[350px] sm:mb-10 sm:h-[51px] sm:max-w-[594px]">
        <div
          className="text-wrapper font-kinetikaUltra relative top-0 left-0 text-center text-[2.2rem] leading-[2.2rem] font-black tracking-[0] whitespace-nowrap text-[#fffef0] sm:text-[63.5px] sm:leading-[50.8px]"
          suppressHydrationWarning={true}
        >
          {timeLeft.days +
            timeLeft.hours +
            timeLeft.minutes +
            timeLeft.seconds >
          0
            ? `${timeLeft.days}D ${String(timeLeft.hours).padStart(2, "0")}H ${String(timeLeft.minutes).padStart(2, "0")}M ${String(timeLeft.seconds).padStart(2, "0")}S`
            : "Let the innovation begin!"}
        </div>
      </div>
      <div className="scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-300 sm:scrollbar-none overflow-x-none mx-auto grid max-w-full grid-cols-2 grid-rows-2 items-center justify-center gap-4 sm:max-w-[900px] sm:flex-row sm:items-end sm:justify-between sm:gap-6 sm:overflow-x-visible lg:grid-cols-4 lg:grid-rows-1">
        {events.map((event, idx) => (
          <div
            key={idx}
            className="mb-4 flex min-w-[160px] flex-1 flex-col items-center justify-start text-center sm:mb-0 sm:min-w-0"
          >
            <div className="frame relative mb-2 h-[70px] w-[70px] overflow-hidden rounded-[15px] border-[2.2px] border-solid border-[#fffef0] sm:h-[94px] sm:w-[94px] sm:rounded-[19.86px] sm:border-[3.31px]">
              <div className="overlap-group absolute top-0 left-0 h-[28px] w-full bg-[#fffef0] sm:h-[38px]">
                <div className="text-wrapper absolute top-[4px] left-1/2 -translate-x-1/2 text-[16px] font-medium whitespace-nowrap text-[#1e2332] sm:text-[22.2px]">
                  {event.month}
                </div>
              </div>
              <div className="div absolute top-[30px] left-1/2 -translate-x-1/2 text-center text-[20px] font-medium whitespace-nowrap text-[#fffef0] sm:top-[41px] sm:text-[27.7px]">
                {event.day}
              </div>
            </div>
            <div className="text-shadow text-offwhite relative isolate z-10 mt-2 flex max-w-[180px] flex-col items-center justify-start text-[0.95rem] leading-[1.1] font-semibold tracking-[-1px] uppercase sm:max-w-[240px] sm:text-[1.1rem]">
              {event.label.split("\n").map((line, i) => {
                if (
                  ["BEGIN", "END", "& HACKATHON BEGINS", "& CLOSING"].includes(
                    line.trim(),
                  )
                ) {
                  return (
                    <span key={i} className="relative z-10 text-[#b3b1a7]">
                      {line}
                    </span>
                  );
                }
                return (
                  <span key={i} className="relative z-10">
                    {line}
                    {i !== event.label.split("\n").length - 1 && <br />}
                  </span>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Timer;
