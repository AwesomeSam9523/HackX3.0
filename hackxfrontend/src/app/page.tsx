import Timer from "../components/timer";
import Themes from "../components/themes";
import Sponsors from "@/components/sponsors";
import Navbar from "@/components/navbar";

export default function Home() {
  return (
    <main className="bg-black">
      <Navbar/>
      <Timer />
      <Themes />
      <Sponsors/>
    </main>
  );
}

