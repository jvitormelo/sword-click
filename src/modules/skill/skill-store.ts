import { create } from "zustand";

import { allSkills } from "./all";
import {
  ActivationType,
  AnySkill,
  PassiveSkill,
  SkillActivationType,
} from "./types";
import { ActiveSkill } from "@/modules/skill/skill-on-level";

type Store = {
  equippedSkills: Array<ActiveSkill>;
  activeSkill: ActiveSkill | null;
  passiveSkills: PassiveSkill[];
  guardSkills: PassiveSkill[];
  lastUsedSkills: Map<string, number>;
  actions: {
    removeActiveSkill: () => void;
    selectSkill: (skill: ActiveSkill) => void;
    addHistory: (id: string) => void;
    setSkills: (skills: string[]) => void;
    clearHistory: () => void;
  };
};

export const useSkillStore = create<Store>((set) => ({
  equippedSkills: [],
  activeSkill: null,
  lastUsedSkills: new Map(),
  passiveSkills: [],
  guardSkills: [],
  actions: {
    addHistory: (id) => {
      set((s) => {
        const history = new Map(s.lastUsedSkills);
        history.set(id, Date.now());

        return {
          lastUsedSkills: history,
        };
      });
    },
    removeActiveSkill: () => set({ activeSkill: null }),
    selectSkill: (skill) => {
      if (skill.activationType === ActivationType.Select) {
        skill.execute({ x: 0, y: 0 });

        return;
      }

      set({ activeSkill: skill });
    },
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
    clearHistory: () => {
      set({ lastUsedSkills: new Map() });
    },
  },
}));

export const useSkillActions = () => useSkillStore((s) => s.actions);
