import Image from "next/image";

const XComponent = () => {
  return (
    <div className="pointer-events-none absolute top-0 left-0 z-2 flex h-screen w-full items-center justify-center">
      <Image
        src="/x2.png"
        alt="Background decoration"
        width={384}
        height={384}
        className="h-full w-auto"
        priority
      />
    </div>
  );
};

export default XComponent;
