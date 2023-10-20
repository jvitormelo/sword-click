import { EnemyOnLevel } from "../../domain/types";

export type Level = {
  id: string;
  number: number;
  background: string;
  enemies: EnemyOnLevel[];
};

import { useGameLevelStore } from "../../stores/game-level-store";

import { Card } from "@/components/Card";
import { Views, useViewStore } from "@/stores/view-store";
import { cn } from "@/utils/cn";
import { useRef } from "react";
import { GoldCounter } from "../player/gold-counter";
import { usePlayer } from "../player/use-player";
import { allLevels } from "./all-levels";

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
  const { player } = usePlayer();
  const view = useViewStore((s) => s.view);

  function selectLevel(level: Level) {
    play(level);
  }

  const visibleLevels = (() => {
    const playerLevels = player.completedLevels
      .map((id) => allLevels.find((l) => l.id === id))
      .filter((l): l is Level => !!l);

    const highestLevel = playerLevels.reduce((acc, level) => {
      if (level.number > acc.number) return level;

      return acc;
    }, playerLevels[0]);

    return allLevels.filter((level) => {
      const highestNumber = highestLevel?.number || 0;

      return level.number <= highestNumber + 1;
    });
  })();

  if (view === Views.Abyss) {
    return (
      <>
        <button onClick={() => setView(Views.Town)}>Town</button>

        <button onClick={() => setView(Views.Camp)}>Camp</button>
      </>
    );
  }

  if (view === Views.Town)
    return (
      <>
        <button onClick={() => setView(Views.Camp)}>Camp</button>

        <button onClick={() => setView(Views.Abyss)}>Abyss</button>
      </>
    );

  return (
    <>
      <button onClick={() => setView(Views.Town)}>Town</button>

      <button onClick={() => setView(Views.Abyss)}>Abyss</button>

      <hr className="my-2" />

      {visibleLevels.map((level) => (
        <button
          className={cn(
            player.completedLevels.includes(level.id) && "bg-green-500"
          )}
          key={level.id}
          onClick={() => selectLevel(level)}
        >
          Map {level.number}
        </button>
      ))}
    </>
  );
}
