import React from "react";
import { TeamMember } from "../../types/team";
import Image from "next/image";

interface TeamMemberCardProps {
  member: TeamMember;
}

const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ member }) => {
  // Helper function to create social media links
  const renderSocialLink = (url: string, iconSrc: string, alt: string) => (
    <a
      key={url}
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex h-8 w-8 items-center justify-center transition-all duration-300 ease-in-out"
    >
      <Image
        src={iconSrc}
        alt={alt}
        height={16}
        width={16}
        className="object-cover transition-transform duration-300 ease-in-out"
      />
    </a>
  );

  // Helper function to create phone link (with key)
  const renderPhoneLink = (phoneNumber: string) => (
    <a
      key={phoneNumber}
      href={`tel:${phoneNumber}`}
      className="inline-flex h-8 w-8 items-center justify-center transition-all duration-300 ease-in-out hover:scale-105"
    >
      <Image
        src="/phone.svg"
        alt="phone"
        height={16}
        width={16}
        className="object-cover transition-transform duration-300 ease-in-out"
      />
    </a>
  );

  // Collect all available social links
  const socialLinks = [
    member.instagramUrl &&
      renderSocialLink(member.instagramUrl, "/instagram.svg", "instagram"),
    member.linkedinUrl &&
      renderSocialLink(member.linkedinUrl, "/linkedin.svg", "linkedin"),
    member.githubUrl &&
      renderSocialLink(member.githubUrl, "/github.svg", "github"),
    member.phoneNumber && renderPhoneLink(member.phoneNumber),
  ].filter(Boolean); // Remove null/undefined values

  return (
    <div className="transform rounded-2xl border border-white/20 bg-white/10 p-6 text-center shadow-xl backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-white/30 hover:bg-white/15 hover:shadow-2xl">
      <div className="mx-auto mb-4 h-64 w-full overflow-hidden rounded-2xl border border-white/10 bg-gray-800/50 backdrop-blur-sm">
        <Image
          src={member.image}
          alt={member.name}
          height={400}
          width={100}
          className="h-full w-full object-cover"
        />
      </div>
      <h3 className="text-offwhite mb-2 text-2xl font-extrabold tracking-tighter drop-shadow-lg">
        {member.name}
      </h3>
      <p className="mb-4 text-sm font-extrabold whitespace-pre-line text-gray-200 drop-shadow-md">
        {member.position}
      </p>
      {/* Social Media Icons - Pill-shaped container design */}
      {socialLinks.length > 0 && (
        <div className="mt-4 flex items-center justify-center">
          <div className="flex items-center justify-center gap-1 rounded-full border-2 border-white/30 bg-white/10 px-1 py-1 backdrop-blur-sm transition-all duration-300 hover:border-white/50 hover:bg-white/20">
            {socialLinks}
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamMemberCard;
