"use client"
import Navbar from '@/components/navbar';
import Image from 'next/image';
import { useState, useEffect } from 'react';


const Page = () => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  useEffect(() => {
    // Override body background for this component
    document.body.style.background = 'transparent';
    
    return () => {
      // Reset body background when component unmounts
      document.body.style.background = '';
    };
  }, []);

  const faqs = [
    {
      id: 1,
      question: "HOW DO I REGISTER ?",
      answer: "To register for the hackathon, click the 'REGISTER NOW' button and fill out the registration form with your details."
    },
    {
      id: 2,
      question: "HOW MANY TEAM MEMBERS DO I NEED?",
      answer: "Teams can consist of 2-4 members. You can also participate as an individual and we'll help you find teammates."
    },
    {
      id: 3,
      question: "HOW MUCH IS THE PARTICIPATION FEES?",
      answer: "The participation fee varies by category. Please check the registration page for current pricing details."
    },
    {
      id: 4,
      question: "WILL THE HACKATHON BE IN PERSON OR ONLINE ?",
      answer: "This hackathon will be conducted in a hybrid format - both in-person and online participation options are available."
    },
    {
      id: 5,
      question: "WHAT IS THE VENUE FOR MUJHACKX 2.0 ?",
      answer: "The in-person venue details will be shared with registered participants via email closer to the event date."
    },
    {
      id: 6,
      question: "WHAT ARE THE PREREQUISITES TO PARTICIPATE IN THIS HACKATHON ?",
      answer: "Basic programming knowledge and enthusiasm to learn and build innovative solutions. All skill levels are welcome!"
    },
    {
      id: 7,
      question: "CAN MY FRIEND JOIN OUR TEAM AFTER WE HAVE ALREADY SUBMITTED THE APPLICATION FOR REVIEW ?",
      answer: "Yes, team modifications are possible before the final deadline. Please contact our support team for assistance with team changes."
    }
  ];

  const toggleFAQ = (id: number) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  return (
    <div className=" bg-gradient-to-b from-blue-500 via-blue-800  to-black relative overflow-hidden w-full">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-full h-full center">
        <Image
          src="/x2.png" // Replace this with your actual SVG path
          alt="Background decoration"
          width={384}
          height={384}
          className="w-full h-full object-contain opacity-50"
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-4 ">
        {/* Navbar component placed here */}
        <Navbar />
        
        {/* Header section */}
        <div className="text-center mb-16">
          <div className="inline-block px-20 py-3 rounded-full  border border-white/30 bg-white/10 backdrop-blur-sm mb-8">
            <span className="text-white text-lg font-extrabold tracking-tighter">
              EVERYTHING YOU NEED TO KNOW!
            </span>
          </div>
          
          <h1 className="text-7xl font-extrabold md:text-8xl lg:text-9xl text-white mb-6 tracking-tighter">
            FAQs
          </h1>
          
          <p className="text-white/80 text-lg font-extrabold max-w-2xl mx-auto tracking-tighter">
            HAVE QUESTIONS ABOUT THE HACKATHON? EXPLORE OUR FAQ BELOW!
          </p>
        </div>

        {/* FAQ Items */}
        <div className="max-w-4xl mx-auto space-y-1">
          {faqs.map((faq) => (
            <div
              key={faq.id}
              className="bg-black/30 backdrop-blur-sm rounded-4xl border border-white/10 overflow-hidden transition-all duration-300 hover:bg-black/40"
            >
              <button
                onClick={() => toggleFAQ(faq.id)}
                className="w-full px-8 py-6 text-left flex items-center  justify-center text-white hover:bg-white/5 transition-colors duration-200"
              >
                <span className="text-lg font-bold tracking-tight text-center">
                  {faq.question}
                </span>
                <div className={`transform transition-transform duration-300 ${
                  openFAQ === faq.id ? 'rotate-45' : 'rotate-0'
                }`}>
                  
                   
              
                </div>
              </button>
              
              <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
                openFAQ === faq.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}>
                <div className="px-8 pb-6">
                  <div className="border-t border-white/10 pt-4">
                    <p className="text-white/80 leading-relaxed transform transition-transform duration-300">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer text */}
        <div className="text-center mt-16">
          <p className="text-white text-lg font-extrabold tracking-tighter">
            NEED FURTHER ASSISTANCE? DON&apos;T HESITATE TO REACH OUT TO OUR TEAM.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page;