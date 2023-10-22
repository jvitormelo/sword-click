import { GameActions } from "@/modules/level/game-level-store";
import { motion } from "framer-motion";
import { CSSProperties, ComponentProps } from "react";
import { Position } from "../../types";
import { ActiveSkill } from "@/modules/skill/skill-on-level";

export enum Ailment {
  Burn = "Burn",
  Chill = "Chill",
}

export enum SkillDamageType {
  Fire = "fire",
  Ice = "ice",
  Lightning = "lightning",
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
  IceShatter = "shatter",
  FireNova = "fire-nova",
}

export enum SkillActivationType {
  Passive,
  Guard,
  Active,
}

export enum ActivationType {
  Click = "click",
  Select = "select",
}

export type Damage = {
  value: [number, number];
  type: SkillDamageType;
  ailment: Ailment[];
};

export type AnimationObject = ComponentProps<typeof motion.img>;

export type ActivateParams = {
  pos: Position;
  actions: GameActions;
  scene: {
    playAnimation: (animation: AnimationObject, duration: number) => void;
    playSound: (sound: string, duration: number, volume?: number) => void;
  };
};

export interface BaseSkill {
  id: string;
  icon: string;
  name: string;
  description: string;
  code: SkillCode;
  coolDown: number;
}

export type ActiveSkillModel = BaseSkill & {
  type: SkillActivationType.Active;
  cost: number;
  aoe: number;
  damage: Damage;
  style: CSSProperties;
  animationType: SkillAnimationType;
  activationType: ActivationType;
};

export type PassiveSkill = BaseSkill & {
  type: SkillActivationType.Passive | SkillActivationType.Guard;
  before: (cut: ActiveSkillModel) => void;
  after: (cut: ActiveSkillModel) => void;
};

export type AnySkill = ActiveSkill | PassiveSkill;
