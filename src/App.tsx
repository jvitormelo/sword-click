import { CurrentView } from "@/pages";
import { LevelSelector } from "./modules/level/level-selector";

import { ManaGlobe } from "./modules/player/mana-globe";
import { SkillBar } from "./modules/skill/skill-bar";
import { LifeGlobe } from "@/modules/player/life-globe";

export function App() {
  return (
    <main className="flex h-screen items-center justify-center flex-col w-screen select-none p-4 ">
      <div className="flex flex-col bg-stone-950 p-4 rounded-md max-w-6xl w-full">
        <div className="grid grid-cols-[1fr_4fr] gap-4 h-[600px]">
          <LevelSelector />
          <CurrentView />
        </div>

        <div className="flex gap-4 pt-4">
          <LifeGlobe />
          <SkillBar />
          <ManaGlobe />
        </div>
      </div>
    </main>
  );
}
