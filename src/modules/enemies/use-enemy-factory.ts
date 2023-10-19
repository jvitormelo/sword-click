import { useEffect, useRef, useState } from "react";
import { useGameLevelStore } from "../../stores/game-level-store";
import { between } from "../../utils/random";
import Zombie from "@/assets/zombie.png";
import Goblin from "@/assets/goblin.gif";
import { EnemyOnLevel } from "@/domain/types";
import { boardSize } from "@/constants";
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

export function zombieFactory(): EnemyOnLevel {
  const size = {
    height: 48,
    width: 48,
  };
  return {
    id: crypto.randomUUID(),
    health: 100,
    attack: 6,
    image: Zombie,
    speed: 30,
    size: size,
    position: {
      x: between(0, boardSize.width - size.width),
      y: between(0, 24),
    },
    ailments: [],
  };
}

export function goblinFactory(): EnemyOnLevel {
  const size = {
    height: 24,
    width: 24,
  };
  return {
    id: crypto.randomUUID(),
    health: 30,
    attack: 5,
    speed: 80,
    image: Goblin,
    size,
    position: {
      x: between(0, boardSize.width - size.width),
      y: between(0, 30),
    },
    ailments: [],
  };
}
