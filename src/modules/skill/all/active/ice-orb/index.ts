import IceOrbImage from "@/assets/skills/ice-orb.jpeg";
import Icon from "@/assets/skills/icons/ice-orb-icon.png";
import IceHitSound from "@/assets/sounds/ice-hit.mp3";
import IceOrbSound from "@/assets/sounds/ice-orb.mp3";
import { boardSize } from "@/constants";
import {
  ActivateParams,
  ActiveSkill,
  Damage,
  SkillActivationType,
  SkillAnimationType,
  SkillCode,
  SkillDamageType,
} from "@/modules/skill/types";
import { EntityCode } from "@/stores/game-level-store";
import { CSSProperties } from "react";

export class IceOrb implements ActiveSkill {
  id: string = "ice-orb";
  animationType: SkillAnimationType = SkillAnimationType.Image;
  aoe: number = 1;
  code: SkillCode = SkillCode.IceOrb;
  cost: number = 50;
  damage: Damage = {
    value: [5, 20],
    ailment: [],
    type: SkillDamageType.Elemental,
  };
  damageType: SkillDamageType = SkillDamageType.Elemental;
  description: string = "A ball of ice.";
  icon: string = Icon;
  name: string = "Ice Orb";
  style: CSSProperties = {};
  type: SkillActivationType.Active = SkillActivationType.Active;

  activate({ actions, pos }: ActivateParams) {
    actions.addEntity({
      code: EntityCode.IceOrb,
      id: `${EntityCode.IceOrb}-${Math.random()}`,
      image: IceOrbImage,
      position: {
        x: pos.x,
        y: boardSize.height * 0.9,
      },
      size: { width: 50, height: 50 },
      speed: 20,
      target: { x: pos.x, y: 0 },
      sound: IceOrbSound,
      hitSound: IceHitSound,
    });
  }

  copy() {
    return new IceOrb();
  }
}
