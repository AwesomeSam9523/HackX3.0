import WhyApplySection from "@/components/WhyApplySection";
import Background from "@/components/Background";
import Navbar from "@/components/Navbar";

export default function Ambassador() {
  return (
    <div className="relative overflow-x-clip">
      <Background />
      <Navbar />

      <WhyApplySection />
    </div>
  );
}
