import SlashSound from "@/assets/sounds/slash.mp3";
import { BasicCutAnimation } from "@/modules/skill/all/active/basic-cut/animation";
import {
  ActivateParams,
  ActiveSkill,
  SkillAnimationType,
  SkillCode,
  SkillActivationType,
  SkillDamageType,
} from "@/modules/skill/types";
import { playAnimation } from "@/stores/animation-store";
import { gameActions } from "@/stores/game-level-store";

import { between } from "@/utils/random";
import { playSound } from "@/utils/sound";
import { CSSProperties } from "react";

export class BasicCut implements ActiveSkill {
  id = "basic-cut";
  aoe: number = 1;
  code: SkillCode = SkillCode.BasicCut;
  cost: number = 5;
  damage: [number, number] = [30, 50];
  description: string = "Cut the enemy in front of you";
  icon: string = "";
  name: string = "Basic Cut";
  style: CSSProperties = {};
  type: SkillActivationType.Active = SkillActivationType.Active;
  animationType: SkillAnimationType = SkillAnimationType.Element;
  damageType: SkillDamageType = SkillDamageType.Physical;

  copy() {
    return new BasicCut();
  }

  activate({ pos }: ActivateParams) {
    const baseHeight = between(50, 80);
    const baseWidth = 3;

    const randomX = between(-5, 5);

    gameActions().damageLineArea(
      {
        x: pos.x + randomX,
        y: pos.y - baseHeight / 2,
        width: baseWidth,
        height: baseHeight,
      },
      this.damage,
      []
    );
    playSound(SlashSound);
    playAnimation(
      BasicCutAnimation({
        position: { ...pos, x: pos.x + randomX },
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