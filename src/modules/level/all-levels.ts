import { LevelModel } from "@/modules/level/types";
import { goblinFactory, zombieFactory } from "../enemies/enemies-factory";
import { generateEnemies } from "../enemies/generate-enemies";

import PlainsBackground from "@/assets/plains-background.jpeg";

export const allLevels: Array<LevelModel> = [
  {
    id: "level-1",
    number: 1,
    background: PlainsBackground,
    enemies: () =>
      generateEnemies([
        {
          factory: zombieFactory,
          quantity: 10,
          interval: 400,
          multipleSpawn: {
            every: 3,
            quantity: [4, 6],
          },
        },
      ]),
  },
  {
    id: "level-2",
    number: 2,
    background: PlainsBackground,
    enemies: () =>
      generateEnemies([
        {
          factory: zombieFactory,
          quantity: 30,
          multipleSpawn: {
            every: 4,
            quantity: [10, 15],
          },
          interval: 600,
        },
      ]),
  },
  {
    id: "level-3",
    number: 3,
    background: PlainsBackground,
    enemies: () =>
      generateEnemies([
        {
          factory: zombieFactory,
          quantity: 15,
          interval: 300,
          multipleSpawn: {
            every: 4,
            quantity: [1, 5],
          },
        },
        {
          factory: goblinFactory,
          quantity: 15,
          interval: 200,
          startAt: 2000,
          multipleSpawn: {
            every: 5,
            quantity: [0, 1],
          },
        },
      ]),
  },
  {
    id: "level-4",
    background: PlainsBackground,
    number: 4,
    enemies: () =>
      generateEnemies([
        {
          factory: zombieFactory,
          quantity: 30,
          multipleSpawn: {
            every: 4,
            quantity: [1, 5],
          },
          interval: 600,
        },
        {
          factory: goblinFactory,
          quantity: 30,
          interval: 200,
          startAt: 1000,
          multipleSpawn: {
            every: 5,
            quantity: [1, 5],
          },
        },
        {
          factory: zombieFactory,
          quantity: 30,
          multipleSpawn: {
            every: 4,
            quantity: [1, 5],
          },
          interval: 600,
          startAt: 2000,
        },
        {
          factory: goblinFactory,
          quantity: 30,
          interval: 200,
          startAt: 1600,
          multipleSpawn: {
            every: 5,
            quantity: [1, 5],
          },
        },
        {
          factory: zombieFactory,
          quantity: 30,
          multipleSpawn: {
            every: 4,
            quantity: [1, 5],
          },
          interval: 600,
          startAt: 3000,
        },
      ]),
  },
];
