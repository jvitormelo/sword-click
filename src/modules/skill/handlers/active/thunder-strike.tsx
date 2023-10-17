import { animationStore } from "../../../../providers/animation-provider";
import { distanceFromTop } from "../../../../constants";
import { Position } from "../../../../types";
import { closestDistanceToCircle } from "../../../../utils/geometry";

import ThunderStrikeHit from "../../../../assets/skills/thunder-strike-hit.png";
import { ActiveSkill, SkillCode, SkillType } from "../../types";
import ThunderStrikeIcon from "../../../../assets/icons/thunder-strike.png";
import { between } from "../../../../utils/random";
import { motion } from "framer-motion";
import { EnemyOnLevel } from "../../../../domain/types";
import { useGameLevelStore } from "../../../../stores/game-level-store";

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
      thunderStrikeAnimationFactory({
        x: pos.x,
        y: pos.y,
      })
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
          height: 48,
          width: 48,
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

      const x = distanceFromTop.x + closestDistance.enemy.position.x + 24;
      const y = distanceFromTop.y + closestDistance.enemy.position.y + 24;
      animationStore.getState().addAnimation(
        thunderStrikeAnimationFactory({
          x,
          y,
        })
      );
    }
  }
}

const thunderStrikeAnimationFactory = ({ x, y }: { x: number; y: number }) => {
  return ({ id }: { id: string }) => {
    return (
      <motion.img
        id={id}
        width={20}
        height={60}
        className="pointer-events-none"
        src={ThunderStrikeHit}
        animate={{
          opacity: [0, 1],
          translateY: ["-300%", "-50%"],
          // glitch effect

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
};
