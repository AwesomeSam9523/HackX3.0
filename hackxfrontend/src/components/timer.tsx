"use client";
import React, { useEffect, useState } from 'react';

// Set your target date/time here (e.g., hackathon start)
const TARGET_DATE = new Date('2025-10-30T09:00:00');

const events = [
  { month: 'SEP', day: '01', label: 'REGISTRATIONS\nBEGIN' },
  { month: 'OCT', day: '15', label: 'REGISTRATIONS\nEND' },
  { month: 'OCT', day: '30', label: 'OPENING CEREMONY\n& HACKATHON BEGINS' },
  { month: 'SEP', day: '31', label: 'HACKATHON ENDS\n& CLOSING' },
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
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(TARGET_DATE));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft(TARGET_DATE));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#111] text-white p-8 rounded-[16px] max-w-[1100px] mx-auto my-8 font-sans shadow-[0_2px_16px_rgba(0,0,0,0.3)]">
      <div className="flex justify-center w-full mb-11">
        <div className="relative inline-block text-center mb-2 font-bold text-[20.34px] leading-[0.99] tracking-[-0.02em] uppercase">
          {/* The transform: translate values below have been changed from 6px to 12px */}
          <span className="absolute w-[6px] h-[6px] border-2 border-white top-0 left-0" style={{borderRight: 'none', borderBottom: 'none', transform: 'translate(-12px, -12px)'}}></span>
          <span className="absolute w-[6px] h-[6px] border-2 border-white top-0 right-0" style={{borderLeft: 'none', borderBottom: 'none', transform: 'translate(12px, -12px)'}}></span>
          <span className="absolute w-[6px] h-[6px] border-2 border-white bottom-0 left-0" style={{borderRight: 'none', borderTop: 'none', transform: 'translate(-12px, 12px)'}}></span>
          <span className="absolute w-[6px] h-[6px] border-2 border-white bottom-0 right-0" style={{borderLeft: 'none', borderTop: 'none', transform: 'translate(12px, 12px)'}}></span>
          Time Left to Begin
        </div>
      </div>
      <div className="label h-[51px] w-[594px] mx-auto mb-10">
        <div className="text-wrapper text-[#fffef0] text-[63.5px] font-bold left-0 tracking-[0] leading-[50.8px] relative text-center top-0 whitespace-nowrap">
          {`${timeLeft.days}D ${String(timeLeft.hours).padStart(2, '0')}H ${String(timeLeft.minutes).padStart(2, '0')}M ${String(timeLeft.seconds).padStart(2, '0')}S`}
        </div>
      </div>
      <div className="flex justify-between items-end gap-6 max-w-[900px] mx-auto">
        {events.map((event, idx) => (
          <div key={idx} className="text-center flex-1 flex flex-col items-center justify-start">
            <div className="frame border-[3.31px] border-solid border-[#fffef0] rounded-[19.86px] h-[94px] overflow-hidden relative w-[94px] mb-2">
              <div className="overlap-group bg-[#fffef0] h-[38px] left-0 absolute top-0 w-[94px]">
                <div className="text-wrapper text-[#1e2332] font-medium text-[22.2px] left-[25px] absolute top-[4px] whitespace-nowrap">{event.month}</div>
              </div>
              <div className="div text-[#fffef0] font-medium text-[27.7px] left-[30px] absolute text-center top-[41px] whitespace-nowrap">{event.day}</div>
            </div>
            <div className="mt-2 text-[1.1rem] font-semibold uppercase leading-[1.1] tracking-[-1px] text-white text-shadow max-w-[240px] flex flex-col items-center justify-start">
              {event.label.split('\n').map((line, i) => {
                if (["BEGIN", "END", "& HACKATHON BEGINS", "& CLOSING"].includes(line.trim())) {
                  return <span key={i} className="text-[#b3b1a7]">{line}</span>;
                }
                return <span key={i}>{line}{i !== event.label.split('\n').length - 1 && <br />}</span>;
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Timer;