import IceShatterImage from "@/assets/skills/ice-shatter.svg";
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
import { CSSProperties } from "react";
import IceShatterSound from "@/assets/sounds/ice-shatter.mp3";

export class IceShatter implements ActiveSkill {
  id: string = "ice-shatter";
  aoe: number = 1;
  code: SkillCode = SkillCode.IceShatter;
  cost: number = 5;
  description: string = "Shatter a chilled enemy";
  icon: string = IceShatterImage;
  name: string = "Ice Shatter";
  style: CSSProperties = {};
  type: SkillActivationType.Active = SkillActivationType.Active;

  animationType: SkillAnimationType = SkillAnimationType.Image;

  damage: Damage = {
    value: [100, 200],
    ailment: [],
    type: SkillDamageType.Ice,
  };

  activate({ actions, pos, scene }: ActivateParams) {
    const { enemiesHit } = actions.damagePointArea(
      {
        pos,
        size: {
          width: 1,
          height: 1,
        },
      },
      this.damage,
      {
        condition: (target) => target.ailments.includes(Ailment.Chill),
        beforeDamage: (target, damage) => {
          const chillQuantity = target.ailments.filter(
            (ailment) => ailment === Ailment.Chill
          ).length;
          const multiplier = 1 + (chillQuantity * 10) / 100;

          damage.value[0] *= multiplier;
          damage.value[1] += multiplier;
        },
      }
    );
    4;

    if (enemiesHit.size === 0) return;
    5;

    const duration = 300;

    scene.playAnimation(
      {
        src: IceShatterImage,
        width: 30,
        height: 30,
        style: {
          position: "absolute",
          zIndex: 90,
          left: pos.x,
          top: pos.y,
          translateX: "-50%",
          translateY: "-50%",
        },
        initial: {
          opacity: 0,
          scale: 0,
        },
        animate: {
          opacity: 1,
          translateX: [0, 5, -5, 5, -5, 5, -5, 5, -5, 5, -5, 0],
          scale: 2,
        },
        transition: {
          duration: 0.2,
        },
      },
      duration
    );
    scene.playSound(IceShatterSound, duration);
  }

  copy = () => new IceShatter();
}
