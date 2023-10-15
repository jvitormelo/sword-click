import { Cut } from "../../../cut/types";
import { SkillHandler } from "../../types";

export class RuleOfThirdsHandler implements SkillHandler {
  counter = 0;

  before(cut: Cut) {
    if (this.counter % 3 === 0) {
      cut.damage[0] = cut.damage[0] * 2;
      cut.damage[1] = cut.damage[1] * 2;
      cut.background = "red";
    }
  }

  after() {
    this.counter++;
  }
}
