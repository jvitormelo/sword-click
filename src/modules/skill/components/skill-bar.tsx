import { Card } from "@/components/Card";
import { ActiveSkill } from "@/modules/skill/skill-on-level";
import { useEventListener } from "../../../hooks/useEventListener";
import { SkillIcon } from "./skill-icon";
import { useSkillActions, useSkillStore } from "../skill-store";

export const SkillBar = () => {
  const skills = useSkillStore((s) => s.equippedSkills);
  const passivesSkills = useSkillStore((s) => s.passiveSkills);
  const activeSkill = useSkillStore((s) => s.activeSkill);
  const { selectSkill, removeActiveSkill } = useSkillActions();

  function toggleSkill(skill: ActiveSkill) {
    if (activeSkill?.id === skill.id) {
      removeActiveSkill();
    } else {
      selectSkill(skill);
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
