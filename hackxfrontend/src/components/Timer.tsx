"use client";
import React, { useEffect, useState } from "react";

// Set your target date/time here (e.g., hackathon start)
const TARGET_DATE = new Date("2025-10-30T09:00:00");

const events = [
  { month: "SEP", day: "01", label: "REGISTRATIONS\nBEGIN" },
  { month: "OCT", day: "15", label: "REGISTRATIONS\nEND" },
  { month: "OCT", day: "30", label: "OPENING CEREMONY\n& HACKATHON BEGINS" },
  { month: "SEP", day: "31", label: "HACKATHON ENDS\n& CLOSING" },
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
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Set client flag and initialize timer
    setIsClient(true);
    setTimeLeft(getTimeLeft(TARGET_DATE));

    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft(TARGET_DATE));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mx-auto my-8 max-w-[1100px] font-sans text-white">
      <div className="mb-11 flex w-full justify-center">
        <div className="relative mb-2 inline-block text-center text-[20.34px] leading-[0.99] font-bold tracking-[-0.02em] uppercase">
          {/* The transform: translate values below have been changed from 6px to 12px */}
          <span
            className="absolute top-0 left-0 h-[6px] w-[6px] border-2 border-white"
            style={{
              borderRight: "none",
              borderBottom: "none",
              transform: "translate(-12px, -12px)",
            }}
          ></span>
          <span
            className="absolute top-0 right-0 h-[6px] w-[6px] border-2 border-white"
            style={{
              borderLeft: "none",
              borderBottom: "none",
              transform: "translate(12px, -12px)",
            }}
          ></span>
          <span
            className="absolute bottom-0 left-0 h-[6px] w-[6px] border-2 border-white"
            style={{
              borderRight: "none",
              borderTop: "none",
              transform: "translate(-12px, 12px)",
            }}
          ></span>
          <span
            className="absolute right-0 bottom-0 h-[6px] w-[6px] border-2 border-white"
            style={{
              borderLeft: "none",
              borderTop: "none",
              transform: "translate(12px, 12px)",
            }}
          ></span>
          Time Left to Begin
        </div>
      </div>
      <div className="label mx-auto mb-10 h-[51px] w-[594px]">
        <div
          className="text-wrapper relative top-0 left-0 text-center text-[63.5px] leading-[50.8px] font-bold tracking-[0] whitespace-nowrap text-[#fffef0]"
          suppressHydrationWarning={true}
        >
          {isClient
            ? `${timeLeft.days}D ${String(timeLeft.hours).padStart(2, "0")}H ${String(timeLeft.minutes).padStart(2, "0")}M ${String(timeLeft.seconds).padStart(2, "0")}S`
            : "--D --H --M --S"}
        </div>
      </div>
      <div className="mx-auto flex max-w-[900px] items-end justify-between gap-6">
        {events.map((event, idx) => (
          <div
            key={idx}
            className="flex flex-1 flex-col items-center justify-start text-center"
          >
            <div className="frame relative mb-2 h-[94px] w-[94px] overflow-hidden rounded-[19.86px] border-[3.31px] border-solid border-[#fffef0]">
              <div className="overlap-group absolute top-0 left-0 h-[38px] w-[94px] bg-[#fffef0]">
                <div className="text-wrapper absolute top-[4px] left-[25px] text-[22.2px] font-medium whitespace-nowrap text-[#1e2332]">
                  {event.month}
                </div>
              </div>
              <div className="div absolute top-[41px] left-[30px] text-center text-[27.7px] font-medium whitespace-nowrap text-[#fffef0]">
                {event.day}
              </div>
            </div>
            <div className="text-shadow relative isolate z-10 mt-2 flex max-w-[240px] flex-col items-center justify-start text-[1.1rem] leading-[1.1] font-semibold tracking-[-1px] text-white uppercase">
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
