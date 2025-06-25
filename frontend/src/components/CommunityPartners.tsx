import React from "react";

const CommunityPartners: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-black px-8 py-16 text-white">
      {/* Corner decorative elements */}
      <div className="absolute top-50 right-325 h-8 w-8 border-t-4 border-l-4 border-white"></div>
      <div className="absolute top-50 right-30 h-8 w-8 border-t-4 border-r-4 border-white"></div>
      <div className="absolute right-325 bottom-8 h-8 w-8 border-b-4 border-l-4 border-white"></div>
      <div className="absolute right-30 bottom-8 h-8 w-8 border-r-4 border-b-4 border-white"></div>

      <div className="mx-auto max-w-6xl text-center">
        {/* Main heading */}
        <h1 className="mb-16 text-5xl font-extrabold tracking-tight md:text-6xl lg:text-7xl">
          COMMUNITY PARTNERS
        </h1>
        {/* Empty area for future partner logos */}
        <div className="flex h-64 items-center justify-center md:h-80 lg:h-96">
          {/* Placeholder for logos */}
        </div>
      </div>
    </section>
  );
};

export default CommunityPartners;
