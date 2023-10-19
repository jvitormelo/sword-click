import { LevelSelector } from "./modules/level/level-selector";

import { GameLevel } from "./modules/level/game-level";
import { LifeGlobe } from "./modules/player/life-globe";
import { ManaGlobe } from "./modules/player/mana-globe";
import { PlayerOnLevel } from "./modules/player/player-bars";
import { SkillBar } from "./modules/skill/skill-bar";

export function App() {
  return (
    <main className="flex h-screen items-center justify-center flex-col w-screen select-none p-4">
      <div className="flex flex-col bg-stone-950 p-4 rounded-md">
        <div className="flex gap-4">
          <PlayerOnLevel />
          <GameLevel />
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
