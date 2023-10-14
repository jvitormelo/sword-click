import { useEffect, useRef } from "react";
import { useEnemiesStore } from "./modules/enemies/enemies-store";
import { distanceFromTop } from "./constants";

export const GameMap = () => {
  const enemies = useEnemiesStore((s) => s.enemies);

  const boardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (boardRef.current) {
      const { top, left } = boardRef.current.getBoundingClientRect();
      distanceFromTop.x = left;
      distanceFromTop.y = top;
    }
  }, []);

  return (
    <div ref={boardRef} className="text-xl bg-white w-96 h-96 flex gap-4">
      {enemies.map((enemy) => (
        <div
          data-id={enemy.id}
          key={enemy.id}
          className="bg-green-800 w-12 h-12 rounded-full z-10"
        >
          <div className="pointer-events-none">{enemy.health}</div>
        </div>
      ))}
    </div>
  );
};
