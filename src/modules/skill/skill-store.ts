import { create } from "zustand";
import ExtendIcon from "../../assets/skills/extend-range.png";
import RuleOfThirds from "../../assets/skills/rule-of-thirds.png";
import { ActiveSkill, PassiveSkill, SkillCode, SkillType } from "./types";
import { RuleOfThirdsHandler } from "./handlers/passives/rule-of-thirds";

const extendRange: ActiveSkill = {
  id: "1",
  code: SkillCode.ExtendRange,
  cost: 10,
  name: "Extend Range",
  type: SkillType.Enhance,
  description:
    "Increase the range of your basic cut, also slightly increase the width of your cut.",
  icon: ExtendIcon,
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

type Store = {
  equippedSkills: ActiveSkill[];
  activeSkill: ActiveSkill | null;
  passiveSkills: PassiveSkill[];
  guardSkills: PassiveSkill[];
  actions: {
    removeActiveSkill: () => void;
    activateSkill: (skill: ActiveSkill) => void;
  };
};

export const useSkillStore = create<Store>((set) => ({
  equippedSkills: [extendRange],
  activeSkill: null,
  passiveSkills: [ruleOfThirds],
  guardSkills: [],
  actions: {
    removeActiveSkill: () => set({ activeSkill: null }),
    activateSkill: (skill) => set({ activeSkill: skill }),
  },
}));

export const useSkillActions = () => useSkillStore((s) => s.actions);
