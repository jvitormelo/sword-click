import { useCallback } from "react";
import { distanceFromTop } from "../../constants";
import { useEventListener } from "../../hooks/useEventListener";
import { CutMapper } from "./cut-mapper";
import { useCutActions, useCutStore } from "./cut-store";
import { Cut, CutType } from "./types";

import { AnimatePresence } from "framer-motion";
import { between } from "../../utils/random";

import SlashSound from "@/assets/sounds/slash.mp3";
import { playSound } from "@/providers/animation-provider";
import { useGameLevelStore } from "../../stores/game-level-store";
import { useSkillStore } from "../skill/skill-store";
import { ActiveSkill, SkillType } from "../skill/types";

export const CutProvider = () => {
  const { cuts } = useCutStore();
  const { addCut, removeCut } = useCutActions();
  const activeSkill = useSkillStore((s) => s.activeSkill);
  const { damageLineArea: cutPosition } = useGameLevelStore((s) => s.actions);
  const passives = useSkillStore((s) => s.passiveSkills);
  const level = useGameLevelStore((s) => s.level);

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
        cost: 5,
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
          x: cut.position.x - distanceFromTop.x,
          y: cut.position.y - cut.height / 2 - distanceFromTop.y,
        },
        between(cut.damage[0], cut.damage[1]),
        []
      );

      playSound(SlashSound);
      setTimeout(() => {
        removeCut(cut.id);
      }, cut.duration);

      cutAfter(cut);
    },
    [addCut, cutAfter, cutBefore, cutPosition, removeCut]
  );

  const skillHandler = useCallback(
    (x: number, y: number, activeSkill: ActiveSkill) => {
      if (useGameLevelStore.getState().player.energy < activeSkill.cost) return;

      activeSkill.activate(
        { x, y },
        {
          x: x - distanceFromTop.x,
          y: y - distanceFromTop.y,
        }
      );

      useGameLevelStore.getState().actions.addEnergy(-activeSkill.cost);
    },
    []
  );

  const onClick = useCallback(
    (e: PointerEvent) => {
      if (!level) return;

      const { clientX, clientY } = e;

      if (activeSkill?.type === SkillType.Active) {
        return skillHandler(clientX, clientY, activeSkill);
      }

      cutHandler(clientX, clientY);
    },

    [activeSkill, cutHandler, skillHandler, level]
  );

  useEventListener("click", onClick, document.getElementById("game-level")!);

  return (
    <AnimatePresence>
      {cuts.map((cut) => (
        <CutMapper key={cut.id} {...cut} />
      ))}
    </AnimatePresence>
  );
};
