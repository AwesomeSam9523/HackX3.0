"use client";
import React, { useReducer } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

type BoxState = { hovered: boolean };
type BoxAction = { type: "mouse_enter" } | { type: "mouse_leave" };

const boxReducer = (state: BoxState, action: BoxAction): BoxState => {
  switch (action.type) {
    case "mouse_enter":
      return { hovered: true };
    case "mouse_leave":
      return { hovered: false };
    default:
      return state;
  }
};

type BoxProps = {
  hoverImage?: string;
  vectorImage?: string;
  text?: string;
};

const Box: React.FC<BoxProps> = ({ hoverImage, vectorImage, text }) => {
  const [state, dispatch] = useReducer(boxReducer, { hovered: false });
  const defaultImage = "/rectangle-6667481.svg";

  // Check for specific tiles that need custom styling
  const isSupplyChain = text === "supply chain &   logistics";
  const isEnvironmental = text === "environmental impact solutions ";
  const isDefense = text === "defence systems";
  const isDisaster = text === "disaster response";
  const isOpenInnovation = text === "open innovation";
  const isCybersecurity = text === "cybersecurity";
  const isBlockchain = text === "blockchain for good";

  return (
      <motion.div
          onMouseEnter={() => dispatch({ type: "mouse_enter" })}
          onMouseLeave={() => dispatch({ type: "mouse_leave" })}
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="relative w-[275px] h-[275px] rounded-[14px] bg-[linear-gradient(180deg,rgba(16,19,21,1)_0%,rgba(23,32,39,1)_100%)] shadow-[0_2px_16px_#0008]"
      >
        {/* Default image scrolls up and fades */}
        <motion.div
            animate={state.hovered ? { y: "-37%", opacity: 0 } : { y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="w-full h-full flex items-center justify-center absolute inset-0 z-10"
        >
          <Image src={defaultImage} width={78} height={86} alt="Default Tile" />
        </motion.div>

        {/* Hover image and vector scroll up together */}
        <motion.div
            animate={state.hovered ? { y: 0, opacity: 1 } : { y: "0%", opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="absolute inset-0 z-20 flex items-center justify-center rounded-[14px] overflow-hidden"
        >
          {hoverImage && (
              <Image
                  src={hoverImage}
                  alt="Hover Image"
                  fill
                  className="object-cover absolute z-10"
              />
          )}
          <div className="z-20 relative flex flex-col items-center justify-center">
            {vectorImage && (
                <div className="flex justify-center mb-4">
                  <Image src={vectorImage} width={94} height={87} alt="Vector" />
                </div>
            )}
            {text && (
                <motion.div
                    animate={state.hovered ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                    transition={{ duration: 0.4, ease: "easeInOut", delay: 0.2 }}
                    className="text-center flex justify-center"
                >
                  {isSupplyChain ? (
                      <div className="w-[184px] relative flex justify-center">
                      <span
                          className="text-[#fefde0] text-[25.69px] leading-[98.5%] tracking-[-0.02em] uppercase font-bold font-inter text-center inline-block"
                          style={{ margin: 0 }}
                      >
                        {text}
                      </span>
                      </div>
                  ) : isEnvironmental ? (
                      <div className="w-[251px] relative flex justify-center">
                      <span className="text-[#fefde0] text-[24px] leading-[98.5%] tracking-[-0.02em] uppercase font-bold font-inter text-center inline-block">
                        environmental<br />impact&nbsp;solutions
                      </span>
                      </div>
                  ) : isDefense ? (
                      <div className="w-[106px] relative flex justify-center">
                      <span
                          className="text-[#fefde0] text-[28.42px] leading-[98.5%] tracking-[-0.02em] uppercase font-bold font-inter text-center inline-block"
                          style={{ margin: 0 }}
                      >
                        {text}
                      </span>
                      </div>
                  ) : isDisaster ? (
                      <div className="w-[125px] relative flex justify-center">
                      <span
                          className="text-[#fefde0] text-[28.42px] leading-[98.5%] tracking-[-0.02em] uppercase font-bold font-inter text-center inline-block"
                          style={{ margin: 0 }}
                      >
                        {text}
                      </span>
                      </div>
                  ) : isOpenInnovation ? (
                      <div className="w-[156px] relative flex justify-center">
                      <span
                          className="text-[#fefde0] text-[28.42px] leading-[98.5%] tracking-[-0.02em] uppercase font-bold font-inter text-center inline-block"
                          style={{ margin: 0 }}
                      >
                        {text}
                      </span>
                      </div>
                  ) : isCybersecurity ? (
                      <div className="w-[204px] relative flex justify-center">
                      <span className="text-[#fefde0] text-[30.69px] leading-[98.5%] tracking-[-0.02em] uppercase font-bold font-inter text-center inline-block">
                        {text}
                      </span>
                      </div>
                  ) : isBlockchain ? (
                      <div className="w-[207px] relative flex justify-center">
                      <span
                          className="text-[#fefde0] text-[25.69px] leading-[98.5%] tracking-[-0.02em] uppercase font-bold font-inter text-center inline-block"
                          style={{ margin: 0 }}
                      >
                        {text}
                      </span>
                      </div>
                  ) : (
                      <span className="text-[#fefde0] text-[36.61px] leading-[98.5%] tracking-[-0.02em] uppercase font-bold font-inter text-left inline-block drop-shadow-lg">
                      {text}
                    </span>
                  )}
                </motion.div>
            )}
          </div>
        </motion.div>

        {/* Corner Borders - Tiles with hover animation */}
        <motion.span
            initial={{
              width: '10px',
              height: '10px',
              borderWidth: '4px',
              top: '25px',
              left: '25px'
            }}
            animate={state.hovered ? {
              width: '16px',
              height: '16px',
              borderWidth: '6px',
              top: '18px',
              left: '18px'
            } : {
              width: '10px',
              height: '10px',
              borderWidth: '4px',
              top: '25px',
              left: '25px'
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute border-white z-30 pointer-events-none"
            style={{ borderRight: 'none', borderBottom: 'none' }}
        />
        <motion.span
            initial={{
              width: '10px',
              height: '10px',
              borderWidth: '4px',
              top: '25px',
              right: '25px'
            }}
            animate={state.hovered ? {
              width: '16px',
              height: '16px',
              borderWidth: '6px',
              top: '18px',
              right: '18px'
            } : {
              width: '10px',
              height: '10px',
              borderWidth: '4px',
              top: '25px',
              right: '25px'
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute border-white z-30 pointer-events-none"
            style={{ borderLeft: 'none', borderBottom: 'none' }}
        />
        <motion.span
            initial={{
              width: '10px',
              height: '10px',
              borderWidth: '4px',
              bottom: '25px',
              left: '25px'
            }}
            animate={state.hovered ? {
              width: '16px',
              height: '16px',
              borderWidth: '6px',
              bottom: '18px',
              left: '18px'
            } : {
              width: '10px',
              height: '10px',
              borderWidth: '4px',
              bottom: '25px',
              left: '25px'
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute border-white z-30 pointer-events-none"
            style={{ borderRight: 'none', borderTop: 'none' }}
        />
        <motion.span
            initial={{
              width: '10px',
              height: '10px',
              borderWidth: '4px',
              bottom: '25px',
              right: '25px'
            }}
            animate={state.hovered ? {
              width: '16px',
              height: '16px',
              borderWidth: '6px',
              bottom: '18px',
              right: '18px'
            } : {
              width: '10px',
              height: '10px',
              borderWidth: '4px',
              bottom: '25px',
              right: '25px'
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute border-white z-30 pointer-events-none"
            style={{ borderLeft: 'none', borderTop: 'none' }}
        />
      </motion.div>
  );
};

const Themes: React.FC = () => {
  const imageSets = [
    null,
    null,
    ["/rectangle-6667481-2.svg", "/fintech.svg", "FINTECH"],
    ["/rectangle_2.svg", "/edtech.svg", "edtech"],
    ["/rectangle_3.svg", "/blockchain.svg", "blockchain for good"],
    ["/rectangle_4.svg", "/supplychain.svg", "supply chain & logistics"],
    ["/rectangle_5.svg", "/enviroment.svg", "environmental impact solutions "],
    ["/rectangle_6.svg", "/healthcare.svg", "healthcare"],
    ["/rectangle_7.svg", "/defence.svg", "defence systems"],
    ["/rectangle_8.svg", "/disaster.svg", "disaster response"],
    ["/rectangle_9.svg", "/open_innovation.svg", "open innovation"],
    ["/rectangle_10.svg", "/cybersecurity.svg", "cybersecurity"],
  ];

  return (
    <div className="w-full min-h-screen overflow-visible">
      <div className="max-w-[1440px] mx-auto p-0 min-h-screen relative">
        <div className="flex items-start relative min-h-[600px] z-[2]">
          <div className="relative min-w-[340px] text-left">
            <div className="absolute left-[100px] top-[24px] z-[3] min-w-[340px] text-left">
              {/* 2025 block with CSS-based corners */}
              <div className="relative w-fit mb-[43.58px] pt-[14px] pb-[13px] pl-[54px] pr-[52px]">
              <span className="text-[#fffef0] font-[400] font-[AvantGarde_Bk_BT-Demi,Helvetica] text-[40.7px] leading-[40.1px] tracking-[-0.81px] text-center relative z-10">
                2025
              </span>

                {/* Corner Borders - 2025 */}
                <span className="absolute w-[10px] h-[10px] border-4 border-white top-0 left-0" style={{ borderRight: 'none', borderBottom: 'none' }} />
                <span className="absolute w-[10px] h-[10px] border-4 border-white top-0 right-0" style={{ borderLeft: 'none', borderBottom: 'none' }} />
                <span className="absolute w-[10px] h-[10px] border-4 border-white bottom-0 left-0" style={{ borderRight: 'none', borderTop: 'none' }} />
                <span className="absolute w-[10px] h-[10px] border-4 border-white bottom-0 right-0" style={{ borderLeft: 'none', borderTop: 'none' }} />
              </div>

              {/* OUR THEMES text */}
              <div className="relative h-[178px] w-[463px]">
              <span className="absolute z-20 text-[#fffef0] font-[400] font-bold font-[Kinetika-Ultra,Helvetica] text-[111.2px] leading-[88.9px] w-full h-full left-0 top-0 tracking-[0]">
                OUR
                <br />
                THEMES
              </span>
              </div>

              {/* Thunderbolt image */}
              <div className="absolute left-[230px] top-[-140px] z-[2] pointer-events-none w-[508px] h-[602px]">
                <Image
                    src="/Thunderbolt Asset Green (1) 1.svg"
                    alt="Thunderbolt"
                    width={508}
                    height={602}
                    className="absolute left-0 top-0 w-[508px] h-[602px] z-10"
                />
              </div>
            </div>
          </div>

          {/* Grid tiles */}
          <div className="flex-1 flex items-start justify-start">
            <div className="grid grid-cols-4 grid-rows-3 gap-[34px] z-[2] static ml-[-236px]">
              {imageSets.map((set, idx) =>
                  set ? (
                      <Box
                          key={idx}
                          hoverImage={set[0]}
                          vectorImage={set[1]}
                          text={set[2]}
                      />
                  ) : (
                      <div key={idx} />
                  )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Themes;