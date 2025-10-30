"use client";
import React from "react";
import { useRouter } from "next/navigation";

const REGISTER_URL =
  "https://drive.google.com/file/d/1Ztynp_GOpMbhgxZTLnIA_MHHRw2qsHGV/view";

const RegisterButton = ({ isFooterButton = false }) => {
  const router = useRouter();
  return (
    <button
      onClick={() => {
        router.push(REGISTER_URL);
      }}
      className={`xs:px-5 xs:py-3 xs:text-base text-offwhite font-avgardd z-100 mx-auto min-h-[44px] w-full max-w-xs transform rounded-full border-2 border-white bg-transparent px-4 ${isFooterButton ? "py-3.5 text-xl" : "py-2.5 text-sm"} font-extrabold tracking-wide whitespace-nowrap shadow-lg transition-all duration-300 hover:scale-105 hover:border-white/30 hover:bg-white hover:text-black hover:shadow-xl focus:scale-105 focus:ring-4 focus:ring-white/50 focus:outline-none active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 sm:min-h-[48px] sm:px-6 sm:py-3 sm:text-lg md:min-h-[52px] md:px-8 md:py-3.5 md:text-xl lg:min-h-[56px]`}
    >
      PROBLEM STATEMENTS
    </button>
  );
};

export default RegisterButton;
