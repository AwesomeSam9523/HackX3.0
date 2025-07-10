import FAQClient from "@/components/FAQClient";
import Navbar from "@/components/Navbar";
import XComponent from "@/components/XComponent";
import { faqs } from "../../../data/faqData";
import Venue from "@/components/Venue";
import VenueContact from "@/components/VenueContact";

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
              HOW CAN WE HELP YOU ?
            </button>
            <div className="font-kinetikaUltra mb-8 text-center text-5xl leading-[79.9%] font-black text-white md:text-6xl">
              CONTACT US
            </div>
          </div>
          {/* Transport cards + Map  */}
          <Venue />

          {/* FAQ Section */}

          <FAQClient faqs={faqs} />
          {/*Contact Section */}
          <VenueContact />
        </div>
      </div>
    </>
  );
};

export default Page;
