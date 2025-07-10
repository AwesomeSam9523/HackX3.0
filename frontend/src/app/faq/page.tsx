import FAQClient from "@/components/FAQClient";
import Navbar from "@/components/Navbar";
import XComponent from "@/components/XComponent";
import { faqs } from "../../../data/faqData";

const Page = () => {
  return (
    <>
      {/* Fixed background image */}
      <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-blue-500 via-black to-black">
        <XComponent />
        <div className="relative z-10 container mx-auto px-4">
          <Navbar />

          {/* Header section */}
          <div className="flex flex-col items-center justify-center gap-5">
            <button className="font-avgardn mt-4 mt-20 rounded-full border-2 border-white bg-transparent px-10 py-3 text-lg font-bold tracking-wider text-white uppercase transition-all duration-300">
              HERE&apos;S HOW THE EVENT WILL PROGRESS
            </button>
            <div className="font-kinetikaUltra mb-8 text-center text-5xl leading-[79.9%] font-black text-white md:text-6xl">
              TIMELINE
            </div>
          </div>

          <FAQClient faqs={faqs} />

          {/* Footer text */}
          <div className="mt-16 pb-16 text-center">
            <p className="text-lg font-extrabold tracking-tighter text-white">
              NEED FURTHER ASSISTANCE? DON&apos;T HESITATE TO REACH OUT TO OUR
              TEAM.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
