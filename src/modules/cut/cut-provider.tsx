import { PropsWithChildren, useCallback } from "react";
import { useCutActions, useCutStore } from "./cut-store";
import { CutMapper } from "./cut-mapper";
import { boardSize, distanceFromTop } from "../../constants";
import { CutType } from "./types";
import { useEventListener } from "../../hooks/useEventListener";
import { SkillCode, useSkillStore } from "../Skill";
import { between } from "../../utils/random";

export const CutProvider = ({ children }: PropsWithChildren) => {
  const { cuts } = useCutStore();
  const { addCut } = useCutActions();
  const activeSkill = useSkillStore((s) => s.activeSkill);

  const onClick = useCallback(
    (e: PointerEvent) => {
      const { clientX, clientY } = e;

      const { x, y } = distanceFromTop;

      if (
        clientX < x ||
        clientY < y ||
        clientX > x + boardSize.width ||
        clientY > y + boardSize.height
      ) {
        return;
      }

      const height = (() => {
        if (activeSkill?.code === SkillCode.ExtendRange) {
          return 300;
        }

        return between(50, 80);
      })();

      const width = (() => {
        if (activeSkill?.code === SkillCode.ExtendRange) {
          return 8;
        }

        return 3;
      })();

      addCut({
        position: { x: clientX, y: clientY },
        id: Math.random().toString(),
        type: CutType.Basic,
        height,
        width,
        damage: [30, 40],
        duration: 500,
      });
    },

    [addCut, activeSkill]
  );

  useEventListener("click", onClick);

  return (
    <>
      <div className="cursor-pointer">
        {cuts.map((cut) => (
          <CutMapper key={cut.id} {...cut} />
        ))}
      </div>
      {children}
    </>
  );
};
