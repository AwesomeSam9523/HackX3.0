import React from "react";
import { Phone } from "lucide-react";

const contacts = [
  {
    name: "Aryan Verma",
    role: "Student Convener",
    phone: "+91 8287044755",
  },
  {
    name: "Samaksh Gupta",
    role: "Student Convener",
    phone: "+91 9871340076",
  },
  {
    name: "Tamanna Yadav",
    role: "Student Convener",
    phone: "+91 8805147140",
  },
  {
    name: "Harshada Chandel",
    role: "Student Convener",
    phone: "+91 9821970872",
  },
];

const VenueContact: React.FC = () => {
  return (
    <div className="text-offwhite bg-black px-4 py-12 md:px-16">
      {/* Decorative Heading */}
      <div className="mt-10 mb-10 flex justify-center">
        <div className="relative px-8 py-2 text-center">
          {/* Decorative SVG corners */}
          {[
            "top-0 left-0",
            "top-0 right-0",
            "bottom-0 left-0",
            "bottom-0 right-0",
          ].map((pos, i) => (
            <div key={i} className={`absolute ${pos}`}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d={
                    i === 0
                      ? "M2 2L2 8M2 2L8 2"
                      : i === 1
                        ? "M22 2L22 8M22 2L16 2"
                        : i === 2
                          ? "M2 22L2 16M2 22L8 22"
                          : "M22 22L22 16M22 22L16 22"
                  }
                  stroke="white"
                  strokeWidth="3"
                  strokeLinecap="square"
                />
              </svg>
            </div>
          ))}
          <h3 className="font-avgardn text-offwhite max-w-3xl text-xl tracking-wider uppercase">
            Need further assistance? Don’t hesitate to reach out to our team
          </h3>
        </div>
      </div>

      {/* Cards */}
      <div className="mx-auto flex max-w-7xl flex-wrap justify-center gap-6">
        {contacts.map((person, index) => (
          <div
            key={index}
            className="w-[15rem] rounded-xl bg-white/10 px-6 py-4 text-center shadow-md backdrop-blur-md"
          >
            <h3 className="font-avgardn text-lg font-bold">{person.name}</h3>
            <p className="font-avgardn mb-4 text-sm text-gray-400">
              {person.role.toUpperCase()}
            </p>
            <p className="font-avgardn text-offwhite mt-2 text-sm">
              {person.phone}
            </p>
            <a
              href={`tel:${person.phone.replace(/ /g, "")}`}
              className="mt-4 inline-flex h-10 w-30 items-center justify-center rounded-3xl border border-white/20 bg-white/10 transition hover:bg-white/20"
            >
              <Phone className="text-offwhite h-5 w-5" />
            </a>
          </div>
        ))}
      </div>

      {/* Email */}
      <p className="font-avgardn text-offwhite mt-12 text-center text-lg font-semibold">
        OR MAIL US AT:{" "}
        <a href="mailto:hackxmuj@gmail.com" className="text-offwhite">
          HACKXMUJ@GMAIL.COM
        </a>
      </p>
    </div>
  );
};

export default VenueContact;
