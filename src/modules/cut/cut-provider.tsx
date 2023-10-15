import { PropsWithChildren, useCallback } from "react";
import { useCutActions, useCutStore } from "./cut-store";
import { CutMapper } from "./cut-mapper";
import { boardSize, distanceFromTop } from "../../constants";
import { Cut, CutType } from "./types";
import { useEventListener } from "../../hooks/useEventListener";
import { SkillCode, useSkillStore } from "../Skill";
import { between } from "../../utils/random";
import { useEnemiesOnFieldActions } from "../enemies/enemies-store";
import { AnimatePresence } from "framer-motion";

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

  const cutHandler = useCallback(
    ({ damage, duration, height, position, id, type, width }: Cut) => {
      addCut({
        position,
        id,
        type,
        height,
        width,
        damage,
        duration,
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

  const onClick = useCallback(
    (e: PointerEvent) => {
      const { clientX, clientY } = e;

      if (isOutsideBoard(clientX, clientY)) {
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

      const damage: [number, number] = (() => {
        return [30, 50];
      })();

      const randomX = between(-5, 5);

      const left = clientX + randomX;

      cutHandler({
        id: Math.random().toString(),
        damage,
        duration: 500,
        height,
        width,
        type: CutType.Basic,
        position: {
          x: left,
          y: clientY,
        },
      });
    },

    [cutHandler, activeSkill]
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
