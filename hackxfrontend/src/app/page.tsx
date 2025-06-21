import Timer from "../components/timer";
import Themes from "../components/themes";
import Sponsors from "@/components/sponsors";

export default function Home() {
  return (
    <main className="bg-black">
      <Timer />
      <Themes />
      <Sponsors/>
    </main>
  );
}

