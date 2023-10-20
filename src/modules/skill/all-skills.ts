import ExtendIcon from "../../assets/skills/extend-range.png";
import RuleOfThirds from "../../assets/skills/rule-of-thirds.png";
import { FireSlash } from "./handlers/active/fire-slash";
import { ThunderStrikeSkill } from "./handlers/active/thunder-strike";
import { ExtendRangeHandler } from "./handlers/enhance/extend-range";
import { RuleOfThirdsHandler } from "./handlers/passives/rule-of-thirds";
import {
  AnySkill,
  EnhanceSkill,
  PassiveSkill,
  SkillCode,
  SkillType,
} from "./types";

const extendRange: EnhanceSkill = {
  id: "1",
  code: SkillCode.ExtendRange,
  name: "Extend Range",
  type: SkillType.Enhance,
  description:
    "Increase the range of your basic cut, also slightly increase the width of your cut.",
  icon: ExtendIcon,
  handler: new ExtendRangeHandler(),
  costModifier: 1.2,
};

const ruleOfThirds: PassiveSkill = {
  id: "2",
  code: SkillCode.RuleOfThirds,
  name: "Rule of Thirds",
  type: SkillType.Passive,
  description: "Increase the damage of your basic cut every 3rd",
  icon: RuleOfThirds,
  handler: new RuleOfThirdsHandler(),
};

const thunderStrike = new ThunderStrikeSkill();

const fireSlash = new FireSlash();

export const allSkills: AnySkill[] = [
  extendRange,
  ruleOfThirds,
  thunderStrike,
  fireSlash,
];
