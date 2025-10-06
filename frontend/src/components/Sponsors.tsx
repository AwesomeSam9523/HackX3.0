import Image from "next/image";
import React from "react";

interface SponsorLogo {
  src: string;
  alt: string;
  width: number;
  height: number;
}

const sponsorLogos: SponsorLogo[] = [
  { src: "sponsor1.svg", alt: "Casio", width: 120, height: 30 },
  { src: "sponsor2.svg", alt: "Radio Manipal Jaipur", width: 120, height: 30 },
  { src: "sponsor3.svg", alt: "Femease", width: 140, height: 30 },
  { src: "sponsor4.svg", alt: "ED Times", width: 100, height: 30 },
  { src: "sponsor5.svg", alt: "Manipal Hospitals", width: 130, height: 30 },
  { src: "sponsor6.svg", alt: "Programming Pathshala", width: 110, height: 30 },
  { src: "sponsor7.svg", alt: "Threeway Studio", width: 120, height: 30 },
  { src: "sponsor8.svg", alt: "E-cell", width: 100, height: 30 },
  { src: "sponsor9.svg", alt: "", width: 140, height: 30 },
  { src: "sponsor10.svg", alt: "Herody", width: 140, height: 30 },
  { src: "sponsor11.svg", alt: "Oracle Academy", width: 140, height: 30 },
  { src: "sponsor12.svg", alt: "", width: 140, height: 30 },
  { src: "sponsor13.svg", alt: "", width: 140, height: 30 },
  { src: "sponsor14.svg", alt: "", width: 140, height: 30 },
  { src: "sponsor15.svg", alt: "", width: 140, height: 30 },
  { src: "sponsor16.svg", alt: "", width: 140, height: 30 },
  { src: "sponsor17.svg", alt: "", width: 140, height: 30 },
  { src: "sponsor18.svg", alt: "", width: 140, height: 30 },
  { src: "sponsor19.svg", alt: "", width: 140, height: 30 },
  { src: "sponsor20.svg", alt: "", width: 140, height: 30 },
  { src: "sponsor21.svg", alt: "", width: 140, height: 30 },
  { src: "sponsor22.svg", alt: "", width: 140, height: 30 },
];

const Sponsors: React.FC = () => {
  return (
    <section className="text-offwhite relative overflow-hidden py-16 lg:px-8">
      {/* Corner decorative elements */}
      <div className="absolute top-8 left-32 hidden h-8 w-8 border-t-4 border-l-4 border-white md:block"></div>
      <div className="absolute top-8 right-32 hidden h-8 w-8 border-t-4 border-r-4 border-white md:block"></div>
      <div className="absolute bottom-8 left-32 hidden h-8 w-8 border-b-4 border-l-4 border-white md:block"></div>
      <div className="absolute right-32 bottom-8 hidden h-8 w-8 border-r-4 border-b-4 border-white md:block"></div>

      <div className="mx-auto max-w-6xl text-center">
        {/* Sponsors header with corner decorations */}
        <div className="relative mb-12 inline-block px-8 py-4">
          {/* Corner decorative elements for sponsors heading */}
          <div className="absolute top-0 left-0 h-4 w-4 border-t-4 border-l-4 border-white"></div>
          <div className="absolute top-0 right-0 h-4 w-4 border-t-4 border-r-4 border-white"></div>
          <div className="absolute bottom-0 left-0 h-4 w-4 border-b-4 border-l-4 border-white"></div>
          <div className="absolute right-0 bottom-0 h-4 w-4 border-r-4 border-b-4 border-white"></div>

          <h2 className="text-2xl font-bold tracking-tighter md:text-4xl">
            SPONSORS
          </h2>
        </div>

        {/* Main heading */}
        <h1 className="leading-wide font-kinetikaUltra mb-16 text-center text-3xl md:text-5xl lg:text-6xl">
          <span className="block">POWERED BY</span>
          <span className="block">WORLD CLASS TEAMS</span>
          <span className="block">AND COMPANIES!</span>
        </h1>

        {/* Sponsor logos grid */}
        <div className="overflow-hidden">
          <div className="animate-scroll flex w-max gap-6 opacity-80">
            {[...sponsorLogos, ...sponsorLogos].map((logo, index) => (
              <div
                key={index}
                className="flex min-w-[100px] items-center justify-center px-4"
              >
                <Image
                  src={`/sponsors/${logo.src}`}
                  className="h-12 w-auto"
                  alt={logo.alt}
                  width={logo.width}
                  height={logo.height}
                  priority={true}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Sponsors;
