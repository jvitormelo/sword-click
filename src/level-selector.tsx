import PlainsBackground from "@/assets/backgrounds/plains.png";
import { EnemyOnLevel } from "./domain/types";
import { zombieFactory } from "./modules/enemies/use-enemy-factory";

type Level = {
  id: string;
  number: number;
  background: string;
  enemies: EnemyOnLevel[];
};

import { create } from "zustand";
import { gameTick } from "./constants";
import { SpawnEnemiesButton } from "./modules/enemies/spawn-enemies-button";
import { useGameLevelStore } from "./stores/game-level-store";

const levels: Array<Level> = [
  {
    id: "1",
    number: 1,
    background: PlainsBackground,
    enemies: [
      zombieFactory(),
      zombieFactory(),
      zombieFactory(),
      zombieFactory(),
      zombieFactory(),
      zombieFactory(),
    ],
  },
];

let interval: NodeJS.Timeout | null = null;

export const useActiveLevelStore = create<{
  level: Level | null;
  actions: {
    playLevel: (level: Level) => void;
  };
}>((set) => ({
  level: null,
  actions: {
    playLevel: (level) => {
      if (interval) clearInterval(interval);

      set({ level });

      level.enemies.forEach((enemy) => {
        useGameLevelStore.getState().actions.spawn(enemy);
      });

      interval = setInterval(() => {
        useGameLevelStore.getState().actions.tick();
      }, gameTick);
    },
  },
}));

export const LevelSelector = () => {
  const { playLevel } = useActiveLevelStore((s) => s.actions);

  function selectLevel(level: Level) {
    playLevel(level);
  }

  return (
    <div className="flex gap-2 border rounded-md bg-slate-800 border-amber-800 p-4 flex-col">
      {levels.map((level) => (
        <button key={level.id} onClick={() => selectLevel(level)}>
          Map {level.number}
        </button>
      ))}

      <SpawnEnemiesButton quantity={500} />
    </div>
  );
};
