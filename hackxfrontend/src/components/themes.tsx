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
  hoverImage: string;
  vectorImage: string;
};

const Box: React.FC<BoxProps> = ({ hoverImage, vectorImage }) => {
  const [state, dispatch] = useReducer(boxReducer, { hovered: false });
  const defaultImage = "/rectangle-6667481.svg";

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
        <Image
          src={hoverImage}
          alt="Hover Image"
          fill
          className="object-cover absolute z-10"
        />
        <div className="z-20 relative">
          <Image src={vectorImage} width={94} height={87} alt="Vector" />
        </div>
      </motion.div>

      {/* Corner Borders - Tiles */}
    <span className="absolute w-[10px] h-[10px] border-4 border-white top-[25px] left-[25px] z-30 pointer-events-none" style={{ borderRight: 'none', borderBottom: 'none' }} />
    <span className="absolute w-[10px] h-[10px] border-4 border-white top-[25px] right-[25px] z-30 pointer-events-none" style={{ borderLeft: 'none', borderBottom: 'none' }} />
    <span className="absolute w-[10px] h-[10px] border-4 border-white bottom-[25px] left-[25px] z-30 pointer-events-none" style={{ borderRight: 'none', borderTop: 'none' }} />
    <span className="absolute w-[10px] h-[10px] border-4 border-white bottom-[25px] right-[25px] z-30 pointer-events-none" style={{ borderLeft: 'none', borderTop: 'none' }} />

    </motion.div>
  );
};

const Themes: React.FC = () => {
  const imageSets = [
    null,
    null,
    ["/rectangle-6667481-2.svg", "/vector.svg"],
    ["/hover4.svg", "/vector2.svg"],
    ["/hover5.svg", "/vector3.svg"],
    ["/hover6.svg", "/vector4.svg"],
    ["/hover7.svg", "/vector5.svg"],
    ["/hover8.svg", "/vector6.svg"],
    ["/hover9.svg", "/vector7.svg"],
    ["/hover10.svg", "/vector8.svg"],
    ["/hover11.svg", "/vector9.svg"],
    ["/hover12.svg", "/vector10.svg"],
  ];

  return (
    <div className="bg-[radial-gradient(circle_at_50%_50%,#10131a_60%,#050608_100%)] rounded-[18px] p-0 max-w-[1440px] min-h-screen mx-auto relative shadow-[0_2px_32px_0_#000a] overflow-visible">
      <div className="flex items-start relative min-h-[600px] z-[2]">
        <div className="relative min-w-[340px] text-left">
          <div className="absolute left-[56px] top-[64px] z-[3] min-w-[340px] text-left">
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
            <div className="absolute left-[230px] top-[-110px] z-[2] pointer-events-none w-[508px] h-[602px]">
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
          <div className="grid grid-cols-4 grid-rows-3 gap-[34px] mt-[110px] z-[2] static ml-[-292px]">
            {imageSets.map((set, idx) =>
              set ? (
                <Box key={idx} hoverImage={set[0]} vectorImage={set[1]} />
              ) : (
                <div key={idx} />
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Themes;
