import PastSponsors from "@/components/past_sponsers";
import CommunityPartners from "@/components/CommunityPartners";
import WhyUsSection from "@/components/WhyUsSection";
import Background from "@/components/Background";

export default function About() {
  return (
    <main>
      <Background/>
<WhyUsSection/>
      <PastSponsors />
      <CommunityPartners />
    </main>
  );
}
