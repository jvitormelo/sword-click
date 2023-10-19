import Goblin from "@/assets/goblin.gif";
import Zombie from "@/assets/zombie.png";
import { boardSize } from "@/constants";
import { EnemyOnLevel } from "@/domain/types";
import { between } from "../../utils/random";

export function zombieFactory(): EnemyOnLevel {
  const size = {
    height: 48,
    width: 48,
  };
  return {
    id: crypto.randomUUID(),
    health: 100,
    attack: 6,
    image: Zombie,
    speed: 30,
    size: size,
    position: {
      x: between(0, boardSize.width - size.width),
      y: between(0, 24),
    },
    ailments: [],
  };
}

export function goblinFactory(): EnemyOnLevel {
  const size = {
    height: 24,
    width: 24,
  };
  return {
    id: crypto.randomUUID(),
    health: 30,
    attack: 5,
    speed: 80,
    image: Goblin,
    size,
    position: {
      x: between(0, boardSize.width - size.width),
      y: between(0, 30),
    },
    ailments: [],
  };
}
