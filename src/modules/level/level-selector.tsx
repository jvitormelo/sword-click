import PlainsBackground from "@/assets/plains-background.jpeg";
import { EnemyOnLevel } from "../../domain/types";
import { goblinFactory, zombieFactory } from "../enemies/enemies-factory";

export type Level = {
  id: string;
  number: number;
  background: string;
  enemies: EnemyOnLevel[];
};

import { useGameLevelStore } from "../../stores/game-level-store";

import { Card } from "@/components/Card";
import { Views, useViewStore } from "@/stores/view-store";
import { useRef } from "react";
import { GoldCounter } from "../player/gold-counter";
import { allLevels } from "./all-levels";

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
    <Card className="gap-2 w-full">
      {isActive ? <ActiveLevel level={level} /> : <Levels />}
    </Card>
  );
};

function ActiveLevel({ level }: { level: Level }) {
  const levelRef = useRef(level.enemies);
  const gold = useGameLevelStore((s) => s.gold);

  return (
    <div className="text-xs flex flex-col">
      <span>Enemies: {levelRef.current.length}</span>
      <GoldCounter gold={gold} />
    </div>
  );
}

function Levels() {
  const { play } = useGameLevelStore((s) => s.actions);
  const { setView } = useViewStore((s) => s.actions);
  const view = useViewStore((s) => s.view);

  function selectLevel(level: Level) {
    setView(Views.Game);

    play(level);
  }

  if (view === Views.Town)
    return (
      <>
        <button onClick={() => setView(Views.Game)}>Camp</button>
      </>
    );

  return (
    <>
      <button onClick={() => setView(Views.Town)}>Town</button>

      <button onClick={() => selectLevel(createSandBoxLevel(50))}>Abyss</button>

      <hr className="my-2" />

      {allLevels.map((level) => (
        <button
          className="data-[completed='true']:bg-green-400"
          key={level.id}
          onClick={() => selectLevel(level)}
        >
          Map {level.number}
        </button>
      ))}
    </>
  );
}
