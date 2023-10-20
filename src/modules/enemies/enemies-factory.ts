import Goblin from "@/assets/goblin.gif";
import Zombie from "@/assets/zombie.png";
import { boardSize } from "@/constants";
import { EnemyOnLevel } from "@/domain/types";
import { between } from "../../utils/random";
import { Position } from "@/types";
export type EnemyFactory = (props?: { pos: Partial<Position> }) => EnemyOnLevel;

export const zombieFactory: EnemyFactory = (props) => {
  const size = {
    height: 48,
    width: 48,
  };
  return {
    id: crypto.randomUUID(),
    health: 100,
    name: "Zombie",
    attack: 6,
    image: Zombie,
    speed: 40,
    size: size,
    position: {
      x: props?.pos.x ?? between(0, boardSize.width - size.width),
      y: props?.pos.y ?? between(0, boardSize.height * 0.15),
    },
    ailments: [],
  };
};

export const goblinFactory: EnemyFactory = () => {
  const size = {
    height: 24,
    width: 24,
  };
  return {
    id: crypto.randomUUID(),
    health: 30,
    name: "Goblin",
    attack: 5,
    speed: 80,
    image: Goblin,
    size,
    position: {
      x: between(0, boardSize.width - size.width),
      y: between(0, boardSize.height * 0.2),
    },
    ailments: [],
  };
};
