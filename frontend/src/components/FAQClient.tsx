"use client";
import { useState } from "react";

interface FAQ {
  id: number;
  question: string;
  answer: string;
}

interface FAQClientProps {
  faqs: FAQ[];
  disableBodyBgChange?: boolean;
}

const FAQClient: React.FC<FAQClientProps> = ({ faqs }) => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  return (
    <div className="mx-auto max-w-4xl space-y-1">
      {/* Decorative white corners */}
      <div className="mb-8 flex justify-center">
        <div className="relative px-8 py-2">
          {/* Top Left Corner */}
          <div className="absolute top-0 left-0">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M2 2L2 8M2 2L8 2"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="square"
              />
            </svg>
          </div>

          {/* Top Right Corner */}
          <div className="absolute top-0 right-0">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M22 2L22 8M22 2L16 2"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="square"
              />
            </svg>
          </div>

          {/* Bottom Left Corner */}
          <div className="absolute bottom-0 left-0">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M2 22L2 16M2 22L8 22"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="square"
              />
            </svg>
          </div>

          {/* Bottom Right Corner */}
          <div className="absolute right-0 bottom-0">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M22 22L22 16M22 22L16 22"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="square"
              />
            </svg>
          </div>

          <h3 className="font-avgardn text-offwhite mb-8 text-center text-xl tracking-wider">
            HAVE QUESTIONS ABOUT THE HACKATHON? EXPLORE OUR FAQ BELOW!
          </h3>
        </div>
      </div>
      {faqs.map((faq) => (
        <div
          key={faq.id}
          className="overflow-hidden rounded-4xl border border-white/10 bg-white/10 backdrop-blur-sm transition-all duration-300 hover:bg-black/40"
          onMouseEnter={() => setOpenFAQ(faq.id)}
          onMouseLeave={() => setOpenFAQ(null)}
        >
          <div className="text-offwhite flex w-full cursor-pointer items-center justify-center px-8 py-6 text-left transition-colors duration-200 hover:bg-white/5">
            <span className="text-center text-lg font-bold tracking-tight">
              {faq.question}
            </span>
            <div
              className={`transition-all duration-500 ease-in-out ${
                openFAQ === faq.id ? "rotate-45" : "rotate-0"
              }`}
            ></div>
          </div>

          <div
            className={`overflow-hidden transition-all duration-700 ease-in-out ${
              openFAQ === faq.id
                ? "max-h-60 translate-y-0 opacity-100"
                : "max-h-0 -translate-y-2 opacity-0"
            }`}
            style={{
              transitionProperty: "max-height, opacity, transform",
            }}
          >
            <div className="px-8 pb-6">
              <div className="border-t border-white/10 pt-4">
                <p className="text-offwhite/80 transform text-center leading-relaxed transition-transform duration-300">
                  {faq.answer}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FAQClient;
