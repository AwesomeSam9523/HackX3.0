"use client";
import Image from 'next/image';

const Themes = () => {
  return (
    <div className="bg-[radial-gradient(circle_at_50%_50%,#10131a_60%,#050608_100%)] rounded-[18px] p-0 max-w-[1440px] min-h-screen mx-auto relative shadow-[0_2px_32px_0_#000a] overflow-visible">
      <div className="flex items-start relative min-h-[600px] z-[2]">
        <div className="relative min-w-[340px] text-left">
          <div className="absolute left-[56px] top-[64px] z-[3] min-w-[340px] text-left">
            <div className="relative h-[40px] w-[93px] mb-[43.58px]">
              <span
                className="text-[#fffef0] font-[400] font-[AvantGarde_Bk_BT-Demi,Helvetica] text-[40.7px] leading-[40.1px] tracking-[-0.81px] left-0 top-0 text-center whitespace-nowrap w-full h-full absolute"
              >
                2025
              </span>
            </div>
            <div className="relative h-[178px] w-[463px]">
              <span
                className="absolute z-20 text-[#fffef0] font-[400] font-bold font-[Kinetika-Ultra,Helvetica] text-[111.2px] leading-[88.9px] w-full h-full left-0 top-0 tracking-[0]"
              >
                OUR<br />THEMES
              </span>
            </div>
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
        <div className="flex-1 flex items-start justify-start">
          <div className="grid grid-cols-4 grid-rows-3 gap-[34px] mt-[110px] z-[2] static ml-[-292px]">
            {/* First row: two empty, two tiles */}
            <div></div>
            <div></div>
            <Box />
            <Box />
            {/* Second row: four tiles */}
            <Box />
            <Box />
            <Box />
            <Box />
            {/* Third row: four tiles */}
            <Box />
            <Box />
            <Box />
            <Box />
          </div>
        </div>
      </div>
    </div>
  );
};

const Box = () => (
  <div className="bg-[linear-gradient(180deg,rgba(16,19,21,1)_0%,rgba(23,32,39,1)_100%)] rounded-[14px] w-[275px] h-[275px] flex items-center justify-center relative shadow-[0_2px_16px_#0008]">
    <img src="/rectangle-6667481.svg" width={78} height={86} alt="Rectangle" />
    <img src="/subtract.svg" width={24} height={24} className="absolute w-[10px] h-[10px] border-2 border-white top-0 left-0" style={{borderRight: 'none', borderBottom: 'none'}} alt="" />
    <img src="/subtract.svg" width={24} height={24} className="absolute w-[10px] h-[10px] border-2 border-white top-0 right-0" style={{borderLeft: 'none', borderBottom: 'none'}} alt="" />
    <img src="/subtract.svg" width={24} height={24} className="absolute w-[10px] h-[10px] border-2 border-white bottom-0 left-0" style={{borderRight: 'none', borderTop: 'none'}} alt="" />
    <img src="/subtract.svg" width={24} height={24} className="absolute w-[10px] h-[10px] border-2 border-white bottom-0 right-0" style={{borderLeft: 'none', borderTop: 'none'}} alt="" />
  </div>
);

export default Themes;