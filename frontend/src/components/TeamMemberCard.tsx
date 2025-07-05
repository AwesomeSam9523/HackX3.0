import React from "react";
import { TeamMember } from "../../types/team";
import Image from "next/image";

interface TeamMemberCardProps {
  member: TeamMember;
}

const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ member }) => {
  return (
    <div className="transform rounded-2xl bg-[#2a3041] p-6 text-center transition-all duration-300 hover:scale-105 hover:shadow-2xl">
      <div className="mx-auto mb-4 h-72 w-72 overflow-hidden rounded-2xl bg-gray-800">
        <Image
          src={member.image}
          alt={member.name}
          height={400}
          width={100}
          className="h-full w-full object-cover"
        />
      </div>
      <h3 className="mb-2 text-2xl font-extrabold tracking-tighter text-white">
        {member.name}
      </h3>
      <p className="mb-4 text-sm font-extrabold whitespace-pre-line text-gray-300">
        {member.position}
      </p>
      {member.linkedinUrl && (
        <a
          href={member.linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-tansparent inline-flex h-10 w-10 items-center justify-center rounded-full border-1 border-white transition-colors duration-300"
        >
          <Image
            src={"/linkedin.png"}
            alt="linkedin"
            height={15}
            width={15}
            className="object-cover"
          />
        </a>
      )}
    </div>
  );
};

export default TeamMemberCard;
