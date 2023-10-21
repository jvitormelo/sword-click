import { useCallback, useEffect } from "react";

import { BasicCut } from "@/modules/skill/all/active/basic-cut";
import { useGameLevelStore } from "../../stores/game-level-store";
import { useSkillStore } from "./skill-store";
import { ActiveSkill } from "./types";

export const SkillTrigger = () => {
  const activeSkill = useSkillStore((s) => s.activeSkill);
  const passives = useSkillStore((s) => s.passiveSkills);
  const mana = useGameLevelStore((s) => s.player.mana);
  const { addEnergy } = useGameLevelStore((s) => s.actions);

  const level = useGameLevelStore((s) => s.level);

  const skillHandler = useCallback(
    (x: number, y: number, activeSkill: ActiveSkill) => {
      passives.forEach((passive) => passive.before(activeSkill));

      if (mana < activeSkill.cost) return;

      activeSkill.activate({ pos: { x, y } });

      passives.forEach((passive) => passive.after(activeSkill));

      addEnergy(-activeSkill.cost);
    },
    [addEnergy, mana, passives]
  );

  const onClick = useCallback(
    (e: MouseEvent) => {
      const { offsetX, offsetY } = e;

      skillHandler(offsetX, offsetY, activeSkill?.copy() ?? new BasicCut());
    },
    [activeSkill, skillHandler]
  );

  useEffect(() => {
    if (!level) return;

    const board = document.getElementById("game-level")!;

    if (!board) return;

    board.addEventListener("click", onClick);

    return () => {
      board.removeEventListener("click", onClick);
    };
  }, [level, onClick]);

  return null;
};
