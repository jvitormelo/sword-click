import {
  ActiveSkillModel,
  PassiveSkill,
  SkillCode,
  SkillActivationType,
  SkillDamageType,
  SkillAnimationType,
} from "../../../types";
import RuleOfThirdsIcon from "@/assets/skills/rule-of-thirds.png";

export class RuleOfThirds implements PassiveSkill {
  id = "rule-of-thirds";
  code = SkillCode.RuleOfThirds;
  name = "Rule of Thirds";
  type = SkillActivationType.Passive as const;
  description =
    "Increase the damage of your physical attacks by 100% every 3rd attack.";
  icon = RuleOfThirdsIcon;
  coolDown: number = 0;

  counter = 0;

  before(skill: ActiveSkillModel) {
    if (skill.damage.type !== SkillDamageType.Physical) return;

    if (this.counter % 3 === 0) {
      skill.damage.value[0] *= 2;
      skill.damage.value[1] *= 2;
      // make it red with filter

      if (skill.animationType === SkillAnimationType.Image) {
        skill.style.filter = "hue-rotate(180deg)";
      } else {
        skill.style.backgroundColor = "red";
      }
    }
  }

  after() {
    this.counter++;
  }
}
