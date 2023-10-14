import { create } from "zustand";
import { Position } from "../../types";
import { distanceFromTop } from "../../constants";
import { arePointsTouching } from "../../utils/geometry";

type Store = {
  enemies: {
    id: string;
    health: number;
    position: {
      x: number;
      y: number;
    };
  }[];
  actions: {
    cutPosition: (
      position: {
        width: number;
        height: number;
      } & Position,
      damage: number
    ) => void;
  };
};

export const useEnemiesStore = create<Store>((set) => ({
  enemies: [
    {
      id: "1",
      health: 100,
      position: {
        x: 0,
        y: 0,
      },
    },
    {
      id: "2",
      health: 100,
      position: {
        x: 0,
        y: 60,
      },
    },
  ],

  actions: {
    cutPosition: ({ height, width, x, y }, damage) => {
      set((state) => {
        const mappedEnemies = state.enemies.map((enemy) => {
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
        });

        return {
          enemies: mappedEnemies,
        };
      });
    },
  },
}));

export const useEnemiesActions = () => {
  return useEnemiesStore((state) => state.actions);
};
