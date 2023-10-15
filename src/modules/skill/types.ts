import { Cut } from "../cut/types";

export enum SkillCode {
  ExtendRange = "extend-range",
  RuleOfThirds = "rule-of-thirds",
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
  type: SkillType;
}

export type ActiveSkill = BaseSkill & {
  cost: number | null;
};

export type SkillHandler = {
  before: (cut: Cut) => void;
  after: (cut: Cut) => void;
};

export type PassiveSkill = BaseSkill & {
  handler: SkillHandler;
};

export type EnhanceSkill = PassiveSkill & {
  costModifier: number;
};
