import React from "react";
import { TrainFront, Plane, BusFront } from "lucide-react";

type CardProps = {
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
};

const cardData: CardProps[] = [
  {
    icon: <TrainFront className="h-6 w-6" />,
    title: "By Train",
    description: (
      <>
        Book tickets from IRCTC. The campus is <strong>25 KMs</strong> from{" "}
        <strong>Jaipur Railway Station</strong> and cab fare is around{" "}
        <span className="text-offwhite font-semibold">₹500–₹600</span>.
      </>
    ),
  },
  {
    icon: <Plane className="h-6 w-6" />,
    title: "By Air",
    description: (
      <>
        Flights from <strong>Delhi, Mumbai, Hyderabad, Bangalore</strong>. The
        campus is <strong>35 KMs</strong> from Jaipur Airport.
      </>
    ),
  },
  {
    icon: <BusFront className="h-6 w-6" />,
    title: "By Bus",
    description: (
      <>
        Only if nearby. <strong>Sindhi Camp</strong> is <strong>30 KMs</strong>{" "}
        away. Auto fare is approx{" "}
        <span className="text-offwhite font-semibold">₹400–₹450</span>.
      </>
    ),
  },
];

const Card: React.FC<CardProps> = ({ icon, title, description }) => (
  <div className="text-offwhite flex h-[16rem] w-[22rem] flex-col items-center justify-center rounded-xl border border-white/20 bg-white/[0.02] px-8 text-center shadow-md shadow-blue-500/20 backdrop-blur-md transition-transform duration-300 hover:scale-105">
    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border-3 border-white text-3xl">
      {icon}
    </div>
    <h3 className="font-avgardn text-offwhite mb-2 text-xl font-semibold tracking-wide uppercase">
      {title}
    </h3>
    <p className="text-md font-avgardn text-offwhite px-4">{description}</p>
  </div>
);

export default function TransportCards() {
  return (
    <div>
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

          <h3 className="font-avgardn text-offwhite text-center text-xl font-bold tracking-wider">
            REACHING THE VENUE : MANIPAL UNIVERSITY JAIPUR
          </h3>
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-6">
        {cardData.map((card, index) => (
          <Card key={index} {...card} />
        ))}
      </div>
    </div>
  );
}
