import { CurrentView } from "./modules/level/current-game-level";
import { LevelSelector } from "./modules/level/level-selector";

import { LifeGlobe } from "./modules/player/life-globe";
import { ManaGlobe } from "./modules/player/mana-globe";
import { PlayerSideBar } from "./modules/player/player-side-bar";
import { SkillBar } from "./modules/skill/skill-bar";

export function App() {
  return (
    <main className="flex h-screen items-center justify-center flex-col w-screen select-none p-4 ">
      <div className="flex flex-col bg-stone-950 p-4 rounded-md max-w-5xl w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_550px_1fr] gap-4 lg:h-[550px]">
          <PlayerSideBar />

          <CurrentView />

          <LevelSelector />
        </div>

        <div className="flex gap-4 pt-4 px-4">
          <LifeGlobe />
          <SkillBar />
          <ManaGlobe />
        </div>
      </div>
    </main>
  );
}
