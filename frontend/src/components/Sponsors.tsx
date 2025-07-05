import Image from "next/image";

interface SponsorLogo {
  src: string;
  alt: string;
  width: number;
  height: number;
}

const sponsorLogos: SponsorLogo[] = [
  { src: "axure.svg", alt: "Axure", width: 120, height: 40 },
  { src: "oracle.svg", alt: "Oracle Academy", width: 140, height: 40 },
  { src: "cdcc.svg", alt: "CDGC", width: 100, height: 40 },
  { src: "bikesetu.svg", alt: "BikeSetu", width: 130, height: 40 },
  { src: "radio.svg", alt: "Pin Store", width: 110, height: 40 },
  { src: "bobble.svg", alt: "Bobble AI", width: 120, height: 40 },
  { src: "ed.svg", alt: "EDU", width: 100, height: 40 },
  { src: "designstudio.svg", alt: "Design Studio", width: 140, height: 40 },
];

const Sponsors: React.FC = () => {
  return (
    <section className="relative overflow-hidden px-8 py-16 text-white">
      {/* Corner decorative elements */}
      <div className="absolute top-8 left-8 hidden h-8 w-8 border-t-4 border-l-4 border-white md:block"></div>
      <div className="absolute top-8 right-8 hidden h-8 w-8 border-t-4 border-r-4 border-white md:block"></div>
      <div className="absolute bottom-8 left-8 hidden h-8 w-8 border-b-4 border-l-4 border-white md:block"></div>
      <div className="absolute right-8 bottom-8 hidden h-8 w-8 border-r-4 border-b-4 border-white md:block"></div>

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
        <h1 className="leading-wide font-nortune mb-16 text-center text-5xl font-bold md:text-6xl lg:text-9xl">
          <span className="block">POWERED BY</span>
          <span className="block">WORLD CLASS TEAMS</span>
          <span className="block">AND COMPANIES!</span>
        </h1>

        {/* Sponsor logos grid */}
        <div className="grid grid-cols-2 items-center justify-items-center gap-8 opacity-80 md:grid-cols-4 lg:grid-cols-8">
          {sponsorLogos.map((logo, index) => (
            <div key={index} className="flex items-center justify-center">
              <Image
                src={logo.src}
                alt={logo.alt}
                width={logo.width}
                height={logo.height}
                className="opacity-70 brightness-0 invert filter transition-opacity duration-300 hover:opacity-100"
                priority={index < 4} // Prioritize first 4 logos for faster loading
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Sponsors;
