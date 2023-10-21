import { EnemyOnLevel } from "@/modules/enemies/enemy-on-level";
import { EnemyRecipe, LevelModel } from "@/modules/level/types";

export class LevelOnLevel implements Omit<LevelModel, "enemies"> {
  enemies: Map<number, EnemyRecipe | EnemyRecipe[]>;
  id: string;
  background: string;
  number: number;

  constructor(level: LevelModel) {
    this.id = level.id;
    this.background = level.background;
    this.number = level.number;
    this.enemies = level.enemies();
  }

  tick(levelEnemies: Map<string, EnemyOnLevel>, totalTick: number) {
    for (const [key, recipe] of this.enemies) {
      if (Array.isArray(recipe)) {
        for (const enemyRecipe of recipe) {
          if (totalTick >= enemyRecipe.spawnTime) {
            levelEnemies.set(enemyRecipe.enemy.id, enemyRecipe.enemy);
            this.enemies.delete(key);
          }
        }
      } else {
        if (totalTick >= recipe.spawnTime) {
          levelEnemies.set(recipe.enemy.id, recipe.enemy);
          this.enemies.delete(key);
        }
      }
    }
  }
}
