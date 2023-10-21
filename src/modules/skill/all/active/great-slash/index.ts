import {
  ActivateParams,
  ActiveSkill,
  Damage,
  SkillActivationType,
  SkillAnimationType,
  SkillCode,
  SkillDamageType,
} from "@/modules/skill/types";
import SlashSound from "@/assets/sounds/slash.mp3";

import GreatSlashIcon from "@/assets/skills/icons/great-slash.png";
import { CSSProperties } from "react";
import { playAnimation } from "@/stores/animation-store";
import { BasicCutAnimation } from "@/modules/skill/all/active/basic-cut/animation";
import { playSound } from "@/utils/sound";
import { gameActions } from "@/stores/game-level-store";

export class GreatSlash implements ActiveSkill {
  id: string = "great-slash";
  animationType: SkillAnimationType = SkillAnimationType.Element;
  aoe: number = 1;
  code: SkillCode = SkillCode.GreatSlash;
  cost: number = 15;
  damage: Damage = [30, 50];
  damageType: SkillDamageType = SkillDamageType.Physical;
  description: string = "Slash Vertically a great area";
  icon: string = GreatSlashIcon;
  name: string = "Great Slash";
  style: CSSProperties = {
    border: "1px solid black",
  };
  type: SkillActivationType.Active = SkillActivationType.Active;

  activate(params: ActivateParams) {
    const width = 15;
    const height = 300;

    gameActions().damageLineArea(
      {
        x: params.pos.x,
        y: params.pos.y - height / 2,
        width,
        height,
      },
      this.damage,
      []
    );
    playAnimation(
      BasicCutAnimation({
        style: this.style,
        position: params.pos,
        size: {
          height,
          width,
        },
      }),
      500
    );
    playSound(SlashSound);
  }

  copy() {
    return new GreatSlash();
  }
}
