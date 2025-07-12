// components/WhyUsCard.tsx
import React from "react";
import {
  Users,
  Trophy,
  BookOpen,
  Handshake,
  Briefcase,
  Share2,
} from "lucide-react";

export type CardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

export const cardData: CardProps[] = [
  {
    icon: <Users />,
    title: "COLLABORATE & SKILL UP",
    description:
      "Connect with people, form a team, learn new skills and develop amazing projects",
  },
  {
    icon: <Trophy />,
    title: "WIN EXCITING PRIZES",
    description:
      "Top 3 teams plus best projects of each domain will win prizes that will be disclosed soon!",
  },
  {
    icon: <BookOpen />,
    title: "ENGAGING WORKSHOPS",
    description:
      "Technical workshops and events to be held to keep the participants engaged throughout.",
  },
  {
    icon: <Handshake />,
    title: "MENTORSHIP SESSIONS",
    description:
      "Get mentorship and guidance from prominent professionals of the industry.",
  },
  {
    icon: <Briefcase />,
    title: "RECRUITMENT OFFERS",
    description:
      "Best performers will get recruitment offers from prestigious companies.",
  },
  {
    icon: <Share2 />,
    title: "EXPAND NETWORK",
    description:
      "Connect with industry professionals and founders and other tech teams and grow more.",
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
