import IceOrbImage from "@/assets/skills/ice-orb.jpeg";
import Icon from "@/assets/skills/icons/ice-orb-icon.png";
import IceHitSound from "@/assets/sounds/ice-hit.mp3";
import IceOrbSound from "@/assets/sounds/ice-orb.mp3";
import { boardSize } from "@/constants";
import {
  ActivateParams,
  ActiveSkill,
  Ailment,
  Damage,
  SkillActivationType,
  SkillAnimationType,
  SkillCode,
  SkillDamageType,
} from "@/modules/skill/types";

import { EntityCode, EntityOnLevel } from "@/modules/entities/types";
import { Position, Size } from "@/types";
import { CSSProperties } from "react";
import { pureDamagePointArea } from "@/modules/level/game-level-store";
import { EnemyOnLevel } from "@/modules/enemies/enemy-on-level";
import { playSound } from "@/utils/sound";

export class IceOrb implements ActiveSkill {
  id: string = "ice-orb";
  animationType: SkillAnimationType = SkillAnimationType.Image;
  aoe: number = 1;
  code: SkillCode = SkillCode.IceOrb;
  cost: number = 50;
  damage: Damage = {
    value: [5, 20],
    ailment: [],
    type: SkillDamageType.Ice,
  };
  description: string = "A ball of ice.";
  icon: string = Icon;
  name: string = "Ice Orb";
  style: CSSProperties = {};
  type: SkillActivationType.Active = SkillActivationType.Active;

  activate({ actions, pos }: ActivateParams) {
    actions.addEntity(new IceOrbEntity(pos));
  }

  copy() {
    return new IceOrb();
  }
}

class IceOrbEntity implements EntityOnLevel {
  id: string;
  position: Position;

  target: Position;

  constructor(initial: Position) {
    this.position = {
      x: initial.x,
      y: boardSize.dangerZone,
    };
    this.target = {
      x: initial.x,
      y: 0,
    };

    this.id = `${this.code}-${Math.random()}`;
  }

  code: EntityCode = EntityCode.IceOrb;
  hitSound: string = IceHitSound;
  image: string = IceOrbImage;
  size: Size = { width: 50, height: 50 };
  speed: number = 20;
  sound: string = IceOrbSound;
  removable: boolean = false;

  tick(level: { enemies: Map<string, EnemyOnLevel> }) {
    const { enemiesHit } = pureDamagePointArea(
      level.enemies,
      {
        pos: this.position,
        size: this.size,
      },
      {
        ailment: [Ailment.Chill],
        type: SkillDamageType.Ice,
        value: [10, 20],
      }
    );

    if (enemiesHit.size > 0) {
      playSound(this.hitSound, 200);
      this.position.y -= this.speed / 3;
    } else {
      this.position.y -= this.speed;
    }

    if (this.position.y < 0) {
      this.removable = true;
    }
  }
}
