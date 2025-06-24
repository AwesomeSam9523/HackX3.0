import Image from 'next/image';

interface SponsorLogo {
  src: string;
  alt: string;
  width: number;
  height: number;
}

const sponsorLogos: SponsorLogo[] = [
  { src: 'axure.svg', alt: 'Axure', width: 120, height: 40 },
  { src: 'oracle.svg', alt: 'Oracle Academy', width: 140, height: 40 },
  { src: 'cdcc.svg', alt: 'CDGC', width: 100, height: 40 },
  { src: 'bikesetu.svg', alt: 'BikeSetu', width: 130, height: 40 },
  { src: 'radio.svg', alt: 'Pin Store', width: 110, height: 40 },
  { src: 'bobble.svg', alt: 'Bobble AI', width: 120, height: 40 },
  { src: 'ed.svg', alt: 'EDU', width: 100, height: 40 },
  { src: 'designstudio.svg', alt: 'Design Studio', width: 140, height: 40 },
];

const Sponsors: React.FC = () => {
  return (
    <section className=" text-white py-16 px-8 relative overflow-hidden">
      {/* Corner decorative elements */}
      <div className="absolute top-8 left-8 w-8 h-8 border-l-4 border-t-4 border-white "></div>
      <div className="absolute top-8 right-8 w-8 h-8 border-r-4 border-t-4 border-white "></div>
      <div className="absolute bottom-8 left-8 w-8 h-8 border-l-4 border-b-4 border-white "></div>
      <div className="absolute bottom-8 right-8 w-8 h-8 border-r-4 border-b-4 border-white "></div>
      
      <div className="max-w-6xl mx-auto text-center">
        {/* Sponsors header with corner decorations */}
        <div className="relative inline-block mb-12 px-8 py-4">
          {/* Corner decorative elements for sponsors heading */}
          <div className="absolute top-0 left-0 w-4 h-4 border-l-4 border-t-4 border-white "></div>
          <div className="absolute top-0 right-0 w-4 h-4 border-r-4 border-t-4 border-white "></div>
          <div className="absolute bottom-0 left-0 w-4 h-4 border-l-4 border-b-4 border-white "></div>
          <div className="absolute bottom-0 right-0 w-4 h-4 border-r-4 border-b-4 border-white "></div>
          
          <h2 className="text-4xl font-bold tracking-tighter">SPONSORS</h2>
        </div>
        
        {/* Main heading */}
        <h1 className="text-5xl md:text-6xl lg:text-8xl font-bold mb-16 leading-tighter">
          <span className="block">POWERED BY</span>
          <span className="block">WORLD CLASS TEAMS</span>
          <span className="block">AND COMPANIES!</span>
        </h1>
        
        {/* Sponsor logos grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-8 items-center justify-items-center opacity-80">
          {sponsorLogos.map((logo, index) => (
            <div key={index} className="flex items-center justify-center">
              <Image
                src={logo.src}
                alt={logo.alt}
                width={logo.width}
                height={logo.height}
                className="filter brightness-0 invert opacity-70 hover:opacity-100 transition-opacity duration-300"
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