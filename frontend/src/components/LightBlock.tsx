import Image from "next/image";

const LightBlock = ({ position }: { position: "left" | "right" }) => {
  return (
    <div
      className={`pointer-events-none absolute ${position === "right" ? "right-0" : "left=0"}`}
    >
      <Image
        src={position === "left" ? "/light2.svg" : "/light1.svg"}
        alt="Background decoration"
        width={384}
        height={384}
        className="h-full w-auto"
        priority
      />
    </div>
  );
};

export default LightBlock;
