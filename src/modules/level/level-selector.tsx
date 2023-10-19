import PlainsBackground from "@/assets/backgrounds/plains.png";
import { EnemyOnLevel } from "../../domain/types";
import { goblinFactory, zombieFactory } from "../enemies/enemies-factory";

export type Level = {
  id: string;
  number: number;
  background: string;
  enemies: EnemyOnLevel[];
};

import { useGameLevelStore } from "../../stores/game-level-store";

import { useRef } from "react";

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

const createSandBoxLevel = (quantity: number): Level => {
  return {
    id: "sandbox",
    number: 0,
    background: PlainsBackground,
    enemies: Array.from({ length: quantity }, () =>
      Math.random() < 0.5 ? zombieFactory() : goblinFactory()
    ),
  };
};

export const LevelSelector = () => {
  const level = useGameLevelStore((s) => s.level);

  const isActive = !!level;

  return (
    <div className="flex gap-2 border rounded-md bg-slate-800 border-amber-800 p-4 flex-col">
      {isActive ? <ActiveLevel level={level} /> : <Levels />}
    </div>
  );
};

function ActiveLevel({ level }: { level: Level }) {
  const levelRef = useRef(level.enemies);

  return <div>Total enemies: {levelRef.current.length}</div>;
}

function Levels() {
  const { play } = useGameLevelStore((s) => s.actions);
  function selectLevel(level: Level) {
    play(structuredClone(level));
  }
  return (
    <>
      {levels.map((level) => (
        <button key={level.id} onClick={() => selectLevel(level)}>
          Map {level.number}
        </button>
      ))}

      <button onClick={() => selectLevel(createSandBoxLevel(50))}>
        Sandbox
      </button>
    </>
  );
}