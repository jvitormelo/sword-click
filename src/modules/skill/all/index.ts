import { ThunderStrikeSkill } from "@/modules/skill/all/active/thunder-strike";
import { FireSlash } from "@/modules/skill/all/active/fire-slash";
import { RuleOfThirds } from "@/modules/skill/all/passives/rule-of-thirds";
import { AnySkill } from "@/modules/skill/types";
import { GreatSlash } from "@/modules/skill/all/active/great-slash";
import { IceOrb } from "@/modules/skill/all/active/ice-orb";
import { IceShatter as IceShatter } from "@/modules/skill/all/active/ice-shatter";
import { FireNova } from "@/modules/skill/all/active/fire-nova";

export const allSkills: AnySkill[] = [
  new RuleOfThirds(),
  new ThunderStrikeSkill(),
  new FireSlash(),
  new GreatSlash(),
  new IceOrb(),
  new IceShatter(),
  new FireNova(),
];
