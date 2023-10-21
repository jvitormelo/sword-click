import { Ailment } from "@/modules/skill/types";
import { Position, Size } from "@/types";

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
