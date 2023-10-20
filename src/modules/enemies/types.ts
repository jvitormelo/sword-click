import { PlayerOnLevel } from "../player/types";
import { Ailment } from "./enemies-level";

export type EnemyOnLevel = {
  id: string;
  health: number;
  name: string;
  position: {
    x: number;
    y: number;
  };
  size: {
    width: number;
    height: number;
  };

  image: string;
  attack: number;
  speed: number;
  ailments: Ailment[];
};

export type LevelModel = {
  player: PlayerOnLevel;
  enemies: Map<string, EnemyOnLevel>;
  gold: number;
};
