import { useEffect, useRef, useState } from "react";
import { EnemyOnLevel } from "../../domain/types";
import { between } from "../../utils/random";
import { useGameLevelStore } from "../../stores/game-level-store";

export const useEnemyFactory = ({
  interval,
  quantity,
  randomizeIntervalEvery,
}: {
  quantity: number;
  interval: number;
  randomizeIntervalEvery: number;
}) => {
  const { spawn } = useGameLevelStore((s) => s.actions);
  const spawnedQuantity = useRef(0);

  const [isGameActive, setIsGameActive] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    return () => {
      clearInterval(intervalRef.current);
    };
  }, [interval]);

  const start = () => {
    spawnedQuantity.current = 0;
    intervalRef.current = setInterval(() => {
      if (spawnedQuantity.current >= quantity) {
        clearInterval(spawnedQuantity.current);
        return;
      }

      if (
        spawnedQuantity.current !== 0 &&
        spawnedQuantity.current % randomizeIntervalEvery === 0
      ) {
        const extraSpawn = between(1, 15);

        for (let i = 0; i < extraSpawn; i++) {
          if (spawnedQuantity.current >= quantity) return;

          const zombie: EnemyOnLevel = {
            id: Math.random().toString(),
            health: 100,
            position: {
              x: between(0, 344),
              y: between(0, 24),
            },
          };
          spawn(zombie);
          spawnedQuantity.current++;
        }
      }

      const zombie: EnemyOnLevel = {
        id: Math.random().toString(),
        health: 100,
        position: {
          x: between(0, 344),
          y: between(0, 24),
        },
      };
      spawn(zombie);
      spawnedQuantity.current++;
    }, interval);
    setIsGameActive(true);
  };

  return {
    start,
    isGameActive,
    spawnedQuantity: spawnedQuantity.current,
  };
};
