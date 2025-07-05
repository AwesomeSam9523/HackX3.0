import React from "react";

const CommunityPartners: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-black px-8 pt-0 pb-16 text-white">
      {/* Ellipse background in top left corner */}
      {/* <div
        style={{
          width: '728px',
          height: '728px',
          position: 'absolute',
          top: '-120px',
          left: '-150px',
          filter: 'blur(100px)',
          borderRadius: '50%',
          background: 'radial-gradient(50% 50% at 50% 50%, #1a252f, #111)',
          zIndex: 0,
          opacity: 0.8,
        }}
        aria-hidden="true"
      ></div> */}
      {/* Bottom right ellipse background */}
      {/* <div
        style={{
          width: '728px',
          height: '728px',
          position: 'absolute',
          bottom: '-120px',
          right: '-150px',
          filter: 'blur(100px)',
          borderRadius: '50%',
          background: 'radial-gradient(50% 50% at 50% 50%, #1a252f, #111)',
          zIndex: 0,
          opacity: 0.8,
        }}
        aria-hidden="true"
      ></div> */}
      {/* Corner decorative elements */}
      {/* Top left corner (desktop) */}
      <div
        className="absolute top-50 hidden h-8 w-8 border-t-4 border-l-4 border-white md:block"
        style={{ left: "150px" }}
      ></div>
      {/* Top left corner (mobile) */}
      <div className="absolute top-4 left-4 h-6 w-6 border-t-2 border-l-2 border-white md:hidden"></div>

      {/* Top right corner (desktop) */}
      <div
        className="absolute top-50 hidden h-8 w-8 border-t-4 border-r-4 border-white md:block"
        style={{ right: "150px" }}
      ></div>
      {/* Top right corner (mobile) */}
      <div className="absolute top-4 right-4 h-6 w-6 border-t-2 border-r-2 border-white md:hidden"></div>

      {/* Bottom left corner (desktop) */}
      <div
        className="absolute bottom-8 hidden h-8 w-8 border-b-4 border-l-4 border-white md:block"
        style={{ left: "150px" }}
      ></div>
      {/* Bottom left corner (mobile) */}
      <div className="absolute bottom-4 left-4 h-6 w-6 border-b-2 border-l-2 border-white md:hidden"></div>

      {/* Bottom right corner (desktop) */}
      <div
        className="absolute bottom-8 hidden h-8 w-8 border-r-4 border-b-4 border-white md:block"
        style={{ right: "150px" }}
      ></div>
      {/* Bottom right corner (mobile) */}
      <div className="absolute right-4 bottom-4 h-6 w-6 border-r-2 border-b-2 border-white md:hidden"></div>

      <div className="mx-auto max-w-6xl text-center">
        {/* Main heading */}
        <h1 className="mb-16 font-['Kinetika',sans-serif] text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl">
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
