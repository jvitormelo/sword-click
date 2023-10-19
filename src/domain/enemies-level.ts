import { FPS, boardSize } from "../constants";
import { Position } from "../types";
import {
  Circle,
  areCircleAndRectangleTouching,
  arePointsTouching,
} from "../utils/geometry";
import { EnemyOnLevel, LevelModel } from "./types";

export enum Ailment {
  Burn = "Burn",
}

export type EnemiesAction = {
  spawn: (enemy: EnemyOnLevel) => void;
  damageLineArea: (
    position: {
      width: number;
      height: number;
    } & Position,
    damage: number,
    ailments: Ailment[]
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
    damage: number,
    ailments: Ailment[]
  ) {
    for (const enemy of this.level.enemies.values()) {
      const movementMargin = enemy.speed / FPS / 2;

      const isTouching = arePointsTouching(
        {
          x: enemy.position.x,
          y: enemy.position.y - movementMargin,
          width: enemy.size.width,
          height: enemy.size.height + movementMargin * 2,
        },
        {
          x,
          y,
          width,
          height,
        }
      );

      if (isTouching) {
        enemy.health -= damage;
        enemy.ailments = [...enemy.ailments, ...ailments];
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
          height: enemy.size.height,
          width: enemy.size.width,
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
      const newPosY = enemy.position.y + enemy.speed / FPS;

      if (enemy.ailments.includes(Ailment.Burn)) {
        enemy.health -= 10;
      }

      const isInAttackRange =
        newPosY + enemy.size.height / 2 >= boardSize.dangerZone;

      if (isInAttackRange) {
        this.level.player.health -= enemy.attack;
        enemy.position.y = boardSize.dangerZone - enemy.size.height / 2;
      } else {
        enemy.position.y = newPosY;
      }
    }

    this.removeDeadEnemies();
  }
}
