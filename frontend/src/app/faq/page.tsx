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
          <div className="mb-16 text-center">
            <div className="mb-8 inline-block rounded-full border border-white/30 bg-white/10 px-20 py-3 backdrop-blur-sm">
              <span className="font-sans text-lg font-bold tracking-tighter text-white">
                EVERYTHING YOU NEED TO KNOW
              </span>
            </div>

            <h1 className="font-nortune mb-6 text-7xl tracking-wide text-white md:text-8xl lg:text-9xl">
              FAQs
            </h1>

            <p className="mx-auto max-w-2xl text-lg font-extrabold tracking-tighter text-white/80">
              HAVE QUESTIONS ABOUT THE HACKATHON? EXPLORE OUR FAQ BELOW!
            </p>
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
