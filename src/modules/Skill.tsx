import { create } from "zustand";
import icon from "../assets/skills/extend-range.png";
import { useEventListener } from "../hooks/useEventListener";

export enum SkillCode {
  ExtendRange,
}

export enum SkillType {
  Passive,
  Enhance,
  Guard,
  Active,
  Ultimate,
}

interface Skill {
  id: string;
  icon: string;
  name: string;

  description: string;
  cost: number;
  code: SkillCode;
  type: SkillType;
}

const extendRange: Skill = {
  id: "1",
  code: SkillCode.ExtendRange,
  cost: 10,
  name: "Extend Range",
  type: SkillType.Enhance,
  description:
    "Increase the range of your basic cut, also slightly increase the width of your cut.",
  icon,
};

type Store = {
  equippedSkills: Skill[];
  activeSkill: Skill | null;
  actions: {
    removeActiveSkill: () => void;
    activateSkill: (skill: Skill) => void;
  };
};

export const useSkillStore = create<Store>((set) => ({
  equippedSkills: [extendRange],
  activeSkill: null,
  actions: {
    removeActiveSkill: () => set({ activeSkill: null }),
    activateSkill: (skill) => set({ activeSkill: skill }),
  },
}));

export const useSkillActions = () => useSkillStore((s) => s.actions);

export const SkillBar = () => {
  const skills = useSkillStore((s) => s.equippedSkills);
  const activeSkill = useSkillStore((s) => s.activeSkill);
  const { activateSkill, removeActiveSkill } = useSkillActions();

  function toggleSkill(skill: Skill) {
    if (activeSkill?.id === skill.id) {
      removeActiveSkill();
    } else {
      activateSkill(skill);
    }
  }

  useEventListener("keydown", (e: KeyboardEvent) => {
    if (e.key === "1") {
      toggleSkill(skills[0]);
    }
  });

  return (
    <div className="pt-1">
      {skills.map((skill) => (
        <img
          data-active={activeSkill?.id === skill.id}
          onClick={() => toggleSkill(skill)}
          key={skill.id}
          className="w-8 h-8 border-white border data-[active='true']:border-red-700"
          src={skill.icon}
          alt={skill.name}
        />
      ))}
    </div>
  );
};
