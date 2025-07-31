import React from "react";
import LightBlock from "./LightBlock";

const LightBoxTeams = (props: { name: string }) => {
  if (props.name === "FACULTY" || props.name === "EXECUTIVE") {
    return (
      <>
        {/*ligthboxes desktop right*/}
        <div className="absolute top-[30rem] -right-10 -z-10 hidden h-[20rem] w-1/2 opacity-80 md:block">
          <LightBlock position="right" />
        </div>
        <div className="absolute top-[130rem] -right-10 -z-10 hidden h-[20rem] w-1/2 opacity-80 md:block">
          <LightBlock position="right" />
        </div>
        {/*lightbox desktop left*/}
        <div className="absolute top-[85rem] -left-100 -z-10 hidden h-[20rem] w-2/2 opacity-80 md:block">
          <LightBlock position="left" />
        </div>
        <div className="absolute top-[175rem] -left-100 -z-10 hidden h-[20rem] w-2/2 opacity-80 md:block">
          <LightBlock position="left" />
        </div>

        {/*ligthboxes mobile right*/}
        <div className="absolute top-[105rem] -right-60 -z-10 h-[20rem] w-200 opacity-90 md:hidden">
          <LightBlock position="right" />
        </div>
        <div className="absolute top-[215rem] -right-60 -z-10 h-[20rem] w-200 opacity-90 md:hidden">
          <LightBlock position="right" />
        </div>
        <div className="absolute top-[330rem] -right-60 -z-10 h-[20rem] w-200 opacity-90 md:hidden">
          <LightBlock position="right" />
        </div>

        {/*lightbox mobile left*/}
        <div className="absolute top-[75rem] -left-100 -z-10 h-[20rem] w-200 opacity-100 md:hidden">
          <LightBlock position="left" />
        </div>
        <div className="absolute top-[185rem] -left-100 -z-10 h-[20rem] w-200 opacity-100 md:hidden">
          <LightBlock position="left" />
        </div>
        <div className="absolute top-[300rem] -left-100 -z-10 h-[20rem] w-200 opacity-100 md:hidden">
          <LightBlock position="left" />
        </div>
        <div className="absolute top-[410rem] -left-100 -z-10 h-[20rem] w-200 opacity-100 md:hidden">
          <LightBlock position="left" />
        </div>
      </>
    );
  } else if (props.name === "CORE") {
    return (
      <>
        {/*lightbox desktop right*/}
        <div className="absolute top-[30rem] -right-10 -z-10 hidden h-[20rem] w-1/2 opacity-80 md:block">
          <LightBlock position="right" />
        </div>
      </>
    );
  }

  return null;
};

export default LightBoxTeams;
