import { useEffect, useRef } from "react";

import { useEnergyStore, usePlayerStore } from "./player-store";

export const PlayerBars = () => {
  const { life } = usePlayerStore();
  const energy = useEnergyStore((s) => s.energy);
  const { regenerate } = useEnergyStore((s) => s.actions);

  const maxLife = useRef(life);
  const maxEnergy = useRef(energy);

  useEffect(() => {
    if (life <= 0) {
      console.log("You died");
    }
  }, [life]);

  useEffect(() => {
    const interval = setInterval(() => {
      regenerate();
    }, 666);

    return () => {
      clearInterval(interval);
    };
  }, []);

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
      <div className="w-full bg-blue-700 h-4 flex items-center justify-center relative">
        <div
          style={{ width: `${(energy / maxEnergy.current) * 100}%` }}
          className="bg-yellow-500 h-full absolute left-0 top-0 transition-all duration-75"
        />
        <span className="z-10">
          {energy} / {maxEnergy.current}
        </span>
      </div>
    </div>
  );
};
