import { boardSize } from "@/constants";
import { between } from "@/utils/random";
import { EnemyRecipe } from "../level/level-selector";
import { EnemyFactory } from "./enemies-factory";

type MultipleSpawn = {
  every: number;
  quantity: [number, number];
};

export function generateEnemies(
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
        const spawnMultiple =
          counter % multipleSpawn.every === 0 && counter !== 0;

        if (spawnMultiple) {
          const [min, max] = multipleSpawn.quantity;
          const toSpawn = between(min, max);
          const spawnTime = getSpawnTime(interval, i);

          const y = between(0, boardSize.height * 0.2);

          // TODO > Improve this
          const mappedRecipes = Array(toSpawn)
            .fill(0)
            .map((_, i) => {
              const enemy = factory({
                pos: {
                  y: y + i * 24,
                },
              });

              return {
                spawnTime,
                enemy,
              };
            });

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
