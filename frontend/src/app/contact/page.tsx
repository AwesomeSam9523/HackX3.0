import FAQClient from "@/components/FAQClient";
import Navbar from "@/components/Navbar";
import { faqs } from "../../../data/faqData";
import Venue from "@/components/Venue";
import VenueContact from "@/components/VenueContact";
import Background from "@/components/Background";
import LightBoxOthers from "@/components/LightBoxOthers";

const Page = () => {
  return (
    <div className="relative w-[100%] overflow-x-clip">
      {/*<XComponent />*/}
      <Background />

      <div className="relative container mx-auto min-h-screen items-center bg-transparent px-4">
        <Navbar />
        <div className="relative z-10 mt-10 flex min-h-[80vh] flex-col items-center justify-center px-4 text-center lg:px-8">
          <div className="text-offwhite flex flex-col items-center justify-center gap-5">
            <button className="font-avgardn rounded-full border-2 border-white bg-transparent px-10 py-3 text-lg font-bold tracking-wider uppercase transition-all duration-300 lg:mt-20">
              HOW CAN WE HELP YOU ?
            </button>
            <div className="font-kinetikaUltra mb-8 text-center text-5xl leading-[79.9%] font-black md:text-6xl">
              CONTACT US
            </div>
          </div>
          {/* Transport cards + Map  */}
          <Venue />
          {/* Lightbox */}
          <LightBoxOthers name="contact" id={0} />
          {/* FAQ Section */}

          <FAQClient faqs={faqs} />
          {/*Contact Section */}
          <VenueContact />
        </div>
        {/* Header section */}
      </div>
    </div>
  );
};

export default Page;
