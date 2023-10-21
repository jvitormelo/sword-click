import Icon from "@/assets/skills/icons/fire-slash.png";
import { boardSize } from "@/constants";
import { gameActions } from "@/stores/game-level-store";
import { between } from "@/utils/random";

import FireSound from "@/assets/sounds/fire.mp3";
import { Ailment } from "@/modules/enemies/enemies-level";

import { FireSlashAnimation } from "@/modules/skill/all/active/fire-slash/animation";
import {
  ActivateParams,
  ActiveSkill,
  SkillAnimationType,
  SkillCode,
  SkillActivationType,
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
  damage = [30, 50] as [number, number];
  description = "Deals 30-50 damage to all enemies in a 8 tile radius.";
  icon = Icon;
  name = "Fire Slash";
  type: SkillActivationType.Active = SkillActivationType.Active;
  style: CSSProperties = {};
  animationType: SkillAnimationType = SkillAnimationType.Image;
  damageType: SkillDamageType = SkillDamageType.Elemental;

  activate({ pos }: ActivateParams) {
    gameActions().damageLineArea(
      {
        x: 0,
        y: pos.y,
        width: boardSize.width,
        height: 10,
      },
      between(this.damage[0], this.damage[1]),
      [Ailment.Burn]
    );

    const animationDuration = 300;

    playAnimation(
      FireSlashAnimation({ ...pos, style: this.style }),
      animationDuration
    );

    playSound(FireSound, animationDuration);
  }
}
