import { useMousePosition } from "@/hooks/useMousePosition";
import { useSkillStore } from "./skill-store";
import { SkillCode } from "./types";

export const SkillOverlay = () => {
  const { x, y } = useMousePosition();

  const activeSkill = useSkillStore((s) => s.activeSkill);

  if (activeSkill?.code !== SkillCode.ThunderStrike) return;

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
