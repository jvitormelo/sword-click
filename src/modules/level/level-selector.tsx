import { useGameLevelStore } from "./game-level-store";

import { Card } from "@/components/Card";
import { LevelOnLevel } from "@/modules/level/level-on-level";
import { PlayerPortrait } from "@/modules/player/player-side-bar";
import { Views, useViewStore } from "@/stores/view-store";
import { cn } from "@/utils/cn";
import { useRef } from "react";
import { GoldCounter } from "../player/gold-counter";
import { usePlayer } from "@/modules/player/use-player";
import { allLevels } from "@/modules/level/all-levels";
import { LevelModel } from "@/modules/level/types";
import { useWatchSkillClick } from "@/modules/skill/hooks/use-watch-skill-click";

export const LevelSelector = () => {
  const level = useGameLevelStore((s) => s.level);

  const isActive = !!level;

  return (
    <Card className="gap-2 w-full">
      <PlayerPortrait />
      {isActive ? <ActiveLevel level={level} /> : <Levels />}
    </Card>
  );
};

function ActiveLevel({ level }: { level: LevelOnLevel }) {
  const levelRef = useRef(level.enemies);
  const gold = useGameLevelStore((s) => s.gold);

  return (
    <div className="text-xs flex flex-col">
      <span>Enemies: {levelRef.current.size}</span>
      <GoldCounter gold={gold} />
      <BoardClickWatcher level={level} />
    </div>
  );
}

function BoardClickWatcher({ level }: { level: LevelOnLevel }) {
  useWatchSkillClick(level);

  return null;
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

  function selectLevel(level: LevelModel) {
    play(level);
  }

  const visibleLevels = (() => {
    const playerLevels = player.completedLevels
      .map((id) => allLevels.find((l) => l.id === id))
      .filter((l): l is LevelModel => !!l);

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
