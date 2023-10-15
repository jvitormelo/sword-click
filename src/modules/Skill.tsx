import { useEventListener } from "../hooks/useEventListener";
import { useSkillActions, useSkillStore } from "./skill/skill-store";
import { ActiveSkill } from "./skill/types";

export const SkillBar = () => {
  const skills = useSkillStore((s) => s.equippedSkills);
  const passivesSkills = useSkillStore((s) => s.passiveSkills);
  const activeSkill = useSkillStore((s) => s.activeSkill);
  const { activateSkill, removeActiveSkill } = useSkillActions();

  function toggleSkill(skill: ActiveSkill) {
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
    <div className="pt-1 flex">
      <section>
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
