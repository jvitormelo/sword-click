import { EnemyOnLevel } from "@/modules/enemies/enemy-on-level";
import { AnimationObject } from "@/modules/skill/types";
import { Position, Size } from "@/types";

export enum EntityCode {
  IceOrb = "ice-orb",
}

export type EntityModel = {
  image: string;
  position: Position;
  speed: number;
  target: Position;
  id: string;
  size: Size;
  code: EntityCode;
  sound: string;
  hitSound: string;
  animationObject: AnimationObject;
};

export type EntityTickParams = {
  enemies: Map<string, EnemyOnLevel>;
};

export type EntityOnLevel = EntityModel & {
  removable: boolean;
  tick: (params: EntityTickParams) => void;
};
