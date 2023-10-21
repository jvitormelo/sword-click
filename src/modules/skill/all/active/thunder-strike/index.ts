import { distanceFromTop } from "@/constants";
import { closestDistanceToCircle } from "@/utils/geometry";

import ThunderStrikeIcon from "@/assets/skills/icons/thunder-strike.png";
import ThunderSound from "@/assets/sounds/thunder-strike-sound.mp3";
import { EnemyModel } from "@/modules/enemies/types";
import { ThunderStrikeAnimation } from "@/modules/skill/all/active/thunder-strike/animation";
import {
  ActivateParams,
  ActiveSkill,
  Damage,
  SkillActivationType,
  SkillAnimationType,
  SkillCode,
  SkillDamageType,
} from "@/modules/skill/types";
import { playAnimation } from "@/stores/animation-store";
import { useGameLevelStore } from "@/stores/game-level-store";
import { playSound } from "@/utils/sound";
import { CSSProperties } from "react";

export class ThunderStrikeSkill implements ActiveSkill {
  id = SkillCode.ThunderStrike;

  type: SkillActivationType.Active = SkillActivationType.Active;

  animationType: SkillAnimationType = SkillAnimationType.Image;

  aoe = 4;

  code = SkillCode.ThunderStrike;

  name = "Thunder Strike";

  cost = 30;

  damage: Damage = {
    type: SkillDamageType.Elemental,
    value: [100, 200],
    ailment: [],
  };

  description = "Strike a point with thunder";

  icon = ThunderStrikeIcon;

  style: Partial<CSSProperties> = {};

  private get radius() {
    return this.aoe;
  }

  activate({ pos, actions }: ActivateParams) {
    const animationDuration = 300;

    const { enemiesHit } = actions.damageCircleArea(
      {
        radius: this.radius,
        pos: {
          x: pos.x - distanceFromTop.x,
          y: pos.y - distanceFromTop.y,
        },
      },
      this.damage
    );

    playAnimation(
      ThunderStrikeAnimation({
        x: pos.x,
        y: pos.y,
      }),
      animationDuration
    );

    const enemies = useGameLevelStore.getState().enemies.values();

    const closestDistance = {
      value: Number.MAX_SAFE_INTEGER,
      enemy: null as null | EnemyModel,
    };

    for (const enemy of enemies) {
      const wasAffected = enemiesHit.get(enemy.id);

      if (wasAffected) continue;

      const distance = closestDistanceToCircle(
        {
          size: enemy.size,
          pos: enemy.position,
        },
        {
          radius: this.radius,
          pos: distanceFromTop,
        }
      );

      if (distance < closestDistance.value) {
        closestDistance.value = distance;
        closestDistance.enemy = enemy;
      }
    }

    if (closestDistance.enemy) {
      actions.damageEnemy(closestDistance.enemy.id, this.damage);

      const x =
        closestDistance.enemy.position.x + closestDistance.enemy.size.width / 2;

      const y =
        closestDistance.enemy.position.y +
        closestDistance.enemy.size.height / 2;

      playAnimation(
        ThunderStrikeAnimation({
          x,
          y,
        }),
        animationDuration
      );
    }

    playSound(ThunderSound, animationDuration);
  }

  copy() {
    return new ThunderStrikeSkill();
  }
}
