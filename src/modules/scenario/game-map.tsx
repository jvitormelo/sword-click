import { useEffect, useRef } from "react";

import { distanceFromTop } from "../../constants";
import { EnemyCounter } from "../enemies/enemy-counter";
import { SpawnEnemiesButton } from "../enemies/spawn-enemies-button";
import { PlayerBars } from "../player/player-bars";
import { SkillBar } from "../skill/skill-bar";
import { GoldCounter } from "./gold-counter";
import { EnemiesSpawn } from "../enemies/enemies-spawn";

const quantity = 500;

export const GameMap = () => {
  const boardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onResize = () => {
      if (boardRef.current) {
        const { top, left } = boardRef.current.getBoundingClientRect();
        distanceFromTop.x = left;
        distanceFromTop.y = top;
      }
    };

    addEventListener("resize", onResize);

    onResize();

    return () => {
      removeEventListener("resize", onResize);
    };
  }, []);

  console.log("rerender");

  return (
    <div className="flex flex-col">
      <div className="flex justify-end gap-4">
        <SpawnEnemiesButton quantity={quantity} />
        <GoldCounter />
        <EnemyCounter quantity={quantity} />
      </div>
      <div
        ref={boardRef}
        className="bg-blue-300 w-96 h-96 flex gap-4 relative cursor-pointer"
        id="game"
      >
        <EnemiesSpawn />
        <div className="absolute bottom-0 w-full border-t border-red-500 h-10 flex items-center justify-center">
          <div>(You)</div>
        </div>
      </div>
      <PlayerBars />
      <SkillBar />
    </div>
  );
};
