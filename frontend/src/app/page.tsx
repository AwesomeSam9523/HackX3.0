import HeroSection from "@/components/Hero";
import Background from "@/components/Background";
// import Spline from "@splinetool/react-spline/next";

export default function Home() {
  return (
    <div className="relative overflow-x-clip">
      <Background />
      <HeroSection />
      <div className="h-12" />
      {/* Replaced existing ellipseDiv with Spline component */}
      {/*<div*/}
      {/*  className="absolute inset-0 z-5 rotate-180 rotate-y-[160] transform-3d"*/}
      {/*  style={{*/}
      {/*    pointerEvents: "none",*/}
      {/*    width: "90%",*/}
      {/*    height: "90vh",*/}
      {/*    top: "-60vh",*/}
      {/*    // top: "-450px",*/}
      {/*    left: "2%",*/}
      {/*  }}*/}
      {/*>*/}
      {/*  <Spline scene="https://prod.spline.design/WWQ6UfiQ4jUgZ9zx/scene.splinecode" />*/}
      {/*</div>*/}
      <div className="h-8" />
      <div className="h-8" />
    </div>
  );
}
