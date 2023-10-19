import { useModalStore } from "@/hooks/useOpenModal";
import { useState } from "react";
import { GoldCounter } from "../player/gold-counter";
import { updatePlayer, usePlayer } from "../player/use-player";
import { allSkills } from "../skill/all-skills";
import { useSkillStore } from "../skill/skill-store";

export const SkillBuyer = () => {
  const [selectedSkills, setSelectedSkills] = useState<Set<string>>(new Set());
  const { open } = useModalStore((s) => s.actions);
  const { player } = usePlayer();
  const { setSkills } = useSkillStore((s) => s.actions);

  const filteredSkill = allSkills.filter(
    (skill) => !player.skills.includes(skill.id)
  );

  function toggleSkill(skillId: string) {
    setSelectedSkills((s) => {
      const newSet = new Set(s);

      if (newSet.has(skillId)) {
        newSet.delete(skillId);
      } else {
        newSet.add(skillId);
      }
      return newSet;
    });
  }

  const totalPrice = selectedSkills.size * 100;

  function buySelectedSkill() {
    if (player.gold < totalPrice)
      return open({
        title: "Voce e pobre",
        body: "Usa o urubu do pix",
      });

    const result = updatePlayer(({ skills, gold }) => {
      const skillsSet = new Set([...skills, ...selectedSkills]);

      return {
        skills: Array.from(skillsSet),
        gold: gold - totalPrice,
      };
    });

    if (result) {
      setSkills(result.skills);
    }

    setSelectedSkills(new Set());
  }

  return (
    <section>
      <ul className="flex gap-2">
        {filteredSkill.map((skill) => (
          <img
            key={skill.id}
            onClick={() => toggleSkill(skill.id)}
            data-active={selectedSkills.has(skill.id)}
            className="border border-white data-[active='true']:border-amber-800"
            width={24}
            src={skill.icon}
          />
        ))}
      </ul>

      {selectedSkills.size > 0 && (
        <button onClick={buySelectedSkill} className="flex mt-8 mx-auto">
          Buy <GoldCounter gold={totalPrice} />
        </button>
      )}
    </section>
  );
};
