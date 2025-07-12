import React from "react";
import {
  Command,
  MessageCircle,
  BookOpen,
  Cpu,
  Star,
  Share2,
} from "lucide-react";

export type CardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

export const cardData: CardProps[] = [
  {
    icon: <Command />,
    title: "INTERNSHIP ELIGIBLITY",
    description:
      "Internship status and its eligibility for posting on various platforms will be considered",
  },
  {
    icon: <MessageCircle />,
    title: "CERTIFICATES & LOR",
    description:
      "A certificated paired with an LOR will be issued by the college.",
  },
  {
    icon: <BookOpen />,
    title: "FREE GOODIES!",
    description:
      "Campus ambassadors would enjoy all the free HackX 3.0 goodies!",
  },
  {
    icon: <Cpu />,
    title: "MILESTONE INCENTIVES",
    description: "Several milestone based incentives will be provided!",
  },
  {
    icon: <Star />,
    title: "EXPERIENCE CENTER",
    description: "Get a chance to visit MUJ's Experience Center!",
  },
  {
    icon: <Share2 />,
    title: "NETWORKING",
    description:
      "Connect with industry professionals and recruiters and other teams to learn and grow more.   ",
  },
];

export function Card({ icon, title, description }: CardProps) {
  return (
    <div>
      <div className="text-offwhite flex h-72 w-80 flex-col items-center justify-center rounded-xl border border-white/20 bg-[rgba(255,255,255,0.01)] px-2 text-center bg-blend-luminosity shadow-md shadow-blue-500/30 backdrop-blur-md transition-transform duration-300 hover:scale-105">
        <div className="mb-4 text-6xl">{icon}</div>
        <h3 className="font-avgardn mb-2 text-lg font-semibold">{title}</h3>
        <p className="font-avgardn px-4 text-sm text-gray-300">{description}</p>
      </div>
    </div>
  );
}
