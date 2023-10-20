import {
  animationStore,
  playSound,
} from "../../../../providers/animation-provider";
import { distanceFromTop } from "../../../../constants";
import { Position } from "../../../../types";
import { closestDistanceToCircle } from "../../../../utils/geometry";

import ThunderStrikeHit from "../../../../assets/skills/thunder-strike-hit.png";
import { ActiveSkill, SkillCode, SkillType } from "../../types";
import ThunderStrikeIcon from "../../../../assets/icons/thunder-strike.png";
import { between } from "../../../../utils/random";
import { motion } from "framer-motion";
import { EnemyOnLevel } from "../../../enemies/types";
import { useGameLevelStore } from "../../../../stores/game-level-store";
import ThunderSound from "@/assets/sounds/thunder-strike-sound.mp3";

function createDamageRange(min: number, max: number) {
  return [min, max] as [number, number];
}

export class ThunderStrikeSkill implements ActiveSkill {
  id = SkillCode.ThunderStrike;
  type: SkillType.Active = SkillType.Active;
  aoe = 4;

  code = SkillCode.ThunderStrike;

  name = "Thunder Strike";

  cost = 10;

  damage = createDamageRange(50, 70);

  description =
    "Strike a point with thunder, if it hits, it will bounce to the closest enemy";

  icon = ThunderStrikeIcon;

  private get radius() {
    return this.aoe;
  }

  activate(pos: Position) {
    const animationDuration = 300;
    const affectedEnemies: EnemyOnLevel[] = [];

    useGameLevelStore.getState().actions.damageCircleArea(
      {
        radius: this.radius,
        x: pos.x - distanceFromTop.x,
        y: pos.y - distanceFromTop.y,
      },
      between(this.damage[0], this.damage[1]),
      affectedEnemies
    );

    if (affectedEnemies.length === 0) return;

    animationStore.getState().addAnimation(
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
      useGameLevelStore
        .getState()
        .actions.damageEnemy(
          closestDistance.enemy.id,
          between(this.damage[0], this.damage[1])
        );

      const x =
        distanceFromTop.x +
        closestDistance.enemy.position.x +
        closestDistance.enemy.size.width / 2;

      const y =
        distanceFromTop.y +
        closestDistance.enemy.position.y +
        closestDistance.enemy.size.height / 2;

      animationStore.getState().addAnimation(
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

const ThunderStrikeAnimation = ({ x, y }: { x: number; y: number }) => {
  return (
    <motion.img
      width={20}
      height={60}
      className="pointer-events-none"
      src={ThunderStrikeHit}
      animate={{
        opacity: [0, 1],
        translateY: ["-300%", "-50%"],
        transition: {
          duration: 0.1,
          ease: "easeOut",
        },
      }}
      exit={{
        opacity: 0,
        transition: {
          duration: 0.1,
        },
      }}
      style={{
        position: "absolute",
        translateX: "-50%",
        left: x,
        top: y,
        zIndex: 100,
      }}
    />
  );
};
