import { ExperienceProvider } from "./context/ExperienceContext";
import { Intro } from "./components/Intro";
import { ProgressIndicator } from "./components/ProgressIndicator";
import { MusicToggle } from "./components/MusicToggle";
import { Chapter01Chaos } from "./sections/Chapter01Chaos";
import { Chapter02Childhood } from "./sections/Chapter02Childhood";
import { Chapter03Us } from "./sections/Chapter03Us";
import { Chapter04You } from "./sections/Chapter04You";
import { Chapter05Today } from "./sections/Chapter05Today";
import { FinalMoment } from "./sections/FinalMoment";

export default function App() {
  return (
    <ExperienceProvider>
      <ProgressIndicator />
      <MusicToggle />
      <main>
        <Intro />
        <Chapter01Chaos />
        <Chapter02Childhood />
        <Chapter03Us />
        <Chapter04You />
        <Chapter05Today />
        <FinalMoment />
      </main>
    </ExperienceProvider>
  );
}
