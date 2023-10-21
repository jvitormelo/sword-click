import { SkillDamageType } from "@/modules/skill/types";

type Hex = `#${string}`;

export const skillDamageTypeColors: Record<SkillDamageType, Hex> = {
  [SkillDamageType.Fire]: "#ef4444",
  [SkillDamageType.Physical]: "#e4e4e7",
  [SkillDamageType.Ice]: "#0ea5e9",
  [SkillDamageType.Lightning]: "#fcd34d",
};
