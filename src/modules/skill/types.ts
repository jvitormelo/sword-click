import { Position } from "../../types";
import { Cut } from "../cut/types";

export enum SkillCode {
  ExtendRange = "extend-range",
  RuleOfThirds = "rule-of-thirds",
  ThunderStrike = "thunder-strike",
  FireSlash = "fire-slash",
}

export enum SkillType {
  Passive,
  Enhance,
  Guard,
  Active,
  Ultimate,
}

export interface BaseSkill {
  id: string;
  icon: string;
  name: string;
  description: string;
  code: SkillCode;
}

export type ActiveSkill = BaseSkill & {
  type: SkillType.Active;
  cost: number | null;
  aoe: number;

  damage: [number, number];
  activate: (absolutePos: Position, boardPos: Position) => void;
};

export type SkillHandler = {
  before: (cut: Cut) => void;
  after: (cut: Cut) => void;
};

export type PassiveSkill = BaseSkill & {
  type: SkillType.Passive | SkillType.Guard;
  handler: SkillHandler;
};

export type EnhanceSkill = BaseSkill & {
  type: SkillType.Enhance;
  handler: SkillHandler;
  costModifier: number;
};
