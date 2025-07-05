"use client";
import { useState, useEffect } from "react";

interface FAQ {
  id: number;
  question: string;
  answer: string;
}

interface FAQClientProps {
  faqs: FAQ[];
  disableBodyBgChange?: boolean;
}

const FAQClient: React.FC<FAQClientProps> = ({ faqs, disableBodyBgChange }) => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  useEffect(() => {
    if (disableBodyBgChange) return;
    document.body.style.background = "transparent";
    return () => {
      document.body.style.background = "";
    };
  }, [disableBodyBgChange]);

  return (
    <div className="mx-auto max-w-4xl space-y-1">
      {faqs.map((faq) => (
        <div
          key={faq.id}
          className="overflow-hidden rounded-4xl border border-white/10 bg-black/30 backdrop-blur-sm transition-all duration-300 hover:bg-black/40"
          onMouseEnter={() => setOpenFAQ(faq.id)}
          onMouseLeave={() => setOpenFAQ(null)}
        >
          <div className="flex w-full cursor-pointer items-center justify-center px-8 py-6 text-left text-white transition-colors duration-200 hover:bg-white/5">
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
                <p className="transform text-center leading-relaxed text-white/80 transition-transform duration-300">
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
