import { CSSProperties } from "react";
import { Position } from "../../types";

export enum SkillDamageType {
  Elemental = "elemental",
  Physical = "physical",
}

export enum SkillAnimationType {
  Image = "image",
  Element = "element",
}

export enum SkillCode {
  BasicCut = "basic-cut",
  GreatSlash = "great-slash",
  RuleOfThirds = "rule-of-thirds",
  ThunderStrike = "thunder-strike",
  FireSlash = "fire-slash",
  IceOrb = "ice-orb",
}

export enum SkillActivationType {
  Passive,
  Guard,
  Active,
}

export interface BaseSkill {
  id: string;
  icon: string;
  name: string;
  description: string;
  code: SkillCode;
}

export type Damage = [number, number];

export type ActivateParams = { pos: Position };

export type ActiveSkill = BaseSkill & {
  type: SkillActivationType.Active;
  cost: number;
  aoe: number;
  damage: Damage;
  style: CSSProperties;
  animationType: SkillAnimationType;
  damageType: SkillDamageType;
  activate: (params: ActivateParams) => void;
  copy: () => ActiveSkill;
};

export type PassiveSkill = BaseSkill & {
  type: SkillActivationType.Passive | SkillActivationType.Guard;
  before: (cut: ActiveSkill) => void;
  after: (cut: ActiveSkill) => void;
};

export type AnySkill = ActiveSkill | PassiveSkill;
