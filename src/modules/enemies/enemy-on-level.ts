import { PlayerOnLevel } from "@/modules/player/types";
import { Position, Size } from "@/types";
import { FPS, boardSize, distanceFromTop } from "../../constants";
import { EnemyModel } from "./types";
import { Ailment, Damage, SkillDamageType } from "@/modules/skill/types";
import { between } from "@/utils/random";
import { skillDamageTypeColors } from "@/modules/skill/constants";

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

  takeDamage(damage: Damage) {
    const value = between(damage.value[0], damage.value[1]);

    spawnRandomNumber(
      this.position.x,
      this.position.y,
      value.toString(),
      damage.type
    );
    this.health -= value;
    this.ailments.push(...damage.ailment);
  }

  tick({ totalTicks, player }: TickParams) {
    const newPosY = this.position.y + this.speed / FPS;

    if (this.hasAilment(Ailment.Burn)) {
      this.takeDamage({
        value: [1, 3],
        ailment: [],
        type: SkillDamageType.Fire,
      });
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

function spawnRandomNumber(
  x: number,
  y: number,
  content: string,
  damageType: SkillDamageType
) {
  const span = document.createElement("span");

  span.textContent = content;
  span.style.position = "absolute";
  span.style.left = `${distanceFromTop.x + x + Math.random() * 20 - 10}px`;
  span.style.top = `${distanceFromTop.y + y + Math.random() * 20 - 10}px`;
  span.style.transform = "translate(50%, -50%)";
  span.style.zIndex = "100";
  span.style.fontWeight = "bold";
  span.style.textShadow = `0 0 3px black`;

  // shade of red
  span.style.color = skillDamageTypeColors[damageType];

  document.body.appendChild(span);

  setTimeout(() => {
    span.remove();
  }, 300);
}
