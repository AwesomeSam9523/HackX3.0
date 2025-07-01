import Timer from "@/components/Timer";
import Themes from "@/components/Themes";
import Sponsors from "@/components/Sponsors";
import HeroSection from "@/components/Hero";
import Background from "@/components/Background";
import Spline from '@splinetool/react-spline/next';


export default function Home() {
  return (
    <main className="relative overflow-x-clip">
      <Background/>
      <HeroSection />
      <div className="h-12" />
      {/* Replaced existing ellipseDiv with Spline component */}
      <div
        className="absolute inset-0 z-5"
        style={{
          pointerEvents: "none", // Ensures the Spline canvas doesn't capture mouse events
          width: "90%", // Made smaller
          height: "90vh", // Made smaller
          top: '-63vh', // Adjusted top to keep it visible while smaller
          left: '5%', // Center horizontally if width is 80%
        }}
      >
        <Spline scene="https://prod.spline.design/WWQ6UfiQ4jUgZ9zx/scene.splinecode" />
      </div>
      <div className="h-8" />
      <Timer />
      <div className="h-8" />
      <Themes />
      <Sponsors />
    </main>
  );
}
