import IceOrbImage from "@/assets/skills/ice-orb.jpeg";
import Icon from "@/assets/skills/icons/ice-orb-icon.png";
import IceHitSound from "@/assets/sounds/ice-hit.mp3";
import IceOrbSound from "@/assets/sounds/ice-orb.mp3";
import { boardSize, durationSynced } from "@/constants";
import {
  ActivateParams,
  Ailment,
  AnimationObject,
  Damage,
  SkillCode,
  SkillDamageType,
} from "@/modules/skill/types";

import { EnemyOnLevel } from "@/modules/enemies/enemy-on-level";
import { EntityCode, EntityOnLevel } from "@/modules/entities/types";
import { pureDamagePointArea } from "@/modules/level/game-level-store";
import { Position, Size } from "@/types";
import { playSound } from "@/utils/sound";
import { ActiveSkill } from "@/modules/skill/skill-on-level";

export class IceOrb extends ActiveSkill {
  icon: string = Icon;
  name: string = "Ice Orb";
  code: SkillCode = SkillCode.IceOrb;
  cost: number = 50;
  damage: Damage = {
    value: [5, 20],
    ailment: [],
    type: SkillDamageType.Ice,
  };
  description: string = "A ball of ice.";

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
      x: 0,
      y: initial.y - this.size.height / 2,
    };
    this.target = {
      x: boardSize.width,
      y: initial.y - this.size.height / 2,
    };

    this.id = `${this.code}-${Math.random()}`;
  }

  code: EntityCode = EntityCode.IceOrb;
  hitSound: string = IceHitSound;
  image: string = IceOrbImage;
  size: Size = { width: 50, height: 50 };
  speed: number = 40;
  sound: string = IceOrbSound;
  removable: boolean = false;

  public get animationObject(): AnimationObject {
    console.log("chamou");
    return {
      className: "absolute rounded-full",
      animate: {
        scale: [1, 1.1, 1],
        left: this.position.x,
        top: this.position.y,
        rotate: [0, 360],
        transition: {
          duration: durationSynced,
          ease: "linear",
          scale: {
            duration: 1,
            repeat: Infinity,
            ease: "linear",
          },
          rotate: {
            duration: 1,
            repeat: Infinity,
            ease: "linear",
          },
        },
      },
      initial: { left: this.position.x, top: this.position.y },
      width: this.size.width,
      height: this.size.height,
      src: this.image,
      style: {
        // Add this line for the `style` prop to include CSS properties
        position: "absolute",
        borderRadius: "50%",
      },
    };
  }

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
      this.position.x += this.speed / 3;
    } else {
      this.position.x += this.speed;
    }

    if (this.position.x >= boardSize.width) {
      this.removable = true;
    }
  }
}
