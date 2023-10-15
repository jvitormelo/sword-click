import { Cut } from "../../../cut/types";
import { SkillHandler } from "../../types";

export class ExtendRangeHandler implements SkillHandler {
  before(cut: Cut) {
    cut.height = 300;
    cut.width = 8;
  }

  after() {}
}
