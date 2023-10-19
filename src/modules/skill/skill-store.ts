import { create } from "zustand";

import {
  ActiveSkill,
  AnySkill,
  EnhanceSkill,
  PassiveSkill,
  SkillType,
} from "./types";
import { allSkills } from "./all-skills";

type Store = {
  equippedSkills: Array<ActiveSkill | EnhanceSkill>;
  activeSkill: ActiveSkill | EnhanceSkill | null;
  passiveSkills: PassiveSkill[];
  guardSkills: PassiveSkill[];
  actions: {
    removeActiveSkill: () => void;
    activateSkill: (skill: ActiveSkill | EnhanceSkill) => void;
    setSkills: (skills: string[]) => void;
  };
};

export const useSkillStore = create<Store>((set) => ({
  equippedSkills: [],
  activeSkill: null,
  passiveSkills: [],
  guardSkills: [],
  actions: {
    removeActiveSkill: () => set({ activeSkill: null }),
    activateSkill: (skill) => set({ activeSkill: skill }),
    setSkills: (skillIds) => {
      const mappedSkills = skillIds.map((skillId) => {
        const skill = allSkills.find((s) => s.id === skillId);

        return skill;
      });
      const skills = mappedSkills.filter((skill): skill is AnySkill => !!skill);
      const activeSkills = skills.filter(
        (skill): skill is ActiveSkill | EnhanceSkill =>
          skill.type === SkillType.Active || skill.type === SkillType.Enhance
      );
      const passiveSkills = skills.filter(
        (skill): skill is PassiveSkill => skill.type === SkillType.Passive
      );

      set({
        equippedSkills: activeSkills,
        passiveSkills,
      });
    },
  },
}));

export const useSkillActions = () => useSkillStore((s) => s.actions);
