import { useGameLevelStore } from "@/stores/game-level-store";
import { useRef } from "react";

export const LifeGlobe = () => {
  const health = useGameLevelStore((s) => s.player.health);

  const maxLife = useRef(health);

  const height = health < 0 ? 0 : (health / maxLife.current) * 100;

  const currentLife = health < 0 ? 0 : health;

  return (
    <div className="relative h-20 w-20 mx-auto aspect-square border-2 border-red-600 rounded-full overflow-hidden flex-shrink-0">
      <div
        className="w-full bottom-0 bg-red-500 absolute transition-all duration-200 ease-out"
        style={{ height: `${height}%` }}
      />
      <div className="absolute text-[8px] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white font-bold">
        {currentLife} / {maxLife.current}
      </div>
    </div>
  );
};
