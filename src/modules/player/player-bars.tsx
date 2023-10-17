import { useEffect, useRef } from "react";

import { usePlayerStore } from "./player-store";
import { useRegenEnergy } from "./useRegenEnergy";

export const PlayerBars = () => {
  const { life } = usePlayerStore();
  const { energy, maxEnergy } = useRegenEnergy();

  const maxLife = useRef(life);

  useEffect(() => {
    if (life <= 0) {
      console.log("You died");
    }
  }, [life]);

  return (
    <div>
      <div className="w-full bg-red-700 h-4 flex items-center justify-center relative">
        <div
          style={{
            width: `${(life / maxLife.current) * 100}%`,
          }}
          className="bg-green-500 h-full absolute left-0 top-0"
        />
        <span className="z-10">
          {life} / {maxLife.current}
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
