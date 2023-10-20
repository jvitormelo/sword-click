import { zombieFactory } from "../enemies/enemies-factory";
import { Level } from "./level-selector";

import PlainsBackground from "@/assets/plains-background.jpeg";

export const allLevels: Array<Level> = [
  {
    id: "1",
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
];
