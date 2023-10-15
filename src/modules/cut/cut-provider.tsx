import { PropsWithChildren, useCallback } from "react";
import { boardSize, distanceFromTop } from "../../constants";
import { useEventListener } from "../../hooks/useEventListener";
import { CutMapper } from "./cut-mapper";
import { useCutActions, useCutStore } from "./cut-store";
import { Cut, CutType } from "./types";

import { AnimatePresence } from "framer-motion";
import { between } from "../../utils/random";
import { useEnemiesOnFieldActions } from "../enemies/enemies-store";
import { useSkillStore } from "../skill/skill-store";

const isOutsideBoard = (clientX: number, clientY: number) => {
  const { x, y } = distanceFromTop;

  if (
    clientX < x ||
    clientY < y ||
    clientX > x + boardSize.width ||
    clientY > y + boardSize.height
  ) {
    return true;
  }

  return false;
};

export const CutProvider = ({ children }: PropsWithChildren) => {
  const { cuts } = useCutStore();
  const { addCut, removeCut } = useCutActions();
  const activeSkill = useSkillStore((s) => s.activeSkill);
  const { cutPosition } = useEnemiesOnFieldActions();
  const passives = useSkillStore((s) => s.passiveSkills);

  const cutBefore = useCallback(
    (cut: Cut) => {
      passives.forEach((passive) => {
        passive.handler.before(cut);
      });

      if (activeSkill && "handler" in activeSkill) {
        activeSkill.handler.before(cut);
        cut.cost *= activeSkill.costModifier;
      }
    },
    [activeSkill, passives]
  );

  const cutAfter = useCallback(
    (cut: Cut) => {
      passives.forEach((passive) => passive.handler.after(cut));
    },
    [passives]
  );

  const cutHandler = useCallback(
    (cut: Cut) => {
      cutBefore(cut);

      const success = addCut(cut);

      if (!success) return console.log("not enough energy");

      cutPosition(
        {
          height: cut.height,
          width: cut.width,
          x: cut.position.x,
          y: cut.position.y - cut.height / 2,
        },
        between(cut.damage[0], cut.damage[1])
      );

      setTimeout(() => {
        removeCut(cut.id);
      }, cut.duration);

      cutAfter(cut);
    },
    [addCut, cutAfter, cutBefore, cutPosition, removeCut]
  );

  const onClick = useCallback(
    (e: PointerEvent) => {
      const { clientX, clientY } = e;

      if (isOutsideBoard(clientX, clientY)) return;

      const randomX = between(-5, 5);

      const left = clientX + randomX;

      const cut: Cut = {
        id: Math.random().toString(),
        damage: [30, 50],
        duration: 500,
        height: between(50, 80),
        width: 3,
        border: "1px solid black",
        background: "white",
        type: CutType.Basic,
        cost: 10,
        position: {
          x: left,
          y: clientY,
        },
      };

      cutHandler(cut);
    },

    [cutHandler]
  );

  useEventListener("click", onClick);

  return (
    <>
      <AnimatePresence>
        {cuts.map((cut) => (
          <CutMapper key={cut.id} {...cut} />
        ))}
      </AnimatePresence>
      {children}
    </>
  );
};
