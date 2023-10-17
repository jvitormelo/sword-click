import { create } from "zustand";
import { Position } from "../../types";
import { distanceFromTop } from "../../constants";
import {
  Circle,
  areCircleAndRectangleTouching,
  arePointsTouching,
} from "../../utils/geometry";
import { useEffect, useRef, useState } from "react";
import { between } from "../../utils/random";
import { usePlayerStore } from "../player/player-store";
import { useGoldStore } from "../../stores/gold-store";

export type Enemy = {
  id: string;
  health: number;
  position: {
    x: number;
    y: number;
  };
};

type Store = {
  enemies: Map<string, Enemy>;
  actions: {
    spawn: (enemy: Enemy) => void;
    moveToPlayer: (id: string, distance: number) => void;
    cutPosition: (
      position: {
        width: number;
        height: number;
      } & Position,
      damage: number
    ) => void;
    circleDamage: (circle: Circle, damage: number) => Enemy[];
    damageEnemy: (id: string, damage: number) => void;
  };
};

function enemiesCleanup(value: Map<string, Enemy>) {
  const newValue = new Map();

  for (const [key, enemy] of value) {
    if (enemy.health > 0) {
      newValue.set(key, enemy);
    } else {
      useGoldStore.getState().generateGold(enemy);
    }
  }

  return newValue;
}

export const useEnemiesOnFieldStore = create<Store>((set) => ({
  enemies: new Map(),

  actions: {
    spawn: (enemy: Enemy) => {
      set((state) => {
        return {
          enemies: new Map(state.enemies).set(enemy.id, enemy),
        };
      });
    },
    moveToPlayer: (id, distance) => {
      set((state) => {
        const foundEnemy = state.enemies.get(id);

        if (!foundEnemy) return state;

        const newPosY = foundEnemy.position.y + distance;

        // hard coded danger position

        if (newPosY >= 320) {
          state.enemies.delete(foundEnemy.id);
          usePlayerStore.getState().actions.takeDamage(10);
        } else {
          foundEnemy.position.y = newPosY;
        }

        return {
          enemies: new Map(state.enemies),
        };
      });
    },
    cutPosition: ({ height, width, x, y }, damage) => {
      set((state) => {
        for (const enemy of state.enemies.values()) {
          const isTouching = arePointsTouching(
            {
              x: enemy.position.x,
              y: enemy.position.y,
              width: 48,
              height: 48,
            },
            {
              x: x - distanceFromTop.x,
              y: y - distanceFromTop.y,
              width,
              height,
            }
          );

          if (isTouching) {
            enemy.health -= damage;
          }
        }

        return {
          enemies: enemiesCleanup(state.enemies),
        };
      });
    },
    circleDamage(circle, damage) {
      const enemiesHit: Enemy[] = [];
      set((state) => {
        for (const enemy of state.enemies.values()) {
          if (
            areCircleAndRectangleTouching(circle, {
              x: enemy.position.x,
              height: 48,
              width: 48,
              y: enemy.position.y,
            })
          ) {
            enemiesHit.push(enemy);
            enemy.health -= damage;
          }
        }
        return {
          enemies: enemiesCleanup(state.enemies),
        };
      });

      return enemiesHit;
    },
    damageEnemy(id, damage) {
      set((state) => {
        const enemy = state.enemies.get(id);

        if (!enemy) return state;

        enemy.health -= damage;

        return {
          enemies: enemiesCleanup(state.enemies),
        };
      });
    },
  },
}));

export const useEnemiesOnFieldActions = () => {
  return useEnemiesOnFieldStore((state) => state.actions);
};

export const useEnemyFactory = ({
  interval,
  quantity,
  randomizeIntervalEvery,
}: {
  quantity: number;
  interval: number;
  randomizeIntervalEvery: number;
}) => {
  const { spawn } = useEnemiesOnFieldActions();
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

        for (let i = 0; i < extraSpawn; i++) {
          if (spawnedQuantity.current >= quantity) return;

          const zombie: Enemy = {
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

      const zombie: Enemy = {
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
