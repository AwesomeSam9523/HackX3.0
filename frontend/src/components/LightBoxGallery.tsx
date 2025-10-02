import React from "react";
import LightBlock from "./LightBlock";

const LightBoxGallery = () => {
  return (
    <>
      {/*ligthboxes desktop right*/}
      <div className="absolute top-[20rem] -right-10 -z-10 hidden h-[20rem] w-1/2 opacity-80 md:block">
        <LightBlock position="right" />
      </div>
      {/*<div className="absolute top-[130rem] hidden -right-10 opacity-80 -z-10 h-[20rem] w-1/2 md:block">
                    <LightBlock position="right" />
                </div>*/}
      {/*lightbox desktop left*/}
      <div className="absolute top-[53rem] -left-100 -z-10 hidden h-[20rem] w-2/2 opacity-80 md:block">
        <LightBlock position="left" />
      </div>
      {/*<div className="absolute top-[175rem] opacity-80 hidden -left-100 -z-10 h-[20rem] w-2/2 md:block">
                    <LightBlock position="left" />
                </div>*/}

      {/*ligthboxes mobile right*/}
      <div className="absolute top-[94rem] -right-60 -z-10 h-[20rem] w-200 opacity-70 md:hidden">
        <LightBlock position="right" />
      </div>
      {/*<div className="absolute top-[215rem] -right-60 opacity-80 -z-10 h-[20rem] w-200 md:hidden">
                    <LightBlock position="right" />
                </div>
                <div className="absolute top-[330rem] -right-60 opacity-80 -z-10 h-[20rem] w-200 md:hidden">
                    <LightBlock position="right" />
                </div>*/}

      {/*lightbox mobile left*/}
      <div className="absolute top-[75rem] -left-100 -z-10 h-[20rem] w-200 opacity-100 md:hidden">
        <LightBlock position="left" />
      </div>
      {/*<div className="absolute top-[185rem] opacity-100 -left-100 -z-10 h-[20rem] w-200 md:hidden">
                    <LightBlock position="left" />
                </div>
                <div className="absolute top-[300rem] opacity-100 -left-100 -z-10 h-[20rem] w-200 md:hidden">
                    <LightBlock position="left" />
                </div>
                <div className="absolute top-[410rem] opacity-100 -left-100 -z-10 h-[20rem] w-200 md:hidden">
                    <LightBlock position="left" />
                </div>*/}
    </>
  );
};

export default LightBoxGallery;
