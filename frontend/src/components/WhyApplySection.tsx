import React from "react";
import { cardData, Card, CardProps } from "./AmbassadorCard";
import BecomeAmbassadorBanner from "./BecomeAmbassadorBanner";
import FAQClient from "./FAQClient";
import LightBoxOthers from "./LightBoxOthers";
//import  AbassadorFAQ from "./AmbassadorFAQ";

const WhyApplySection = () => {
  const campusAmbassadorFaqs = [
    {
      id: 1,
      question: "WHAT IS THE MUJ CAMPUS AMBASSADOR PROGRAM?",
      answer:
        "The MujHackx Campus Ambassador Program is a platform for students to become representatives of MujHackx at their universities. Ambassadors help promote coding culture and organize events.",
    },
    {
      id: 2,
      question: "WHO CAN APPLY FOR THE CAMPUS AMBASSADOR PROGRAM?",
      answer:
        "Promote the event, organize workshops, and be the point of contact for your campusAny student currently enrolled in a college or university with a passion for coding and community building can apply for the Campus Ambassador Program.",
    },
    {
      id: 3,
      question: "WHAT ARE THE BENEFITS FOR BECOMING A CAMPUS AMBASSADOR? ",
      answer:
        "Yes! Ambassadors get certificates, exclusive swag, and networking opportunities.",
    },
    {
      id: 4,
      question: "HOW LONG DOES THE CAMPUS AMBASSADOR PROGRAM LAST?",
      answer:
        "Click the 'APPLY NOW' button above and fill out the application form.",
    },
    {
      id: 5,
      question: "WHAT ARE THE RESPONSIBILITIES OF A CAMPUS AMBASSADOR? ",
      answer:
        "Click the 'APPLY NOW' button above and fill out the application form.",
    },
  ];

  return (
    <div className="relative z-10">
      <LightBoxOthers name="ambassador" id={0} />

      {/*Details*/}
      <div className="flex flex-col items-center justify-center gap-5">
        <button className="font-avgardn text-offwhite mt-4 mt-20 rounded-full border-2 border-white bg-transparent px-10 py-3 text-lg font-bold tracking-wider uppercase transition-all duration-300">
          Be the representative of your campus!
        </button>
        <div className="font-kinetikaUltra text-offwhite mb-8 text-center text-5xl leading-[79.9%] font-black tracking-wider md:text-6xl">
          CAMPUS AMBASSADOR
          <div
            className="font-kinetikaUltra text-offwhite mt-4 mb-8 text-center text-xl leading-[79.9%] font-black md:text-6xl"
            style={{ fontSize: "35px", marginBottom: "16px" }}
          >
            OF MUJ HACKX 3.0!
          </div>
          <button className="font-avgardn text-offwhite mt-0 rounded-full border-2 border-white bg-transparent px-6 py-2 text-base font-bold tracking-wider uppercase transition-all duration-300">
            Apply Now
          </button>
          {/* ABOUT Section */}
          <div className="rectangleDiv relative mx-auto mt-8 mb-8 min-h-[500px] w-full max-w-6xl overflow-hidden rounded-[40px] bg-[rgba(0,0,0,0.17)] px-6 py-8 shadow-lg backdrop-blur-[48.9px] md:px-12">
            {/* Corner Borders */}
            <span className="absolute top-8 left-8 h-[15px] w-[15px] border-3 border-r-0 border-b-0 border-white" />
            <span className="absolute top-8 right-8 h-[15px] w-[15px] border-3 border-b-0 border-l-0 border-white" />
            <span className="absolute bottom-8 left-8 h-[15px] w-[15px] border-3 border-t-0 border-r-0 border-white" />
            <span className="absolute right-8 bottom-8 h-[15px] w-[15px] border-3 border-t-0 border-l-0 border-white" />
            <div className="mt-17 w-full text-center">
              <div className="mb-10 flex items-center justify-center">
                <div className="relative inline-block px-2 py-1">
                  {/* Corner Borders for ABOUT heading */}
                  <span className="absolute -top-1 -left-2 h-2 w-2 border-t-2 border-l-2 border-white" />
                  <span className="absolute -top-1 -right-2 h-2 w-2 border-t-2 border-r-2 border-white" />
                  <span className="absolute -bottom-1 -left-2 h-2 w-2 border-b-2 border-l-2 border-white" />
                  <span className="absolute -right-2 -bottom-1 h-2 w-2 border-r-2 border-b-2 border-white" />
                  <div className="font-avgardd text-offwhite flex items-center gap-4 text-2xl font-extrabold tracking-wider uppercase md:text-3xl">
                    <span>About</span>
                  </div>
                </div>
              </div>
              <div className="text-offwhite mx-auto max-w-4xl space-y-6 px-2 py-4 text-center font-bold uppercase md:px-4">
                <p className="font-avgardn text-base leading-snug tracking-wider md:text-lg lg:text-xl">
                  Our Campus Ambassador Program is an incredible opportunity for
                  students to represent our college and help us spread the word
                  about our mission. As a Campus Ambassador, you will gain
                  valuable experience, enhance your leadership skills, and
                  connect with like-minded individuals.
                </p>
                <p className="font-avgardn text-base leading-snug tracking-wider md:text-lg lg:text-xl">
                  You will be the face of our hackathon on your campus,
                  organizing events, sharing our story, and promoting our
                  values. This role is perfect for proactive, enthusiastic, and
                  passionate students who want to make a difference.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mb-10 flex items-center justify-center">
        <div className="relative inline-block px-2 py-1">
          {/* Corner Borders for ABOUT heading */}
          <span className="absolute -top-1 -left-1 h-2 w-2 border-t-2 border-l-2 border-white" />
          <span className="absolute -top-1 -right-1 h-2 w-2 border-t-2 border-r-2 border-white" />
          <span className="absolute -bottom-1 -left-1 h-2 w-2 border-b-2 border-l-2 border-white" />
          <span className="absolute -right-1 -bottom-1 h-2 w-2 border-r-2 border-b-2 border-white" />
          <div className="font-avgardd text-offwhite flex items-center gap-4 text-2xl font-extrabold tracking-wider uppercase md:text-3xl">
            <span>why should you apply?</span>
          </div>
        </div>
      </div>
      <div className="rectangleDiv relative mx-auto mt-8 mb-8 w-full max-w-6xl overflow-hidden px-6 py-8 shadow-lg md:px-12">
        <div className="font-avgardn text-offwhite mx-auto max-w-4xl text-center text-lg leading-tight font-bold uppercase md:text-xl">
          Becoming a Campus Ambassador offers a unique opportunity to develop
          your professional skills, network with industry leaders, and gain
          invaluable experience that will set you apart in the job market.
        </div>
      </div>

      <div className="relative mx-auto grid max-w-[1100px] grid-cols-1 justify-items-center gap-4 px-4 py-6 sm:grid-cols-2 lg:grid-cols-3">
        {cardData.map((card: CardProps, index: number) => (
          <Card
            key={index}
            icon={card.icon}
            title={card.title}
            description={card.description}
          />
        ))}
      </div>
      <div className="rectangleDiv relative mx-auto mt-8 mb-8 w-full max-w-6xl overflow-hidden px-6 py-8 shadow-lg md:px-12">
        <div className="font-avgardn text-offwhite mx-auto max-w-4xl text-center text-lg leading-tight font-bold uppercase md:text-xl">
          As a Campus Ambassador, you will be responsible for promoting our
          brand on campus, organizing and hosting events and workshops, engaging
          with students and gathering feedback, and representing our company at
          campus fairs and events.
        </div>
      </div>
      <div className="mx-auto mb-0 flex w-full max-w-4xl flex-col items-center gap-2">
        <div className="container mt-10 mb-10 flex items-center justify-center">
          <div className="relative container m-3 inline-block px-2 py-1">
            {/* Corner Borders for ABOUT heading */}
            <span className="absolute -top-1 -left-1 h-2 w-2 border-t-2 border-l-2 border-white" />
            <span className="absolute -top-1 -right-1 h-2 w-2 border-t-2 border-r-2 border-white" />
            <span className="absolute -bottom-1 -left-1 h-2 w-2 border-b-2 border-l-2 border-white" />
            <span className="absolute -right-1 -bottom-1 h-2 w-2 border-r-2 border-b-2 border-white" />
            <div className="font-avgardd text-offwhite flex items-center justify-center gap-4 text-[1.2rem] font-extrabold tracking-tight uppercase sm:text-2xl sm:tracking-wider md:text-3xl">
              <span>Campus Ambassador in 3 simple steps</span>
            </div>
          </div>
        </div>
      </div>
      {/* 3 Simple Steps Section */}
      <div className="mx-auto mb-15 flex w-full max-w-4xl flex-col items-center gap-2">
        {[
          {
            number: "1.",
            text: "FILL IN THE FORM WITH ALL YOUR DETAILS.",
          },
          {
            number: "2.",
            text: "ONCE YOU RECEIVE THE MAIL, YOU ARE OFFICIALLY A MUJ HACKX CAMPUS AMBASSADOR",
          },
          {
            number: "3.",
            text: "GET YOUR REFERRAL CODE AND START PROMOTING, AND ENJOY PERKS.",
          },
        ].map((step, idx) => (
          <div
            key={idx}
            className="flex w-full items-center rounded-full bg-[rgba(0,0,0,0.45)] px-8 py-6 shadow-lg"
          >
            <div className="mr-8 flex h-15 w-15 flex-shrink-0 items-center justify-center rounded-full border-1 border-white bg-[rgba(255,255,255,0.1)]">
              <span className="font-avgardd text-offwhite text-xl">
                {step.number}
              </span>
            </div>
            <div className="font-avgardd text-offwhite text-xl leading-tight uppercase">
              {step.text}
            </div>
          </div>
        ))}
        <BecomeAmbassadorBanner />
        {/* Campus Ambassador FAQ Section */}
        <div className="z-10 container mt-10 mb-10 flex items-center justify-center">
          <div className="relative container m-3 inline-block px-2 py-1">
            {/* Corner Borders for ABOUT heading */}
            <span className="absolute -top-1 -left-1 h-2 w-2 border-t-2 border-l-2 border-white" />
            <span className="absolute -top-1 -right-1 h-2 w-2 border-t-2 border-r-2 border-white" />
            <span className="absolute -bottom-1 -left-1 h-2 w-2 border-b-2 border-l-2 border-white" />
            <span className="absolute -right-1 -bottom-1 h-2 w-2 border-r-2 border-b-2 border-white" />
            <div className="font-avgardd text-offwhite flex items-center justify-center gap-4 text-[1.2rem] font-extrabold tracking-wider uppercase sm:text-2xl md:text-3xl">
              <span>frequently asked questions</span>
            </div>
          </div>
        </div>
        <div className="px-8 lg:px-12">
          <FAQClient faqs={campusAmbassadorFaqs} disableBodyBgChange={true} />
        </div>
      </div>
    </div>
  );
};

export default WhyApplySection;
