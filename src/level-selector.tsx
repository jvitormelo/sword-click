import { EnemyOnLevel } from "./domain/types";
import { zombieFactory } from "./modules/enemies/use-enemy-factory";
import PlainsBackground from "@/assets/backgrounds/plains.png";

type Level = {
  id: string;
  number: number;
  background: string;
  enemies: EnemyOnLevel[];
};

import { SpawnEnemiesButton } from "./modules/enemies/spawn-enemies-button";
import { create } from "zustand";
import { useGameLevelStore } from "./stores/game-level-store";
import { useEffect, useRef } from "react";
import { gameTick } from "./constants";

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

export const useActiveLevelStore = create<{
  level: Level | null;
  actions: {
    setLevel: (level: Level) => void;
  };
}>((set) => ({
  level: null,
  actions: {
    setLevel: (level) => set({ level }),
  },
}));

export const LevelSelector = () => {
  const { setLevel } = useActiveLevelStore((s) => s.actions);
  const { tick, spawn } = useGameLevelStore((s) => s.actions);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  function selectLevel(level: Level) {
    if (intervalRef.current) {
      clearInterval(intervalRef.current!);
    }
    setLevel(level);
    level.enemies.forEach((enemy) => spawn(enemy));

    intervalRef.current = setInterval(() => {
      tick();
    }, gameTick);
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
