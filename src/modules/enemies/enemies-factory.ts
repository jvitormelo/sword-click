import Goblin from "@/assets/goblin.gif";
import Zombie from "@/assets/zombie.png";
import { boardSize } from "@/constants";

import { EnemyOnLevel } from "@/modules/enemies/enemy-on-level";
import { Position } from "@/types";
import { between } from "../../utils/random";
export type EnemyFactory = (props?: { pos: Partial<Position> }) => EnemyOnLevel;

export const zombieFactory: EnemyFactory = (props) => {
  const size = {
    height: 48,
    width: 48,
  };
  return new EnemyOnLevel({
    id: crypto.randomUUID(),
    health: between(100, 500),
    name: "Zombie",
    attack: 6,
    image: Zombie,
    speed: between(20, 60),
    size: size,
    attackSpeed: 1000,
    position: {
      x: props?.pos.x ?? between(0, boardSize.width - size.width),
      y: props?.pos.y ?? between(0, boardSize.height * 0.15),
    },
    ailments: [],
    isAttacking: false,
  });
};

export const goblinFactory: EnemyFactory = () => {
  const size = {
    height: 24,
    width: 24,
  };
  return new EnemyOnLevel({
    id: crypto.randomUUID(),
    health: 30,
    name: "Goblin",
    attack: 5,
    speed: between(60, 80),
    attackSpeed: 800,
    image: Goblin,
    size,
    position: {
      x: between(0, boardSize.width - size.width),
      y: between(0, boardSize.height * 0.2),
    },
    ailments: [],
    isAttacking: false,
  });
};
