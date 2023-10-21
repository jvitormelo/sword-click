import Icon from "@/assets/skills/icons/fire-slash.png";
import { boardSize } from "@/constants";

import FireSound from "@/assets/sounds/fire.mp3";

import { FireSlashAnimation } from "@/modules/skill/all/active/fire-slash/animation";
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
import { playAnimation } from "@/stores/animation-store";
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

  activate({ pos, actions }: ActivateParams) {
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

    playAnimation(
      FireSlashAnimation({ ...pos, style: this.style }),
      animationDuration
    );

    playSound(FireSound, animationDuration);
  }

  copy() {
    return new FireSlash();
  }
}
