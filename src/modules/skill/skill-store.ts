import { create } from "zustand";

import {
  ActiveSkill,
  AnySkill,
  PassiveSkill,
  SkillActivationType,
} from "./types";
import { allSkills } from "./all";

type Store = {
  equippedSkills: Array<ActiveSkill>;
  activeSkill: ActiveSkill | null;
  passiveSkills: PassiveSkill[];
  guardSkills: PassiveSkill[];
  actions: {
    removeActiveSkill: () => void;
    activateSkill: (skill: ActiveSkill) => void;
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
        (skill): skill is ActiveSkill =>
          skill.type === SkillActivationType.Active
      );
      const passiveSkills = skills.filter(
        (skill): skill is PassiveSkill =>
          skill.type === SkillActivationType.Passive
      );

      set({
        equippedSkills: activeSkills,
        passiveSkills,
      });
    },
  },
}));

export const useSkillActions = () => useSkillStore((s) => s.actions);
