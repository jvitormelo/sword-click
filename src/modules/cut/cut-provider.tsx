import { PropsWithChildren, useCallback, useEffect, useState } from "react";
import { boardSize, distanceFromTop } from "../../constants";
import { useEventListener } from "../../hooks/useEventListener";
import { CutMapper } from "./cut-mapper";
import { useCutActions, useCutStore } from "./cut-store";
import { Cut, CutType } from "./types";

import { AnimatePresence } from "framer-motion";
import { between } from "../../utils/random";
import { useEnemiesOnFieldActions } from "../enemies/enemies-store";
import { useSkillStore } from "../skill/skill-store";
import { ActiveSkill, SkillType } from "../skill/types";

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

      if (activeSkill && activeSkill.type === SkillType.Enhance) {
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
    (clientX: number, clientY: number) => {
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

  const skillHandler = useCallback(
    (x: number, y: number, activeSkill: ActiveSkill) => {
      activeSkill.activate({ x, y });
    },
    []
  );

  const onClick = useCallback(
    (e: PointerEvent) => {
      const { clientX, clientY } = e;

      if (isOutsideBoard(clientX, clientY)) return;

      if (activeSkill?.type === SkillType.Active) {
        return skillHandler(clientX, clientY, activeSkill);
      }

      cutHandler(clientX, clientY);
    },

    [activeSkill, cutHandler, skillHandler]
  );

  useEventListener("click", onClick);

  return (
    <>
      <SkillOverlay />
      <AnimatePresence>
        {cuts.map((cut) => (
          <CutMapper key={cut.id} {...cut} />
        ))}
      </AnimatePresence>
      {children}
    </>
  );
};

const useMousePosition = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const updateMousePosition = (e: MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    window.addEventListener("mousemove", updateMousePosition);

    return () => window.removeEventListener("mousemove", updateMousePosition);
  }, []);

  return {
    ...mousePosition,
  };
};

const SkillOverlay = () => {
  const { x, y } = useMousePosition();

  const activeSkill = useSkillStore((s) => s.activeSkill);

  if (activeSkill?.type !== SkillType.Active) return;

  return (
    <div
      className="absolute bg-black w-2 h-2 rounded-full pointer-events-none cursor-pointer opacity-25 z-50"
      style={{
        transform: `translate(-50%, -50%)`,
        top: y,
        left: x,
      }}
    ></div>
  );
};
