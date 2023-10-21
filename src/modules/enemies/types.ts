import { Position, Size } from "@/types";
import { PlayerOnLevel } from "../player/types";
import { Ailment } from "./enemy-on-level";

export type EnemyModel = {
  id: string;
  health: number;
  name: string;
  position: Position;
  size: Size;
  image: string;
  attack: number;
  speed: number;
  ailments: Ailment[];
  isAttacking: boolean;
  /** Every ms */
  attackSpeed: number;
};

export type LevelModel = {
  currentTick: number;
  player: PlayerOnLevel;
  enemies: Map<string, EnemyModel>;
};
