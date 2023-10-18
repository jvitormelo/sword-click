import { useEffect, useRef, useState } from "react";
import { useGameLevelStore } from "../../stores/game-level-store";
import { between } from "../../utils/random";
import Zombie from "@/assets/zombie.png";
import Goblin from "@/assets/goblin.gif";
import { EnemyOnLevel } from "@/domain/types";
type Params = {
  quantity: number;
  interval: number;
  randomizeIntervalEvery: number;
};

export const useEnemyFactory = ({
  interval,
  quantity,
  randomizeIntervalEvery,
}: Params) => {
  const { spawn, bulkSpawn } = useGameLevelStore((s) => s.actions);
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
        const extraSpawn = between(1, 5);

        const mapped = Array.from({ length: extraSpawn }).map(goblinFactory);

        bulkSpawn(mapped);
      }
      spawn(zombieFactory());

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

function zombieFactory(): EnemyOnLevel {
  return {
    id: crypto.randomUUID(),
    health: 100,
    attack: 10,
    image: Zombie,
    speed: 10,
    size: {
      height: 48,
      width: 48,
    },
    position: {
      x: between(0, 344),
      y: between(0, 24),
    },
  };
}

function goblinFactory(): EnemyOnLevel {
  return {
    id: crypto.randomUUID(),
    health: 30,
    attack: 30,
    speed: 50,
    image: Goblin,
    size: {
      height: 24,
      width: 24,
    },
    position: {
      x: between(0, 344),
      y: between(0, 24),
    },
  };
}
