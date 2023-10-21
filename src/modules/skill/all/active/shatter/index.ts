import IceShatter from "@/assets/skills/ice-shatter.svg";
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

export class Shatter implements ActiveSkill {
  id: string = "ice-shatter";
  aoe: number = 1;
  code: SkillCode = SkillCode.IceShatter;
  cost: number = 5;
  description: string = "Shatter a chilled enemy";
  icon: string = IceShatter;
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
    actions.damagePointArea(
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

    scene.playAnimation(
      {
        src: IceShatter,
        width: 30,
        height: 30,
        initial: {
          scale: 0,
        },
        animate: {
          scale: 1,
        },
        transition: {
          duration: 0.1,
        },
      },
      100
    );
  }

  copy = () => new Shatter();
}
