import { LevelOnLevel } from "@/modules/level/level-on-level";
import { BasicCut } from "@/modules/skill/all/active/basic-cut";
import { useSkillStore } from "@/modules/skill/skill-store";
import { useCallback, useEffect } from "react";

const basicCut = new BasicCut();

export const useWatchSkillClick = (level: LevelOnLevel) => {
  const activeSkill = useSkillStore((s) => s.activeSkill);

  const onClick = useCallback(
    (e: MouseEvent) => {
      const { offsetX, offsetY } = e;

      const skill = activeSkill ?? basicCut;

      skill.execute({ x: offsetX, y: offsetY });
    },
    [activeSkill]
  );

  useEffect(() => {
    const board = document.getElementById("game-level")!;

    if (!board) return;

    board.addEventListener("click", onClick);

    return () => {
      board.removeEventListener("click", onClick);
    };
  }, [level, onClick]);
};
