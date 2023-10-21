import { EnemyOnLevel } from "@/modules/enemies/enemy-on-level";

export type EnemyRecipe = {
  spawnTime: number;
  enemy: EnemyOnLevel;
};
export type LevelModel = {
  id: string;
  number: number;
  background: string;
  enemies: () => Map<number, EnemyRecipe | EnemyRecipe[]>;
};
