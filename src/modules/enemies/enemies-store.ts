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
        from: Position;
        to: Position;
      },
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
    cutPosition: ({ from, to }, damage) => {
      set((state) => {
        const formattedFrom = {
          x: from.x - distanceFromTop.x,
          y: from.y - distanceFromTop.y,
        };

        const formattedTo = {
          x: to.x - distanceFromTop.x,
          y: to.y - distanceFromTop.y,
        };

        const mappedEnemies = state.enemies.map((enemy) => {
          const cutWidth = formattedTo.x - formattedFrom.x;
          const cutHeight = formattedTo.y - formattedFrom.y;

          const isTouching = arePointsTouching(
            {
              x: enemy.position.x,
              y: enemy.position.y,
              width: 48,
              height: 48,
            },
            {
              x: formattedFrom.x,
              y: formattedFrom.y,
              width: cutWidth,
              height: cutHeight,
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
