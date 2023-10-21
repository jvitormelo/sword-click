import { distanceFromTop } from "@/constants";
import { closestDistanceToCircle } from "@/utils/geometry";

import ThunderStrikeIcon from "@/assets/skills/icons/thunder-strike.png";
import ThunderStrikeHit from "@/assets/skills/thunder-strike-hit.png";
import ThunderSound from "@/assets/sounds/thunder-strike-sound.mp3";
import { EnemyModel } from "@/modules/enemies/types";
import {
  ActivateParams,
  ActiveSkill,
  AnimationObject,
  Damage,
  SkillActivationType,
  SkillAnimationType,
  SkillCode,
  SkillDamageType,
} from "@/modules/skill/types";
import { useGameLevelStore } from "@/modules/level/game-level-store";
import { Position } from "@/types";
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
    type: SkillDamageType.Lightning,
    value: [100, 200],
    ailment: [],
  };

  description = "Strike a point with thunder";

  icon = ThunderStrikeIcon;

  style: Partial<CSSProperties> = {};

  private get radius() {
    return this.aoe;
  }

  activate({ pos, actions, scene }: ActivateParams) {
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

    scene.playAnimation(thunderStrikeHitAnimation(pos), animationDuration);

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

      scene.playAnimation(
        thunderStrikeHitAnimation({ x, y }),
        animationDuration
      );
    }

    playSound(ThunderSound, animationDuration);
  }

  copy() {
    return new ThunderStrikeSkill();
  }
}

const thunderStrikeHitAnimation = ({ x, y }: Position) =>
  ({
    width: 20,
    height: 60,
    className: "pointer-events-none",
    src: ThunderStrikeHit,
    animate: {
      opacity: [0, 1],
      translateY: ["-300%", "-50%"],
      transition: {
        duration: 0.1,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.1,
      },
    },
    style: {
      position: "absolute",
      translateX: "-50%",
      zIndex: 100,
      left: x,
      top: y,
    },
  } as AnimationObject);
