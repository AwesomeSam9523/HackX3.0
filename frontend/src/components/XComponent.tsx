import Image from "next/image";

const XComponent = () => {
  return (
    <div
      className="pointer-events-none absolute top-0 left-0 z-6 flex h-screen w-full items-start mix-blend-overlay lg:items-center lg:justify-center"
      style={{
        willChange: "transform",
        WebkitTransform: "translateZ(0)", // Force Safari GPU layer
      }}
    >
      <Image
        src={"/x2.svg"}
        alt="Background decoration"
        width={384}
        height={384}
        className="absolute left-1/2 h-auto w-[40rem] max-w-none -translate-x-1/2 transform sm:static sm:left-0 sm:h-full sm:w-auto sm:translate-x-0 sm:transform-none lg:max-w-full"
        priority
      />
    </div>
  );
};

export default XComponent;
