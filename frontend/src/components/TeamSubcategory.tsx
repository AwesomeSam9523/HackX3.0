import React from "react";
import TeamMemberCard from "./TeamMemberCard";
import { TeamSubcategory } from "../../types/team";

interface TeamSubcategoryProps {
  subcategory: TeamSubcategory;
}

const TeamSubcategoryComponent: React.FC<TeamSubcategoryProps> = ({
  subcategory,
}) => {
  const memberRows = [];
  for (let i = 0; i < subcategory.members.length; i += 3) {
    memberRows.push(subcategory.members.slice(i, i + 3));
  }

  return (
    <div className="mb-16">
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

          <h3 className="text-offwhite text-xl font-bold tracking-wider">
            {subcategory.title}
          </h3>
        </div>
      </div>

      <div className="space-y-8">
        {memberRows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="mx-auto flex flex-wrap items-center justify-center gap-8"
          >
            {row.map((member) => (
              <div key={member.id} className="w-full max-w-sm md:w-auto">
                <TeamMemberCard member={member} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamSubcategoryComponent;
