import { useEventListener } from "../../hooks/useEventListener";
import { useSkillActions, useSkillStore } from "./skill-store";
import { ActiveSkill, EnhanceSkill } from "./types";

export const SkillBar = () => {
  const skills = useSkillStore((s) => s.equippedSkills);
  const passivesSkills = useSkillStore((s) => s.passiveSkills);
  const activeSkill = useSkillStore((s) => s.activeSkill);
  const { activateSkill, removeActiveSkill } = useSkillActions();

  function toggleSkill(skill: ActiveSkill | EnhanceSkill) {
    if (activeSkill?.id === skill.id) {
      removeActiveSkill();
    } else {
      activateSkill(skill);
    }
  }

  useEventListener("keydown", (e: KeyboardEvent) => {
    const numberKey = Number(e.key);

    if (Number.isNaN(numberKey)) return;

    toggleSkill(skills[numberKey - 1]);
  });

  return (
    <div className="flex bg-slate-800 p-2 border-amber-900 border rounded-lg w-full">
      <section className="flex gap-2 ">
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
      </section>
      <div className="mx-4 w-[1px] h-full bg-white"></div>
      <section className="ml-auto">
        {passivesSkills.map((skill) => (
          <img
            key={skill.id}
            className="w-8 h-8 border-2 border-blue-500"
            src={skill.icon}
            alt={skill.name}
          />
        ))}
      </section>
    </div>
  );
};
