import React from "react";

const CommunityPartners: React.FC = () => {
  return (
    <section className="text-offwhite relative overflow-hidden bg-black px-8 pt-0 pb-16">
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
      <div className="absolute top-32 left-12 hidden h-8 w-8 border-t-2 border-l-2 border-white md:block"></div>
      {/* Top left corner (mobile) */}
      <div className="absolute top-24 left-8 h-6 w-6 border-t-2 border-l-2 border-white md:hidden"></div>

      {/* Top right corner (desktop) */}
      <div className="absolute top-32 right-12 hidden h-8 w-8 border-t-2 border-r-2 border-white md:block"></div>
      {/* Top right corner (mobile) */}
      <div className="absolute top-24 right-8 h-6 w-6 border-t-2 border-r-2 border-white md:hidden"></div>

      {/* Bottom left corner (desktop) */}
      <div className="absolute bottom-32 left-12 hidden h-8 w-8 border-b-2 border-l-2 border-white md:block"></div>
      {/* Bottom left corner (mobile) */}
      <div className="absolute bottom-20 left-8 h-6 w-6 border-b-2 border-l-2 border-white md:hidden"></div>

      {/* Bottom right corner (desktop) */}
      <div className="absolute right-12 bottom-32 hidden h-8 w-8 border-r-2 border-b-2 border-white md:block"></div>
      {/* Bottom right corner (mobile) */}
      <div className="absolute right-8 bottom-20 h-6 w-6 border-r-2 border-b-2 border-white md:hidden"></div>

      <div className="mx-auto max-w-6xl text-center">
        {/* Main heading */}
        <h1 className="font-kinetikaUltra mb-16 text-5xl leading-[80%] font-bold tracking-normal md:text-6xl lg:text-7xl">
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
