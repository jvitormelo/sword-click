import { PlayerOnLevel } from "@/modules/player/types";
import { Position, Size } from "@/types";
import { FPS, boardSize } from "../../constants";
import { EnemyModel } from "./types";

export enum Ailment {
  Burn = "Burn",
  Chill = "Chill",
}

type TickParams = {
  totalTicks: number;
  player: PlayerOnLevel;
};

export class EnemyOnLevel {
  id: string = "";
  image: string = "";
  isAttacking: boolean = false;
  name: string = "";
  position: Position = { x: 0, y: 0 };
  size: Size = { width: 0, height: 0 };
  private baseSpeed: number = 0;

  attack: number = 0;
  /** Every MS */
  attackSpeed: number = 0;
  health: number = 0;
  ailments: Ailment[] = [];

  constructor(protected enemy: EnemyModel) {
    Object.assign(this, enemy);
    this.baseSpeed = enemy.speed;
  }

  hasAilment(ailment: Ailment) {
    return this.ailments.includes(ailment);
  }

  get speed() {
    if (this.hasAilment(Ailment.Chill)) {
      return this.baseSpeed / 2;
    }

    return this.baseSpeed;
  }

  set speed(value) {
    this.baseSpeed = value;
  }

  tick({ totalTicks, player }: TickParams) {
    const newPosY = this.position.y + this.speed / FPS;

    if (this.hasAilment(Ailment.Burn)) {
      this.health -= 10;
    }

    const isInAttackRange =
      newPosY + this.size.height / 2 >= boardSize.dangerZone;

    if (isInAttackRange) {
      this.position.y = boardSize.dangerZone - this.size.height / 2;

      const isAttackReady = totalTicks % this.attackSpeed === 0;

      if (isAttackReady) {
        this.isAttacking = true;

        player.life -= this.attack;
      }
    } else {
      this.isAttacking = false;
      this.position.y = newPosY;
    }
  }
}
