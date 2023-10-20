import { useState } from "react";
import { GoldCounter } from "../player/gold-counter";
import { updatePlayer, usePlayer } from "../player/use-player";
import { allSkills } from "../skill/all-skills";
import { useSkillStore } from "../skill/skill-store";
import { useModal } from "@/hooks/useModal";
import { SkillIcon } from "../skill/skill-icon";

export const SkillBuyer = () => {
  const [selectSkill, setSelectSkill] = useState<string>("");
  const { open } = useModal();
  const { player } = usePlayer();
  const { setSkills } = useSkillStore((s) => s.actions);

  const filteredSkill = allSkills.filter(
    (skill) => !player.skills.includes(skill.id)
  );

  function toggleSkill(skillId: string) {
    setSelectSkill((s) => (s === skillId ? "" : skillId));
  }

  const price = 100;

  function buySelectedSkill() {
    if (player.gold < price)
      return open({
        title: "Voce e pobre",
        body: "Usa o urubu do pix",
      });

    const result = updatePlayer(({ skills, gold }) => {
      const skillsSet = new Set([...skills, ...selectSkill]);

      return {
        skills: Array.from(skillsSet),
        gold: gold - price,
      };
    });

    if (result) {
      setSkills(result.skills);
    }

    setSelectSkill("");
  }

  return (
    <section>
      <ul className="flex gap-2 bg-slate-900 p-4 rounded-md">
        {filteredSkill.map((skill) => (
          <SkillIcon
            key={skill.id}
            onClick={() => toggleSkill(skill.id)}
            active={selectSkill === skill.id}
            skill={skill}
          />
        ))}
      </ul>

      {selectSkill && (
        <button onClick={buySelectedSkill} className="flex mt-8 mx-auto">
          Buy <GoldCounter gold={price} />
        </button>
      )}
    </section>
  );
};
