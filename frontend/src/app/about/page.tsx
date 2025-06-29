import PastSponsors from "@/components/past_sponsers";
import CommunityPartners from "@/components/CommunityPartners";
import WhyUsSection from "@/components/WhyUsSection";
import Background from "@/components/Background";
import Navbar from "@/components/Navbar";

export default function About() {
  return (
    <main>
      <Background/>
      <Navbar/>
<WhyUsSection/>
      <PastSponsors />
      <CommunityPartners />
    </main>
  );
}
