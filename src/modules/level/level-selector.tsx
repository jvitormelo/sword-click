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

const viewsTextMap: Record<Views, string> = {
  [Views.Camp]: "Camp",
  [Views.Town]: "Town",
  [Views.Abyss]: "Abyss",
};

function Levels() {
  const { setView } = useViewStore((s) => s.actions);
  const view = useViewStore((s) => s.view);

  return (
    <>
      {Object.values(Views).map((value) => (
        <button
          key={value}
          className={cn(view === value && "bg-amber-800 border-amber-950")}
          onClick={() => setView(value)}
        >
          {viewsTextMap[value]}
        </button>
      ))}

      <hr className="my-2" />

      {view === Views.Camp && <Maps />}
    </>
  );
}

function Maps() {
  const { player } = usePlayer();
  const { play } = useGameLevelStore((s) => s.actions);

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

  return (
    <>
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
