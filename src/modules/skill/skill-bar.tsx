import { Card } from "@/components/Card";
import { useEventListener } from "../../hooks/useEventListener";
import { useSkillActions, useSkillStore } from "./skill-store";
import { ActiveSkill, EnhanceSkill } from "./types";
import { SkillIcon } from "./skill-icon";

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
    <Card className="flex-row w-full my-auto">
      <section className="flex gap-2">
        {skills.map((skill) => (
          <SkillIcon
            active={activeSkill?.id === skill.id}
            onClick={() => toggleSkill(skill)}
            skill={skill}
            key={skill.id}
          />
        ))}
      </section>

      <section className="ml-auto">
        {passivesSkills.map((skill) => (
          <SkillIcon active={false} skill={skill} key={skill.id} />
        ))}
      </section>
    </Card>
  );
};
