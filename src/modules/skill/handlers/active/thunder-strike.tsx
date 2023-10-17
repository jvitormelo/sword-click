import { animationStore } from "../../../../animation-provider";
import { distanceFromTop } from "../../../../constants";
import { Position } from "../../../../types";
import { closestDistanceToCircle } from "../../../../utils/geometry";
import { Enemy, useEnemiesOnFieldStore } from "../../../enemies/enemies-store";
import ThunderStrike from "../../../../assets/skills/thunder-strike.gif";

export class ThunderStrikeHandler {
  radius = 4;
  activate(pos: Position) {
    const affectedEnemies = useEnemiesOnFieldStore
      .getState()
      .actions.circleDamage(
        {
          radius: this.radius,
          x: pos.x - distanceFromTop.x,
          y: pos.y - distanceFromTop.y,
        },
        1000
      );

    if (affectedEnemies.length === 0) return;

    animationStore.getState().addAnimation(
      thunderStrikeAnimationFactory({
        x: pos.x,
        y: pos.y,
      })
    );

    const enemies = useEnemiesOnFieldStore.getState().enemies.values();

    const closestDistance = {
      value: Number.MAX_SAFE_INTEGER,
      enemy: null as null | Enemy,
    };

    for (const enemy of enemies) {
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
      useEnemiesOnFieldStore
        .getState()
        .actions.damageEnemy(closestDistance.enemy.id, 1000);

      animationStore.getState().addAnimation(
        thunderStrikeAnimationFactory({
          x: distanceFromTop.x + closestDistance.enemy.position.x,
          y: distanceFromTop.y + closestDistance.enemy.position.y + 48,
        })
      );
    }
  }
}

const thunderStrikeAnimationFactory = ({ x, y }: { x: number; y: number }) => {
  return ({ id }: { id: string }) => {
    return (
      <img
        id={id}
        className="pointer-events-none"
        src={ThunderStrike}
        style={{
          position: "absolute",
          left: x,
          top: y,
          width: 48,
          height: 48,
          zIndex: 100,
          transform: "translate(-50%, -90%)",
        }}
      />
    );
  };
};
