import { useEffect, useRef } from "react";
import { useGameLevelStore } from "../../stores/game-level-store";

export const PlayerBars = () => {
  const { health, energy, maxEnergy } = useGameLevelStore((s) => s.player);

  const maxLife = useRef(health);

  useEffect(() => {
    if (health <= 0) {
      console.log("You died");
    }
  }, [health]);

  return (
    <div>
      <div className="w-full bg-red-700 h-4 flex items-center justify-center relative">
        <div
          style={{
            width: `${(health / maxLife.current) * 100}%`,
          }}
          className="bg-green-500 h-full absolute left-0 top-0"
        />
        <span className="z-10">
          {health} / {maxLife.current}
        </span>
      </div>
      <div className="w-full bg-yellow-800 h-4 flex items-center justify-center relative">
        <div
          style={{ width: `${(energy / maxEnergy) * 100}%` }}
          className="bg-yellow-500 h-full absolute left-0 top-0 transition-all duration-75"
        />
        <span className="z-10">
          {energy} / {maxEnergy}
        </span>
      </div>
    </div>
  );
};
