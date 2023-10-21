import Icon from "@/assets/skills/icons/fire-slash.png";
import { boardSize } from "@/constants";

import FireSound from "@/assets/sounds/fire.mp3";

import FireSlashHit from "@/assets/skills/fire-slash-hit.png";
import {
  ActivateParams,
  ActiveSkill,
  Ailment,
  AnimationObject,
  Damage,
  SkillActivationType,
  SkillAnimationType,
  SkillCode,
  SkillDamageType,
} from "@/modules/skill/types";
import { playSound } from "@/utils/sound";
import { CSSProperties } from "react";

export class FireSlash implements ActiveSkill {
  id = "fire-slash";
  aoe = 8;
  code: SkillCode = SkillCode.FireSlash;
  cost = 30;
  damage: Damage = {
    type: SkillDamageType.Fire,
    value: [30, 40],
    ailment: [Ailment.Burn],
  };
  description = "Horizontal slash that burns enemies";
  icon = Icon;
  name = "Fire Slash";
  type: SkillActivationType.Active = SkillActivationType.Active;
  style: CSSProperties = {};
  animationType: SkillAnimationType = SkillAnimationType.Image;

  activate({ pos, actions, scene }: ActivateParams) {
    actions.damagePointArea(
      {
        pos: {
          x: 0,
          y: pos.y,
        },
        size: {
          width: boardSize.width,
          height: 10,
        },
      },
      this.damage
    );

    const animationDuration = 300;

    const fireSlashHitAnimation: AnimationObject = {
      src: FireSlashHit,
      width: 50,
      style: {
        ...this.style,
        position: "absolute",
        top: pos.y,
        zIndex: 100,
        translateY: "-50%",
      },
      animate: {
        translateX: [boardSize.width, 0],
        rotate: [0, -45, -90],
        opacity: [1, 1, 0.8],
        transition: {
          duration: 0.3,
          ease: "easeInOut",
        },
      },
    };

    scene.playAnimation(fireSlashHitAnimation, animationDuration);

    playSound(FireSound, animationDuration);
  }

  copy() {
    return new FireSlash();
  }
}
