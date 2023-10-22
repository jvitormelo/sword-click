import SlashSound from "@/assets/sounds/slash.mp3";
import { createCutAnimation } from "@/modules/skill/all/active/basic-cut/animation";
import { ActiveSkill } from "@/modules/skill/skill-on-level";
import {
  ActivateParams,
  Damage,
  SkillAnimationType,
  SkillCode,
  SkillDamageType,
} from "@/modules/skill/types";

import { between } from "@/utils/random";
import { playSound } from "@/utils/sound";

export class BasicCut extends ActiveSkill {
  code = SkillCode.BasicCut;
  name = "Basic Cut";
  description = "Cut the enemy in front of you";
  damage: Damage = {
    value: [10, 20],
    ailment: [],
    type: SkillDamageType.Physical,
  };
  icon: string = "";

  constructor() {
    super();
    this.cost = 5;
    this.animationType = SkillAnimationType.Element;
  }

  copy() {
    return new BasicCut();
  }

  activate({ pos, actions, scene }: ActivateParams) {
    const baseHeight = between(50, 80);
    const baseWidth = 3;

    const randomX = between(-5, 5);

    actions.damagePointArea(
      {
        pos: {
          x: pos.x + randomX,
          y: pos.y - baseHeight / 2,
        },
        size: {
          width: baseWidth,
          height: baseHeight,
        },
      },
      this.damage
    );
    playSound(SlashSound);
    scene.playAnimation(
      createCutAnimation({
        pos: { ...pos, x: pos.x + randomX },
        size: { width: baseWidth * this.aoe, height: baseHeight * this.aoe },
        style: {
          ...this.style,
          background: this.style.background ?? "white",
          border: this.style.border ?? "1px solid black",
        },
      }),
      500
    );
  }
}
