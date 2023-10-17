import { EnemyCounter } from "./modules/enemies/enemy-counter";
import { SpawnEnemiesButton } from "./modules/enemies/spawn-enemies-button";
import { GameArea } from "./modules/level/game-area";
import { GoldCounter } from "./modules/level/gold-counter";
import { PlayerBars } from "./modules/player/player-bars";
import { SkillBar } from "./modules/skill/skill-bar";

const quantity = 500;

export function App() {
  return (
    <main className="flex h-screen items-center justify-center flex-col w-screen select-none p-4">
      <div className="flex flex-col">
        <div className="flex justify-end gap-4">
          <SpawnEnemiesButton quantity={quantity} />
          <GoldCounter />
          <EnemyCounter quantity={quantity} />
        </div>

        <GameArea />

        <PlayerBars />
        <SkillBar />
      </div>
    </main>
  );
}
