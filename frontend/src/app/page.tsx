import Timer from "@/components/Timer";
import Themes from "@/components/Themes";
import Sponsors from "@/components/Sponsors";
import HeroSection from "@/components/Hero";

export default function Home() {
  return (
    <main className="relative overflow-x-clip">
      <HeroSection />
      <div className="h-12" />
      <div
        className="ellipseDiv absolute top-0 left-[72%] z-0 -translate-x-1/2"
        style={{
          width: "100%",
          height: "864px",
          filter: "blur(211.1px)",
          borderRadius: "50%",
          background: "radial-gradient(50% 50% at 50% 50%, #1a252f, #111)",
        }}
      />
      <div className="h-8" />
      <Timer />
      <div className="h-8" />
      <Themes />
      <Sponsors />
    </main>
  );
}
