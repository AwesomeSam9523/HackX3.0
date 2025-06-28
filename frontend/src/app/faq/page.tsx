import FAQClient from "@/components/FAQClient";
import Navbar from "@/components/Navbar";
import Image from "next/image";

const faqs = [
  {
    id: 1,
    question: "HOW DO I REGISTER ?",
    answer:
      "To register for the hackathon, click the 'REGISTER NOW' button and fill out the registration form with your details.",
  },
  {
    id: 2,
    question: "HOW MANY TEAM MEMBERS DO I NEED?",
    answer:
      "Teams can consist of 2-4 members. You can also participate as an individual and we'll help you find teammates.",
  },
  {
    id: 3,
    question: "HOW MUCH IS THE PARTICIPATION FEES?",
    answer:
      "The participation fee varies by category. Please check the registration page for current pricing details.",
  },
  {
    id: 4,
    question: "WILL THE HACKATHON BE IN PERSON OR ONLINE ?",
    answer:
      "This hackathon will be conducted in a hybrid format - both in-person and online participation options are available.",
  },
  {
    id: 5,
    question: "WHAT IS THE VENUE FOR MUJHACKX 2.0 ?",
    answer:
      "The in-person venue details will be shared with registered participants via email closer to the event date.",
  },
  {
    id: 6,
    question: "WHAT ARE THE PREREQUISITES TO PARTICIPATE IN THIS HACKATHON ?",
    answer:
      "Basic programming knowledge and enthusiasm to learn and build innovative solutions. All skill levels are welcome!",
  },
  {
    id: 7,
    question:
      "CAN MY FRIEND JOIN OUR TEAM AFTER WE HAVE ALREADY SUBMITTED THE APPLICATION FOR REVIEW ?",
    answer:
      "Yes, team modifications are possible before the final deadline. Please contact our support team for assistance with team changes.",
  },
];

const Page = () => {
  return (
    <>
      {/* Fixed background image */}
      <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-blue-500 via-black to-black">
        <div className="pointer-events-none fixed inset-0 z-0 h-full w-full">
          <Image
            src="/x2.png"
            alt="Background decoration"
            width={384}
            height={384}
            className="h-full w-full object-contain opacity-50"
            priority
          />
        </div>
        <div className="relative z-10 container mx-auto px-4">
          <Navbar />

          {/* Header section */}
          <div className="mb-16 text-center">
            <div className="mb-8 inline-block rounded-full border border-white/30 bg-white/10 px-20 py-3 backdrop-blur-sm">
              <span className="font-sans text-lg font-bold tracking-tighter text-white">
                EVERYTHING YOU NEED TO KNOW
              </span>
            </div>

            <h1 className="mb-6 text-7xl font-extrabold tracking-wide font-nortune text-white md:text-8xl lg:text-9xl">
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
