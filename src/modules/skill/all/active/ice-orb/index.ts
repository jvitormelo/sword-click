import {
  ActivateParams,
  ActiveSkill,
  Damage,
  SkillActivationType,
  SkillAnimationType,
  SkillCode,
  SkillDamageType,
} from "@/modules/skill/types";
import Icon from "@/assets/skills/icons/ice-orb-icon.png";
import { CSSProperties } from "react";
import { EntityCode, gameActions } from "@/stores/game-level-store";
import IceOrbImage from "@/assets/skills/ice-orb.jpeg";
import { boardSize } from "@/constants";
import IceOrbSound from "@/assets/sounds/ice-orb.mp3";
import IceHitSound from "@/assets/sounds/ice-hit.mp3";

export class IceOrb implements ActiveSkill {
  id: string = "ice-orb";
  animationType: SkillAnimationType = SkillAnimationType.Image;
  aoe: number = 1;
  code: SkillCode = SkillCode.IceOrb;
  cost: number = 50;
  damage: Damage = [10, 15];
  damageType: SkillDamageType = SkillDamageType.Elemental;
  description: string = "A ball of ice.";
  icon: string = Icon;
  name: string = "Ice Orb";
  style: CSSProperties = {};
  type: SkillActivationType.Active = SkillActivationType.Active;

  activate(params: ActivateParams) {
    gameActions().addEntity({
      code: EntityCode.IceOrb,
      id: `${EntityCode.IceOrb}-${Math.random()}`,
      image: IceOrbImage,
      position: {
        x: params.pos.x,
        y: boardSize.height * 0.9,
      },
      size: { width: 50, height: 50 },
      speed: 20,
      target: { x: params.pos.x, y: 0 },
      sound: IceOrbSound,
      hitSound: IceHitSound,
    });
  }

  copy() {
    return new IceOrb();
  }
}
