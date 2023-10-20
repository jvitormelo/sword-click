import { EnemyOnLevel } from "@/domain/types";
import { goblinFactory, zombieFactory } from "../enemies/enemies-factory";
import { EnemyRecipe, Level } from "./level-selector";

import PlainsBackground from "@/assets/plains-background.jpeg";
import { between } from "@/utils/random";

type EnemyFactory = () => EnemyOnLevel;

export const allLevels: Array<Level> = [
  {
    id: "level-1",
    number: 1,
    background: PlainsBackground,
    enemies: generateEnemies([
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
    enemies: generateEnemies([
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
    enemies: generateEnemies([
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
    enemies: generateEnemies([
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

type MultipleSpawn = {
  every: number;
  quantity: [number, number];
};

function generateEnemies(
  enemyFactories: Array<{
    factory: EnemyFactory;
    quantity: number;
    multipleSpawn: MultipleSpawn;
    interval: number;
    startAt?: number;
  }>
) {
  const enemies: Map<number, EnemyRecipe[] | EnemyRecipe> = new Map();

  enemyFactories.forEach(
    ({ factory, quantity, multipleSpawn, interval, startAt = 0 }) => {
      function getSpawnTime(interval: number, i: number) {
        return interval * (i + 1) + startAt;
      }
      let counter = 0;

      for (let i = 0; i < quantity; i++) {
        if (counter % multipleSpawn.every === 0 && counter !== 0) {
          const [min, max] = multipleSpawn.quantity;
          const toSpawn = between(min, max);
          const spawnTime = getSpawnTime(interval, i);

          const mappedRecipes = Array(toSpawn)
            .fill(0)
            .map(() => ({
              spawnTime,
              enemy: factory(),
            }));

          const current = enemies.get(spawnTime);

          if (current) {
            if (Array.isArray(current)) {
              current.push(...mappedRecipes);
            } else {
              enemies.set(spawnTime, [current, ...mappedRecipes]);
            }
          } else {
            enemies.set(spawnTime, mappedRecipes);
          }
        }

        const spawnTime = getSpawnTime(interval, i);

        const current = enemies.get(spawnTime);
        const enemyRecipe = {
          spawnTime,
          enemy: factory(),
        };

        if (current) {
          if (Array.isArray(current)) {
            current.push(enemyRecipe);
          } else {
            enemies.set(spawnTime, [current, enemyRecipe]);
          }
        } else {
          enemies.set(spawnTime, enemyRecipe);
        }

        counter++;
      }
    }
  );

  return enemies;
}

console.log(allLevels);
