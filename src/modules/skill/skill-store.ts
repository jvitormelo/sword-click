import { create } from "zustand";
import ExtendIcon from "../../assets/skills/extend-range.png";
import RuleOfThirds from "../../assets/skills/rule-of-thirds.png";
import {
  ActiveSkill,
  EnhanceSkill,
  PassiveSkill,
  SkillCode,
  SkillType,
} from "./types";
import { RuleOfThirdsHandler } from "./handlers/passives/rule-of-thirds";
import { ExtendRangeHandler } from "./handlers/enhance/extend-range";
import { ThunderStrikeHandler } from "./handlers/active/thunder-strike";

const extendRange: EnhanceSkill = {
  id: "1",
  code: SkillCode.ExtendRange,
  name: "Extend Range",
  type: SkillType.Enhance,
  description:
    "Increase the range of your basic cut, also slightly increase the width of your cut.",
  icon: ExtendIcon,
  handler: new ExtendRangeHandler(),
  costModifier: 1.5,
};

const ruleOfThirds: PassiveSkill = {
  id: "2",
  code: SkillCode.RuleOfThirds,
  name: "Rule of Thirds",
  type: SkillType.Passive,
  description: "Increase the damage of your basic cut every 3rd",
  icon: RuleOfThirds,
  handler: new RuleOfThirdsHandler(),
};

const thunderStrike: ActiveSkill = {
  code: SkillCode.ThunderStrike,
  cost: 10,
  description:
    "Strike a point with thunder, if it hits, it will bounce to the closest enemy",
  icon: RuleOfThirds,
  id: "3",
  name: "Thunder Strike",
  type: SkillType.Active,
  handler: new ThunderStrikeHandler(),
};

type Store = {
  equippedSkills: Array<ActiveSkill | EnhanceSkill>;
  activeSkill: ActiveSkill | EnhanceSkill | null;
  passiveSkills: PassiveSkill[];
  guardSkills: PassiveSkill[];
  actions: {
    removeActiveSkill: () => void;
    activateSkill: (skill: ActiveSkill | EnhanceSkill) => void;
  };
};

export const useSkillStore = create<Store>((set) => ({
  equippedSkills: [extendRange, thunderStrike],
  activeSkill: null,
  passiveSkills: [ruleOfThirds],
  guardSkills: [],
  actions: {
    removeActiveSkill: () => set({ activeSkill: null }),
    activateSkill: (skill) => set({ activeSkill: skill }),
  },
}));

export const useSkillActions = () => useSkillStore((s) => s.actions);
