"use client";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import { useState, useEffect } from "react";

const Page = () => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  useEffect(() => {
    document.body.style.background = "transparent";

    return () => {
      document.body.style.background = "";
    };
  }, []);

  const faqs = [
    {
      id: 1,
      question: "HOW DO I REGISTER ?",
      answer:
        "To register for the hackathon, click the 'REGISTER NOW' button and fill out the registration form with your details.",
    },
    {
      id: 2,
      question: "HOW MANY TEAM MEMBERS DO I NEED?",
      answer:
        "Teams can consist of 2-4 members. You can also participate as an individual and we'll help you find teammates.",
    },
    {
      id: 3,
      question: "HOW MUCH IS THE PARTICIPATION FEES?",
      answer:
        "The participation fee varies by category. Please check the registration page for current pricing details.",
    },
    {
      id: 4,
      question: "WILL THE HACKATHON BE IN PERSON OR ONLINE ?",
      answer:
        "This hackathon will be conducted in a hybrid format - both in-person and online participation options are available.",
    },
    {
      id: 5,
      question: "WHAT IS THE VENUE FOR MUJHACKX 2.0 ?",
      answer:
        "The in-person venue details will be shared with registered participants via email closer to the event date.",
    },
    {
      id: 6,
      question: "WHAT ARE THE PREREQUISITES TO PARTICIPATE IN THIS HACKATHON ?",
      answer:
        "Basic programming knowledge and enthusiasm to learn and build innovative solutions. All skill levels are welcome!",
    },
    {
      id: 7,
      question:
        "CAN MY FRIEND JOIN OUR TEAM AFTER WE HAVE ALREADY SUBMITTED THE APPLICATION FOR REVIEW ?",
      answer:
        "Yes, team modifications are possible before the final deadline. Please contact our support team for assistance with team changes.",
    },
  ];

  const toggleFAQ = (id: number) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  return (
    <>
      {/* Fixed background image */}

      <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-blue-500 via-black to-black">
        <div className="pointer-events-none fixed inset-0 z-0 h-full w-full">
          <Image
            src="/x2.png"
            alt="Background decoration"
            width={384}
            height={384}
            className="h-full w-full object-contain opacity-50"
          />
        </div>
        <div className="relative z-10 container mx-auto px-4">
          <Navbar />

          {/* Header section */}
          <div className="mb-16 text-center">
            <div className="mb-8 inline-block rounded-full border border-white/30 bg-white/10 px-20 py-3 backdrop-blur-sm">
              <span className="font-sans text-lg font-bold tracking-tighter text-white">
                EVERYTHING YOU NEED TO KNOW
              </span>
            </div>

            <h1 className="mb-6 text-7xl font-extrabold tracking-tighter text-white md:text-8xl lg:text-9xl">
              FAQs
            </h1>

            <p className="mx-auto max-w-2xl text-lg font-extrabold tracking-tighter text-white/80">
              HAVE QUESTIONS ABOUT THE HACKATHON? EXPLORE OUR FAQ BELOW!
            </p>
          </div>

          {/* FAQ Items */}
          <div className="mx-auto max-w-4xl space-y-1">
            {faqs.map((faq) => (
              <div
                key={faq.id}
                className="overflow-hidden rounded-4xl border border-white/10 bg-black/30 backdrop-blur-sm transition-all duration-300 hover:bg-black/40"
              >
                <button
                  onClick={() => toggleFAQ(faq.id)}
                  className="flex w-full items-center justify-center px-8 py-6 text-left text-white transition-colors duration-200 hover:bg-white/5"
                >
                  <span className="text-center text-lg font-bold tracking-tight">
                    {faq.question}
                  </span>
                  <div
                    className={`transform transition-transform duration-300 ${
                      openFAQ === faq.id ? "rotate-45" : "rotate-0"
                    }`}
                  ></div>
                </button>

                <div
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    openFAQ === faq.id
                      ? "max-h-96 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="px-8 pb-6">
                    <div className="border-t border-white/10 pt-4">
                      <p className="transform text-center leading-relaxed text-white/80 transition-transform duration-300">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer text */}
          <div className="mt-16 pb-16 text-center">
            <p className="text-lg font-extrabold tracking-tighter text-white">
              NEED FURTHER ASSISTANCE? DON&apos;T HESITATE TO REACH OUT TO OUR
              TEAM.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
