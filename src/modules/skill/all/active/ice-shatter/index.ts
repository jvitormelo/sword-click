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
import { max } from "@/utils/number";

export class IceShatter implements ActiveSkill {
  id: string = SkillCode.IceShatter;
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
    value: [80, 120],
    ailment: [],
    type: SkillDamageType.Ice,
  };

  activate({ actions, pos, scene }: ActivateParams) {
    let totalChill = 0;

    const { enemiesHit } = actions.damagePointArea(
      {
        pos: {
          x: pos.x - 2,
          y: pos.y - 2,
        },
        size: {
          width: 4,
          height: 4,
        },
      },
      this.damage,
      {
        condition: (target) => target.ailments.includes(Ailment.Chill),
        beforeDamage: (target, damage) => {
          const chillQuantity = target.ailments.filter(
            (ailment) => ailment === Ailment.Chill
          ).length;
          totalChill += chillQuantity;
          const multiplier = 1 + (chillQuantity * 10) / 100;

          damage.value[0] *= multiplier;
          damage.value[1] += multiplier;
          target.ailments = target.ailments.filter(
            (ailment) => ailment !== Ailment.Chill
          );
        },
      }
    );

    if (enemiesHit.size === 0) return;

    this.aoe += totalChill / 10;

    const duration = 300;
    const maxSize = 120;
    const width = max(30 * this.aoe, maxSize);
    const height = max(30 * this.aoe, maxSize);

    actions.damagePointArea(
      {
        pos: {
          x: pos.x - width / 2,
          y: pos.y - height / 2,
        },
        size: { width, height },
      },
      this.damage,
      {
        condition: (enemy) => !enemiesHit.has(enemy.id),
      }
    );

    scene.playAnimation(
      {
        src: IceShatterImage,
        width,
        height,
        style: {
          position: "absolute",
          zIndex: 90,
          left: pos.x - width / 2,
          translateY: "-50%",
          top: pos.y,
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
