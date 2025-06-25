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
  const isSupplyChain = text === "supply chain & logistics";
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
      className="relative h-[275px] w-[275px] rounded-[14px] bg-[linear-gradient(180deg,rgba(16,19,21,1)_0%,rgba(23,32,39,1)_100%)] shadow-[0_2px_16px_#0008]"
    >
      {/* Default image scrolls up and fades */}
      <motion.div
        animate={
          state.hovered ? { y: "-37%", opacity: 0 } : { y: 0, opacity: 1 }
        }
        transition={{ duration: 0.6, ease: "easeInOut" }}
        className="absolute inset-0 z-10 flex h-full w-full items-center justify-center"
      >
        <Image src={defaultImage} width={78} height={86} alt="Default Tile" />
      </motion.div>

      {/* Hover image and vector scroll up together */}
      <motion.div
        animate={state.hovered ? { y: 0, opacity: 1 } : { y: "0%", opacity: 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        className="absolute inset-0 z-20 flex items-center justify-center overflow-hidden rounded-[14px]"
      >
        {hoverImage && (
          <Image
            src={hoverImage}
            alt="Hover Image"
            fill
            className="absolute z-10 object-cover"
          />
        )}
        <div className="relative z-20 flex flex-col items-center justify-center">
          {vectorImage && (
            <div className="mb-4 flex justify-center">
              <Image src={vectorImage} width={94} height={87} alt="Vector" />
            </div>
          )}
          {text && (
            <motion.div
              animate={
                state.hovered ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }
              }
              transition={{ duration: 0.4, ease: "easeInOut", delay: 0.2 }}
              className="flex justify-center text-center"
            >
              {isSupplyChain ? (
                <div className="relative flex w-[184px] justify-center">
                  <span
                    className="font-inter inline-block text-center text-[25.69px] leading-[98.5%] font-bold tracking-[-0.02em] text-[#fefde0] uppercase"
                    style={{ margin: 0 }}
                  >
                    supply chain
                    <br />
                    &amp; logistics
                  </span>
                </div>
              ) : isEnvironmental ? (
                <div className="relative flex w-[251px] justify-center">
                  <span className="font-inter inline-block text-center text-[24px] leading-[98.5%] font-bold tracking-[-0.02em] text-[#fefde0] uppercase">
                    environmental
                    <br />
                    impact&nbsp;solutions
                  </span>
                </div>
              ) : isDefense ? (
                <div className="relative flex w-[106px] justify-center">
                  <span
                    className="font-inter inline-block text-center text-[28.42px] leading-[98.5%] font-bold tracking-[-0.02em] text-[#fefde0] uppercase"
                    style={{ margin: 0 }}
                  >
                    {text}
                  </span>
                </div>
              ) : isDisaster ? (
                <div className="relative flex w-[125px] justify-center">
                  <span
                    className="font-inter inline-block text-center text-[28.42px] leading-[98.5%] font-bold tracking-[-0.02em] text-[#fefde0] uppercase"
                    style={{ margin: 0 }}
                  >
                    {text}
                  </span>
                </div>
              ) : isOpenInnovation ? (
                <div className="relative flex w-[156px] justify-center">
                  <span
                    className="font-inter inline-block text-center text-[28.42px] leading-[98.5%] font-bold tracking-[-0.02em] text-[#fefde0] uppercase"
                    style={{ margin: 0 }}
                  >
                    {text}
                  </span>
                </div>
              ) : isCybersecurity ? (
                <div className="relative flex w-[204px] justify-center">
                  <span className="font-inter inline-block text-center text-[30.69px] leading-[98.5%] font-bold tracking-[-0.02em] text-[#fefde0] uppercase">
                    {text}
                  </span>
                </div>
              ) : isBlockchain ? (
                <div className="relative flex w-[207px] justify-center">
                  <span
                    className="font-inter inline-block text-center text-[25.69px] leading-[98.5%] font-bold tracking-[-0.02em] text-[#fefde0] uppercase"
                    style={{ margin: 0 }}
                  >
                    {text}
                  </span>
                </div>
              ) : (
                <span className="font-inter inline-block text-left text-[36.61px] leading-[98.5%] font-bold tracking-[-0.02em] text-[#fefde0] uppercase drop-shadow-lg">
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
          width: "10px",
          height: "10px",
          borderWidth: "4px",
          top: "25px",
          left: "25px",
        }}
        animate={
          state.hovered
            ? {
                width: "16px",
                height: "16px",
                borderWidth: "6px",
                top: "18px",
                left: "18px",
              }
            : {
                width: "10px",
                height: "10px",
                borderWidth: "4px",
                top: "25px",
                left: "25px",
              }
        }
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="pointer-events-none absolute z-30 border-white"
        style={{ borderRight: "none", borderBottom: "none" }}
      />
      <motion.span
        initial={{
          width: "10px",
          height: "10px",
          borderWidth: "4px",
          top: "25px",
          right: "25px",
        }}
        animate={
          state.hovered
            ? {
                width: "16px",
                height: "16px",
                borderWidth: "6px",
                top: "18px",
                right: "18px",
              }
            : {
                width: "10px",
                height: "10px",
                borderWidth: "4px",
                top: "25px",
                right: "25px",
              }
        }
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="pointer-events-none absolute z-30 border-white"
        style={{ borderLeft: "none", borderBottom: "none" }}
      />
      <motion.span
        initial={{
          width: "10px",
          height: "10px",
          borderWidth: "4px",
          bottom: "25px",
          left: "25px",
        }}
        animate={
          state.hovered
            ? {
                width: "16px",
                height: "16px",
                borderWidth: "6px",
                bottom: "18px",
                left: "18px",
              }
            : {
                width: "10px",
                height: "10px",
                borderWidth: "4px",
                bottom: "25px",
                left: "25px",
              }
        }
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="pointer-events-none absolute z-30 border-white"
        style={{ borderRight: "none", borderTop: "none" }}
      />
      <motion.span
        initial={{
          width: "10px",
          height: "10px",
          borderWidth: "4px",
          bottom: "25px",
          right: "25px",
        }}
        animate={
          state.hovered
            ? {
                width: "16px",
                height: "16px",
                borderWidth: "6px",
                bottom: "18px",
                right: "18px",
              }
            : {
                width: "10px",
                height: "10px",
                borderWidth: "4px",
                bottom: "25px",
                right: "25px",
              }
        }
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="pointer-events-none absolute z-30 border-white"
        style={{ borderLeft: "none", borderTop: "none" }}
      />
    </motion.div>
  );
};

const themesData = [
  {
    hoverImage: "/rectangle-6667481-2.svg",
    vectorImage: "/fintech.svg",
    text: "FINTECH",
  },
  {
    hoverImage: "/rectangle_2.svg",
    vectorImage: "/edtech.svg",
    text: "edtech",
  },
  {
    hoverImage: "/rectangle_3.svg",
    vectorImage: "/blockchian.svg",
    text: "blockchain for good",
  },
  {
    hoverImage: "/rectangle_4.svg",
    vectorImage: "/supplychain.svg",
    text: "supply chain & logistics",
  },
  {
    hoverImage: "/rectangle_5.svg",
    vectorImage: "/enviroment.svg",
    text: "environmental impact solutions ",
  },
  {
    hoverImage: "/rectangle_6.svg",
    vectorImage: "/healthcare.svg",
    text: "healthcare",
  },
  {
    hoverImage: "/rectangle_7.svg",
    vectorImage: "/defence.svg",
    text: "defence systems",
  },
  {
    hoverImage: "/rectangle_8.svg",
    vectorImage: "/disaster.svg",
    text: "disaster response",
  },
  {
    hoverImage: "/rectangle_9.svg",
    vectorImage: "/open_innovation.svg",
    text: "open innovation",
  },
  {
    hoverImage: "/rectangle_10.svg",
    vectorImage: "/cybersecurity.svg",
    text: "cybersecurity",
  },
];

const Themes: React.FC = () => {
  // For a 4x3 grid, we need 12 slots. First two are empty, then themes.
  const gridSize = 12;
  const gridThemes = [
    null,
    null,
    ...themesData,
    ...Array(Math.max(0, gridSize - 2 - themesData.length)).fill(null),
  ];

  return (
    <div className="min-h-screen w-full overflow-visible">
      <div className="relative mx-auto min-h-screen max-w-[1440px] p-0">
        <div className="relative z-[2] flex min-h-[600px] items-start">
          <div className="relative min-w-[340px] text-left">
            <div className="absolute top-[24px] left-[100px] z-[3] min-w-[340px] text-left">
              {/* 2025 block with CSS-based corners */}
              <div className="relative mb-[43.58px] w-fit pt-[14px] pr-[52px] pb-[13px] pl-[54px]">
                <span className="relative z-10 text-center font-[AvantGarde_Bk_BT-Demi,Helvetica] text-[40.7px] leading-[40.1px] font-[400] tracking-[-0.81px] text-[#fffef0]">
                  2025
                </span>

                {/* Corner Borders - 2025 */}
                <span
                  className="absolute top-0 left-0 h-[10px] w-[10px] border-4 border-white"
                  style={{ borderRight: "none", borderBottom: "none" }}
                />
                <span
                  className="absolute top-0 right-0 h-[10px] w-[10px] border-4 border-white"
                  style={{ borderLeft: "none", borderBottom: "none" }}
                />
                <span
                  className="absolute bottom-0 left-0 h-[10px] w-[10px] border-4 border-white"
                  style={{ borderRight: "none", borderTop: "none" }}
                />
                <span
                  className="absolute right-0 bottom-0 h-[10px] w-[10px] border-4 border-white"
                  style={{ borderLeft: "none", borderTop: "none" }}
                />
              </div>

              {/* OUR THEMES text */}
              <div className="relative h-[178px] w-[463px]">
                <span className="absolute top-0 left-0 z-20 h-full w-full font-[Kinetika-Ultra,Helvetica] text-[111.2px] leading-[88.9px] font-[400] font-bold tracking-[0] text-[#fffef0]">
                  OUR
                  <br />
                  THEMES
                </span>
              </div>

              {/* Thunderbolt image */}
              <div className="pointer-events-none absolute top-[-140px] left-[230px] z-[2] h-[602px] w-[508px]">
                <Image
                  src="/Thunderbolt Asset Green (1) 1.svg"
                  alt="Thunderbolt"
                  width={508}
                  height={602}
                  className="absolute top-0 left-0 z-10 h-[602px] w-[508px]"
                />
              </div>
            </div>
          </div>

          {/* Grid tiles */}
          <div className="flex flex-1 items-start justify-start">
            <div className="static z-[2] ml-[-236px] grid grid-cols-4 grid-rows-3 gap-[34px]">
              {gridThemes.map((theme, idx) =>
                theme ? (
                  <Box
                    key={idx}
                    hoverImage={theme.hoverImage}
                    vectorImage={theme.vectorImage}
                    text={theme.text}
                  />
                ) : (
                  <div key={idx} />
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Themes;
