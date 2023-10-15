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

  const cutHandler = useCallback(
    ({
      damage,
      duration,
      height,
      position,
      id,
      type,
      width,
      background,
      border,
    }: Cut) => {
      addCut({
        position,
        id,
        type,
        height,
        width,
        damage,
        duration,
        background,
        border,
      });

      cutPosition(
        {
          height,
          width,
          x: position.x,
          y: position.y - height / 2,
        },
        between(damage[0], damage[1])
      );

      setTimeout(() => {
        removeCut(id);
      }, duration);
    },
    [addCut, cutPosition, removeCut]
  );

  const cutBefore = useCallback(
    (cut: Cut) => {
      passives.forEach((passive) => {
        passive.handler.before(cut);
      });

      if (activeSkill && "handler" in activeSkill) {
        activeSkill.handler.before(cut);
      }

      return cut;
    },
    [activeSkill, passives]
  );

  const cutAfter = useCallback(
    (cut: Cut) => {
      passives.forEach((passive) => passive.handler.after(cut));
    },
    [passives]
  );

  const onClick = useCallback(
    (e: PointerEvent) => {
      const { clientX, clientY } = e;

      if (isOutsideBoard(clientX, clientY)) return;

      const randomX = between(-5, 5);

      const left = clientX + randomX;

      const cut = cutBefore({
        id: Math.random().toString(),
        damage: [30, 50],
        duration: 500,
        height: between(50, 80),
        width: 3,
        border: "1px solid black",
        background: "white",
        type: CutType.Basic,
        position: {
          x: left,
          y: clientY,
        },
      });

      cutHandler(cut);

      cutAfter(cut);
    },

    [cutAfter, cutBefore, cutHandler]
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
