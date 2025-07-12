import PastSponsors from "@/components/PastSponsors";
import CommunityPartners from "@/components/CommunityPartners";
import WhyUsSection from "@/components/WhyUsSection";
import Background from "@/components/Background";
import Navbar from "@/components/Navbar";
import HackathonStats from "@/components/Statistics";

export default function About() {
  return (
    <div className="relative overflow-x-clip">
      <Background />
      <Navbar />
      <WhyUsSection />
      <HackathonStats />
      <PastSponsors />
      <CommunityPartners />
    </div>
  );
}
