import FireNovaImg from "@/assets/skills/fire-nova.png";
import CombustionSound from "@/assets/sounds/combustion.mp3";
import { durationSynced, durationSyncedMs } from "@/constants";
import { NotActivatedError } from "@/modules/skill/errors/not-activated";
import { ActiveSkill } from "@/modules/skill/skill-on-level";
import {
  ActivateParams,
  ActivationType,
  Ailment,
  Damage,
  SkillCode,
  SkillDamageType,
} from "@/modules/skill/types";
import { boxToRadius } from "@/utils/geometry";

export class FireNova extends ActiveSkill {
  name: string = "Fire Nova";
  description: string = "Explode all enemies that are burning.";
  icon: string = FireNovaImg;
  code: SkillCode = SkillCode.FireNova;

  damage: Damage = {
    value: [30, 50],
    type: SkillDamageType.Fire,
    ailment: [],
  };

  constructor() {
    super();
    this.cost = 50;
    this.coolDown = 4000;
    this.activationType = ActivationType.Select;
  }

  activate({ actions, scene }: ActivateParams) {
    const burningEnemies = actions.searchEnemies((enemy) =>
      enemy.ailments.includes(Ailment.Burn)
    );

    if (burningEnemies.size === 0) throw new NotActivatedError();

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

  copy() {
    return new FireNova();
  }
}
