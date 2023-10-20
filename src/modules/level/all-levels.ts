import { goblinFactory, zombieFactory } from "../enemies/enemies-factory";
import { Level } from "./level-selector";

import PlainsBackground from "@/assets/plains-background.jpeg";

export const allLevels: Array<Level> = [
  {
    id: "level-1",
    number: 1,
    background: PlainsBackground,
    enemies: [
      zombieFactory(),
      zombieFactory(),
      zombieFactory(),
      zombieFactory(),
      zombieFactory(),
      zombieFactory(),
    ],
  },
  {
    id: "level-2",
    number: 2,
    background: PlainsBackground,
    enemies: [
      zombieFactory(),
      zombieFactory(),
      zombieFactory(),
      zombieFactory(),
      zombieFactory(),
      zombieFactory(),
      goblinFactory(),
      goblinFactory(),
      goblinFactory(),
      goblinFactory(),
      goblinFactory(),
    ],
  },
  {
    id: "level-3",
    number: 3,
    background: PlainsBackground,
    enemies: [
      goblinFactory(),
      goblinFactory(),
      goblinFactory(),
      goblinFactory(),
      goblinFactory(),
      goblinFactory(),
      goblinFactory(),
      goblinFactory(),
      goblinFactory(),
      goblinFactory(),
      goblinFactory(),
      goblinFactory(),
      goblinFactory(),
      goblinFactory(),
      goblinFactory(),
      goblinFactory(),
      goblinFactory(),
      goblinFactory(),
      goblinFactory(),
      goblinFactory(),
      goblinFactory(),
    ],
  },
];
