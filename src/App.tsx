import { LevelSelector } from "./modules/level/level-selector";

import { GameLevel } from "./modules/level/game-level";
import { LifeGlobe } from "./modules/player/life-globe";
import { ManaGlobe } from "./modules/player/mana-globe";
import { PlayerOnLevel } from "./modules/player/player-bars";
import { SkillBar } from "./modules/skill/skill-bar";
import { Town } from "./modules/town";
import { Views, useViewStore } from "./stores/view-store";

export function App() {
  return (
    <main className="flex h-screen items-center justify-center flex-col w-screen select-none p-4 ">
      <div className="flex flex-col bg-stone-950 p-4 rounded-md max-w-5xl w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_550px_1fr] gap-4 lg:h-[550px]">
          <PlayerOnLevel />

          <CurrentView />

          <LevelSelector />
        </div>

        <div className="flex gap-4 pt-2">
          <LifeGlobe />
          <SkillBar />
          <ManaGlobe />
        </div>
      </div>
    </main>
  );
}

function CurrentView() {
  const view = useViewStore((s) => s.view);

  if (view === Views.Town) return <Town />;

  return <GameLevel />;
}
