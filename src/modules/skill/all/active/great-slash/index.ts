import SlashSound from "@/assets/sounds/slash.mp3";
import {
  ActivateParams,
  ActiveSkill,
  Damage,
  SkillActivationType,
  SkillAnimationType,
  SkillCode,
  SkillDamageType,
} from "@/modules/skill/types";

import GreatSlashIcon from "@/assets/skills/icons/great-slash.png";

import { playSound } from "@/utils/sound";
import { CSSProperties } from "react";
import { createCutAnimation } from "@/modules/skill/all/active/basic-cut/animation";

export class GreatSlash implements ActiveSkill {
  id: string = "great-slash";
  animationType: SkillAnimationType = SkillAnimationType.Element;
  aoe: number = 1;
  code: SkillCode = SkillCode.GreatSlash;
  cost: number = 15;
  damage: Damage = {
    value: [30, 50],
    ailment: [],
    type: SkillDamageType.Physical,
  };
  description: string = "Slash Vertically a great area";
  icon: string = GreatSlashIcon;
  name: string = "Great Slash";
  style: CSSProperties = {
    border: "1px solid black",
  };
  type: SkillActivationType.Active = SkillActivationType.Active;

  activate({ actions, pos, scene }: ActivateParams) {
    const width = 15;
    const height = 300;

    actions.damagePointArea(
      {
        pos: {
          x: pos.x,
          y: pos.y - height / 2,
        },
        size: {
          width,
          height,
        },
      },
      this.damage
    );
    scene.playAnimation(
      createCutAnimation({
        style: this.style,
        pos,
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
