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
import FireNovaImg from "@/assets/skills/fire-nova.png";
import { CSSProperties } from "react";
import { boxToRadius } from "@/utils/geometry";
import { durationSynced, durationSyncedMs } from "@/constants";
import CombustionSound from "@/assets/sounds/combustion.mp3";

export class FireNova implements ActiveSkill {
  id: string = SkillCode.FireNova;
  animationType: SkillAnimationType = SkillAnimationType.Image;
  aoe: number = 1;
  code: SkillCode = SkillCode.FireNova;
  cost: number = 50;
  damage: Damage = {
    ailment: [Ailment.Burn],
    value: [50, 60],
    type: SkillDamageType.Fire,
  };
  description: string = "Explode all enemies that are burning.";
  icon: string = FireNovaImg;
  name: string = "Fire Nova";
  style: CSSProperties = {};
  type: SkillActivationType.Active = SkillActivationType.Active;

  activate({ actions, scene }: ActivateParams) {
    const burningEnemies = actions.searchEnemies((enemy) =>
      enemy.ailments.includes(Ailment.Burn)
    );

    const width = 100 * this.aoe;
    const height = 100 * this.aoe;

    burningEnemies.forEach((enemy) => {
      // 74 - 24
      const x = enemy.position.x - enemy.size.width / 2;
      const y = enemy.position.y - enemy.size.height / 2;

      actions.damageCircleArea(
        {
          pos: {
            x: enemy.position.x + enemy.size.width / 2,
            y: enemy.position.y + enemy.size.height / 2,
          },
          radius: boxToRadius(width),
        },
        this.damage
      );

      scene.playAnimation(
        {
          animate: { scale: [0.1, 1], opacity: [0, 1] },
          exit: {
            opacity: 0,
          },
          style: {
            position: "absolute",
            left: x,
            top: y,
            zIndex: 100,
          },
          transition: { duration: durationSynced, ease: "easeInOut" },
          src: this.icon,
          width,
          height,
        },
        durationSyncedMs
      );
      scene.playSound(CombustionSound, 1000, 0.3);
    });
  }

  copy: () => ActiveSkill = () => new FireNova();
}
