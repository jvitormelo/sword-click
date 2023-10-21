import { distanceFromTop } from "@/constants";
import { closestDistanceToCircle } from "@/utils/geometry";

import ThunderStrikeIcon from "@/assets/skills/icons/thunder-strike.png";
import ThunderSound from "@/assets/sounds/thunder-strike-sound.mp3";
import { EnemyOnLevel } from "@/modules/enemies/types";
import { ThunderStrikeAnimation } from "@/modules/skill/all/active/thunder-strike/animation";
import {
  ActivateParams,
  ActiveSkill,
  SkillAnimationType,
  SkillCode,
  SkillActivationType,
  SkillDamageType,
} from "@/modules/skill/types";
import { playAnimation } from "@/stores/animation-store";
import { gameActions, useGameLevelStore } from "@/stores/game-level-store";
import { between } from "@/utils/random";
import { playSound } from "@/utils/sound";
import { CSSProperties } from "react";

function createDamageRange(min: number, max: number) {
  return [min, max] as [number, number];
}

export class ThunderStrikeSkill implements ActiveSkill {
  id = SkillCode.ThunderStrike;

  type: SkillActivationType.Active = SkillActivationType.Active;

  animationType: SkillAnimationType = SkillAnimationType.Image;

  aoe = 4;

  code = SkillCode.ThunderStrike;

  name = "Thunder Strike";

  cost = 10;

  damage = createDamageRange(50, 70);

  description =
    "Strike a point with thunder, if it hits, it will bounce to the closest enemy";

  icon = ThunderStrikeIcon;

  style: Partial<CSSProperties> = {};

  damageType: SkillDamageType = SkillDamageType.Elemental;

  private get radius() {
    return this.aoe;
  }

  activate({ pos }: ActivateParams) {
    const animationDuration = 300;
    const affectedEnemies: EnemyOnLevel[] = [];

    gameActions().damageCircleArea(
      {
        radius: this.radius,
        x: pos.x - distanceFromTop.x,
        y: pos.y - distanceFromTop.y,
      },
      between(this.damage[0], this.damage[1]),
      affectedEnemies
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
      enemy: null as null | EnemyOnLevel,
    };

    for (const enemy of enemies) {
      const wasAffected = affectedEnemies.find((e) => e.id === enemy.id);

      if (wasAffected) continue;

      const distance = closestDistanceToCircle(
        {
          height: enemy.size.height,
          width: enemy.size.width,
          x: enemy.position.x,
          y: enemy.position.y,
        },
        {
          radius: this.radius,
          x: pos.x - distanceFromTop.x,
          y: pos.y - distanceFromTop.y,
        }
      );

      if (distance < closestDistance.value) {
        closestDistance.value = distance;
        closestDistance.enemy = enemy;
      }
    }

    if (closestDistance.enemy) {
      gameActions().damageEnemy(
        closestDistance.enemy.id,
        between(this.damage[0], this.damage[1])
      );

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
}
