import LightBlock from "./LightBlock";

const LightBoxOthers = (props: { name: string; id: number }) => {
  if (props.name.toLocaleLowerCase() === "home") {
    // Home :
    return (
      <>
        {/*lightbox mobile left*/}
        <div className="absolute top-[52rem] -left-80 -z-10 h-[20rem] w-250 opacity-80 md:hidden">
          <LightBlock position="left" />
        </div>
        {/*lightbox mobile right*/}
        <div className="absolute top-[78rem] -right-38 -z-10 h-[20rem] w-250 opacity-70 md:hidden">
          <LightBlock position="right" />
        </div>
        {/*lightbox mobile right*/}
        <div className="absolute top-[192rem] -right-25 -z-10 h-[20rem] w-130 opacity-75 md:hidden">
          <LightBlock position="right" />
        </div>

        {/*lightbox desktop right*/}
        <div className="absolute top-[69rem] right-0 -z-10 hidden h-[20rem] w-1/2 opacity-70 md:block">
          <LightBlock position="right" />
        </div>
        {/*lightbox desktop left*/}
        <div className="absolute top-[150rem] left-0 -z-10 hidden h-[20rem] w-250 opacity-75 md:block">
          <LightBlock position="left" />
        </div>
        {/*lightbox desktop right*/}
        <div className="absolute top-[179rem] right-0 -z-10 hidden h-[20rem] w-130 opacity-65 md:block">
          <LightBlock position="right" />
        </div>
      </>
    );
  } else if (props.name.toLowerCase() === "timeline") {
    // Timeline :
    return (
      <>
        {/*lightbox mobile view*/}
        <div className="absolute top-[76rem] -left-80 -z-10 h-[20rem] w-230 opacity-80 md:hidden">
          <LightBlock position="left" />
        </div>
      </>
    );
  } else if (props.name.toLowerCase() === "ambassador") {
    // Ambassador :
    return (
      <>
        {/*lightbox desktop right*/}
        <div className="absolute top-[105rem] -right-10 -z-10 hidden h-[20rem] w-1/2 opacity-45 md:block">
          <LightBlock position="right" />
        </div>

        {/*lightbox mobile right*/}
        <div className="absolute top-[110rem] -right-60 -z-10 h-[20rem] w-300 opacity-60 md:hidden">
          <LightBlock position="right" />
        </div>

        {/*lightbox desktop left*/}
        <div className="absolute top-[50rem] -left-100 -z-10 hidden h-[20rem] w-2/2 opacity-65 md:block">
          <LightBlock position="left" />
        </div>
        <div className="absolute top-[150rem] -left-100 -z-10 hidden h-[20rem] w-2/2 opacity-60 md:block">
          <LightBlock position="left" />
        </div>

        {/*lightbox mobile left*/}
        <div className="absolute top-[60rem] -left-180 -z-10 h-[20rem] w-400 opacity-100 md:hidden">
          <LightBlock position="left" />
        </div>
        <div className="absolute top-[180rem] -left-180 -z-10 h-[20rem] w-400 opacity-85 md:hidden">
          <LightBlock position="left" />
        </div>
      </>
    );
  } else if (props.name.toLowerCase() === "about") {
    // About Us :
    if (props.id === 1) {
      // Community Partners :
      return (
        <>
          {/*Lightbox desktop view*/}
          {/*left */}
          <div className="absolute -top-[40rem] left-0 z-0 hidden h-[20rem] w-1/2 opacity-50 md:block">
            <LightBlock position="left" />
          </div>
          {/*right*/}
          <div className="absolute top-[3rem] right-0 z-0 hidden h-[20rem] w-110 opacity-50 md:block">
            <LightBlock position="right" />
          </div>

          {/*Lightbox mobile view */}
          <div className="absolute -top-[6.5rem] -right-15 z-0 h-[20rem] w-120 opacity-50 md:hidden">
            <LightBlock position="right" />
          </div>
        </>
      );
    } else if (props.id === 2) {
      // Hackathon Stats :
      return (
        <>
          {/*lightbox right mobile */}
          <div className="absolute top-[130rem] right-0 -z-10 h-[20rem] w-110 opacity-75 md:block">
            <LightBlock position="right" />
          </div>
        </>
      );
    }
  } else if (props.name.toLowerCase() === "contact") {
    // Contact :
    return (
      <>
        {/*lightbox mobile right*/}
        <div className="absolute top-[110rem] -right-60 -z-10 h-[20rem] w-300 opacity-100 md:hidden">
          <LightBlock position="right" />
        </div>
        {/*lightbox mobile left*/}
        <div className="absolute top-[60rem] -left-180 -z-10 h-[20rem] w-400 opacity-100 md:hidden">
          <LightBlock position="left" />
        </div>
      </>
    );
  }
};

export default LightBoxOthers;
