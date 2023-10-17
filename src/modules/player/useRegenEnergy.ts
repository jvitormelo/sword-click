import { useEffect, useRef } from "react";
import { useEnergyStore } from "./player-store";

export const useRegenEnergy = () => {
  const energy = useEnergyStore((s) => s.energy);
  const { regenerate } = useEnergyStore((s) => s.actions);
  const maxEnergy = useRef(energy);

  useEffect(() => {
    const interval = setInterval(() => {
      regenerate();
    }, 500);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return {
    energy,
    maxEnergy: maxEnergy.current,
  };
};
