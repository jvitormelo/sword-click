import { create } from "zustand";
import { Position } from "../../types";
import { distanceFromTop } from "../../constants";
import { arePointsTouching } from "../../utils/geometry";
import { useEffect, useRef } from "react";
import { between } from "../../utils/random";
export type Enemy = {
  id: string;
  health: number;
  position: {
    x: number;
    y: number;
  };
};

type Store = {
  enemies: Array<Enemy>;
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
  };
};

export const useEnemiesOnFieldStore = create<Store>((set) => ({
  enemies: [],

  actions: {
    spawn: (enemy: Enemy) => {
      set((state) => {
        return {
          enemies: [...state.enemies, enemy],
        };
      });
    },
    moveToPlayer: (id, distance) => {
      set((state) => {
        const mappedEnemies = state.enemies.map((enemy) => {
          if (enemy.id === id) {
            return {
              ...enemy,
              position: {
                x: enemy.position.x,
                y: enemy.position.y + distance,
              },
            };
          }

          return enemy;
        });

        return {
          enemies: mappedEnemies,
        };
      });
    },
    cutPosition: ({ height, width, x, y }, damage) => {
      set((state) => {
        const mappedEnemies = state.enemies
          .map((enemy) => {
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
              return {
                ...enemy,
                health: enemy.health - damage,
              };
            }

            return enemy;
          })
          .filter((enemy) => enemy.health > 0);

        return {
          enemies: mappedEnemies,
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
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (spawnedQuantity.current >= quantity) {
        clearInterval(intervalId);
        return;
      }

      if (
        spawnedQuantity.current !== 0 &&
        spawnedQuantity.current % randomizeIntervalEvery === 0
      ) {
        const extraSpawn = between(1, 5);

        for (let i = 0; i < extraSpawn; i++) {
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

        console.log("randomize interval");
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

    return () => {
      clearInterval(intervalId);
    };
  }, [interval]);
};
