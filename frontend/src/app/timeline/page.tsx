import Background from "@/components/Background";
import Navbar from "@/components/Navbar";
import HackathonTimeline from "@/components/Timeline";

export default function Timeline() {
  return (
    <div className="relative overflow-x-clip">
      <Background />
      <Navbar />
      <HackathonTimeline />
    </div>
  );
}
