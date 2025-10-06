import React from "react";
import { cardData, Card, CardProps } from "./AmbassadorCard";
import BecomeAmbassadorBanner from "./BecomeAmbassadorBanner";
import FAQClient from "./FAQClient";
import LightBoxOthers from "./LightBoxOthers";
//import  AbassadorFAQ from "./AmbassadorFAQ";
import Link from "next/link";

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
        "The Campus Ambassador Program typically lasts for one academic year, but ambassadors may reapply or be invited to continue based on their performance.",
    },
    {
      id: 5,
      question: "WHAT ARE THE RESPONSIBILITIES OF A CAMPUS AMBASSADOR? ",
      answer:
        "Responsibilities include promoting MujHackX events, organizing coding workshops, engaging with the student community, and providing feedback to MujHackX.",
    },
  ];

  return (
    <div className="relative z-10">
      <LightBoxOthers name="ambassador" id={0} />

      {/*Details*/}
      <div className="flex flex-col items-center justify-center gap-5">
        <button
          className="font-avgardn text-offwhite xs:w-[50px] relative mt-20 mb-3 max-w-[300px] rounded-full border-2 border-white bg-transparent py-2 font-bold tracking-wider uppercase transition-all duration-300 sm:w-[300px]"
          style={{
            fontSize: "clamp(0.7rem,1vw,1rem)",
            paddingRight: "1rem",
            paddingLeft: "1rem",
          }}
        >
          Be the representative of your campus!
        </button>
        <div className="font-kinetikaUltra text-offwhite mb-8 text-center text-[2.5rem] leading-[79.9%] font-black tracking-wider md:text-6xl">
          CAMPUS AMBASSADOR
          <div
            className="font-kinetikaUltra text-offwhite mt-4 mb-8 text-center leading-[79.9%] font-black"
            style={{ fontSize: "25px", marginBottom: "16px" }}
          >
            OF MUJ HACKX 3.0!
          </div>
          <Link
            href="https://forms.gle/m7rXsLXkuv4gbPHh9"
            target="_blank"
            rel="noopener noreferrer"
            className="font-avgardn text-offwhite mt-2 rounded-full border-2 border-white bg-transparent px-6 py-2 text-base font-bold tracking-wider uppercase transition-all duration-300"
            style={{ fontSize: "clamp(0.7rem,1vw,1rem)" }}
          >
            Apply Now
          </Link>
          {/* ABOUT Section */}
          <div
            className="rectangleDiv relative mx-auto mt-8 mb-8 min-h-[500px] w-full max-w-6xl overflow-hidden rounded-[40px] bg-[rgba(0,0,0,0.17)] px-6 py-8 shadow-lg backdrop-blur-[48.9px] md:px-12"
            style={{ width: "clamp(19rem,63vw,63rem)" }}
          >
            {/* Corner Borders */}
            <span className="absolute top-8 left-8 h-[15px] w-[15px] border-3 border-r-0 border-b-0 border-white" />
            <span className="absolute top-8 right-8 h-[15px] w-[15px] border-3 border-b-0 border-l-0 border-white" />
            <span className="absolute bottom-8 left-8 h-[15px] w-[15px] border-3 border-t-0 border-r-0 border-white" />
            <span className="absolute right-8 bottom-8 h-[15px] w-[15px] border-3 border-t-0 border-l-0 border-white" />
            <div className="mt-[clamp(2.2rem,3vw,3rem)] w-full text-center">
              <div className="mb-[clamp(1rem,2vw,2rem)] flex items-center justify-center">
                <div className="relative inline-block px-2 py-1">
                  {/* Corner Borders for ABOUT heading */}
                  <span className="absolute top-1 -left-5 h-2 w-2 border-t-2 border-l-2 border-white" />
                  <span className="absolute top-1 -right-5 h-2 w-2 border-t-2 border-r-2 border-white" />
                  <span className="absolute bottom-1 -left-5 h-2 w-2 border-b-2 border-l-2 border-white" />
                  <span className="absolute -right-5 bottom-1 h-2 w-2 border-r-2 border-b-2 border-white" />
                  <div className="font-avgardd text-offwhite flex items-center gap-4 text-[clamp(1.3rem,1.5vw,1.5rem)] font-extrabold tracking-wider uppercase">
                    <span>About</span>
                  </div>
                </div>
              </div>
              <div className="text-offwhite mx-auto max-w-4xl space-y-6 px-2 py-4 text-center font-bold uppercase md:px-4">
                <p className="font-avgardn text-base text-[clamp(0.8rem,1.3vw,1.3rem)] leading-snug tracking-wider">
                  Our Campus Ambassador Program is an incredible opportunity for
                  students to represent our college and help us spread the word
                  about our mission. As a Campus Ambassador, you will gain
                  valuable experience, enhance your leadership skills, and
                  connect with like-minded individuals.
                </p>

                <p className="font-avgardn mb-4 text-base text-[clamp(0.8rem,1.3vw,1.3rem)] leading-snug tracking-wider md:text-lg lg:text-xl">
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
          <span className="absolute -top-1 -left-[1rem] h-2 w-2 border-t-2 border-l-2 border-white" />
          <span className="absolute -top-1 -right-[1rem] h-2 w-2 border-t-2 border-r-2 border-white" />
          <span className="absolute -bottom-1 -left-[1rem] h-2 w-2 border-b-2 border-l-2 border-white" />
          <span className="absolute -right-[1rem] -bottom-1 h-2 w-2 border-r-2 border-b-2 border-white" />
          <div className="font-avgardd text-offwhite flex items-center gap-4 text-[clamp(1.2rem,2.4vw,2.4rem)] font-extrabold tracking-wider uppercase">
            <span>why should you apply?</span>
          </div>
        </div>
      </div>
      <div className="rectangleDiv relative mx-auto mt-8 mb-0 w-full max-w-6xl overflow-hidden px-6 py-8 shadow-lg md:mb-8 md:px-12">
        <div className="font-avgardn text-offwhite mx-auto -mt-8 max-w-4xl text-center text-[clamp(0.8rem,1.3vw,1.3rem)] leading-tight font-bold uppercase md:mt-0 md:text-xl">
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
      <div className="rectangleDiv relative mx-auto mt-0 mb-0 w-full max-w-6xl overflow-hidden px-6 py-8 shadow-lg md:mt-8 md:mb-8 md:px-12">
        <div className="font-avgardn text-offwhite mx-auto max-w-4xl text-center text-[clamp(0.8rem,1.3vw,1.3rem)] leading-tight font-bold uppercase md:text-xl">
          As a Campus Ambassador, you will be responsible for promoting our
          brand on campus, organizing and hosting events and workshops, engaging
          with students and gathering feedback, and representing our company at
          campus fairs and events.
        </div>
      </div>
      <div className="mx-auto mb-0 flex w-[clamp(19rem,62vw,62rem)] max-w-4xl flex-col items-center gap-2">
        <div className="mb:mt-10 container mt-5 mb-10 flex items-center justify-center">
          <div className="relative container m-3 inline-block px-2 py-1">
            {/* Corner Borders for ABOUT heading */}
            <span className="absolute -top-1 -left-1 h-2 w-2 border-t-2 border-l-2 border-white" />
            <span className="absolute -top-1 -right-1 h-2 w-2 border-t-2 border-r-2 border-white" />
            <span className="absolute -bottom-1 -left-1 h-2 w-2 border-b-2 border-l-2 border-white" />
            <span className="absolute -right-1 -bottom-1 h-2 w-2 border-r-2 border-b-2 border-white" />
            <div className="font-avgardd text-offwhite flex items-center justify-center gap-4 text-center text-[clamp(1rem,2.4vw,2.4rem)] font-extrabold tracking-tight uppercase sm:tracking-wider">
              <span>Campus Ambassador in 3 simple steps</span>
            </div>
          </div>
        </div>
      </div>
      {/* 3 Simple Steps Section */}
      <div className="mx-auto mb-15 flex w-full max-w-4xl flex-col items-center gap-5">
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
            className="flex h-[clamp(1rem,7vw,7rem)] w-[clamp(19rem,60vw,60rem)] items-center rounded-full bg-[rgba(0,0,0,0.45)] px-8 py-6 shadow-lg"
          >
            <div className="mr-8 flex h-[clamp(1.7rem,4vw,4rem)] w-[clamp(1.7rem,4vw,4rem)] flex-shrink-0 items-center justify-center rounded-full border-1 border-white bg-[rgba(255,255,255,0.1)]">
              <span className="font-avgardd text-offwhite text-[clamp(0.8rem,1.3vw,1.3rem)]">
                {step.number}
              </span>
            </div>
            <div className="font-avgardd text-offwhite text-[clamp(0.8rem,1.3vw,1.3rem)] leading-tight uppercase">
              {step.text}
            </div>
          </div>
        ))}
        <BecomeAmbassadorBanner />
        {/* Campus Ambassador FAQ Section */}
        <div className="z-10 container mt-10 mb-10 flex w-[clamp(19rem,62vw,62rem)] items-center justify-center">
          <div className="relative container m-3 inline-block px-2 py-1">
            {/* Corner Borders for ABOUT heading */}
            <span className="absolute -top-1 -left-1 h-2 w-2 border-t-2 border-l-2 border-white" />
            <span className="absolute -top-1 -right-1 h-2 w-2 border-t-2 border-r-2 border-white" />
            <span className="absolute -bottom-1 -left-1 h-2 w-2 border-b-2 border-l-2 border-white" />
            <span className="absolute -right-1 -bottom-1 h-2 w-2 border-r-2 border-b-2 border-white" />
            <div className="font-avgardd text-offwhite flex items-center justify-center gap-4 text-[clamp(1rem,2.4vw,2.4rem)] font-extrabold tracking-wider uppercase">
              <span>frequently asked questions</span>
            </div>
          </div>
        </div>
        <div className="-mt-10 px-8 md:mt-0 lg:px-12">
          <FAQClient faqs={campusAmbassadorFaqs} disableBodyBgChange={true} />
        </div>
      </div>
    </div>
  );
};

export default WhyApplySection;
