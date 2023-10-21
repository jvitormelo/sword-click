import { useCallback, useEffect } from "react";

import { BasicCut } from "@/modules/skill/all/active/basic-cut";
import { useGameLevelStore } from "../../stores/game-level-store";
import { useSkillStore } from "./skill-store";
import { ActiveSkill } from "./types";
import { useAnimationStore } from "@/modules/animation/animation-store";
import { playSound } from "@/utils/sound";

export const SkillTrigger = () => {
  const activeSkill = useSkillStore((s) => s.activeSkill);
  const passives = useSkillStore((s) => s.passiveSkills);
  const mana = useGameLevelStore((s) => s.player.mana);
  const actions = useGameLevelStore((s) => s.actions);
  const level = useGameLevelStore((s) => s.level);
  const { addAnimation } = useAnimationStore((s) => s.actions);

  const skillHandler = useCallback(
    (x: number, y: number, activeSkill: ActiveSkill) => {
      passives.forEach((passive) => passive.before(activeSkill));

      if (mana < activeSkill.cost) return;

      activeSkill.activate({
        pos: { x, y },
        actions,
        scene: {
          playAnimation: addAnimation,
          playSound: playSound,
        },
      });

      passives.forEach((passive) => passive.after(activeSkill));

      actions.addEnergy(-activeSkill.cost);
    },
    [actions, mana, passives]
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
