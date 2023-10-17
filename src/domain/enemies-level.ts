import { distanceFromTop } from "../constants";
import { Position } from "../types";
import {
  Circle,
  areCircleAndRectangleTouching,
  arePointsTouching,
} from "../utils/geometry";
import { EnemyOnLevel, LevelModel } from "./types";

export type EnemiesAction = {
  spawn: (enemy: EnemyOnLevel) => void;
  damageLineArea: (
    position: {
      width: number;
      height: number;
    } & Position,
    damage: number
  ) => void;
  damageCircleArea: (
    circle: Circle,
    damage: number,
    enemiesHit: EnemyOnLevel[]
  ) => void;
  damageEnemy: (id: string, damage: number) => void;
  tick: () => void;
};

export class EnemiesLevel implements EnemiesAction {
  constructor(protected level: LevelModel) {}

  spawn(enemy: EnemyOnLevel) {
    this.level.enemies.set(enemy.id, enemy);
  }

  damageEnemy(id: string, damage: number) {
    const enemy = this.level.enemies.get(id);

    if (!enemy) return;

    enemy.health -= damage;

    this.removeDeadEnemies();
  }

  damageLineArea(
    {
      height,
      width,
      x,
      y,
    }: {
      width: number;
      height: number;
    } & Position,
    damage: number
  ) {
    for (const enemy of this.level.enemies.values()) {
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

    this.removeDeadEnemies();
  }

  damageCircleArea(
    circle: Circle,
    damage: number,
    enemiesHit: EnemyOnLevel[] = []
  ) {
    for (const enemy of this.level.enemies.values()) {
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

    this.removeDeadEnemies();
  }

  removeDeadEnemies() {
    for (const [key, enemy] of this.level.enemies) {
      if (enemy.health <= 0) {
        this.level.enemies.delete(key);
        this.level.gold += 10;
      }
    }
  }

  tick() {
    for (const enemy of this.level.enemies.values()) {
      const newPosY = enemy.position.y + 20;

      if (newPosY >= 320) {
        this.level.player.health -= 1;
      } else {
        enemy.position.y = newPosY;
      }
    }

    this.removeDeadEnemies();
  }
}
