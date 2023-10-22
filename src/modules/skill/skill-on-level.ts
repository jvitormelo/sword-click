import { useAnimationStore } from "@/modules/animation/animation-store";
import { useGameLevelStore } from "@/modules/level/game-level-store";
import { PlayerOnLevel } from "@/modules/player/player-level";
import { useSkillStore } from "@/modules/skill/skill-store";
import {
  ActivateParams,
  ActivationType,
  ActiveSkillModel,
  Damage,
  SkillActivationType,
  SkillAnimationType,
  SkillCode,
} from "@/modules/skill/types";
import { playSound } from "@/utils/sound";
import { CSSProperties } from "react";
import { Position } from "../../types";

export abstract class ActiveSkill implements ActiveSkillModel {
  type: SkillActivationType.Active = SkillActivationType.Active as const;
  /**
   * Default cost is 30
   */
  cost: number = 30;
  /**
   * Default aoe is 1
   */
  aoe: number = 1;

  /**
   * Default coolDown is 0
   */
  coolDown: number = 0;

  style: CSSProperties = {};

  /**
   * Default animationType is Image
   */
  animationType: SkillAnimationType = SkillAnimationType.Image;
  /**
   * Default activationType is Click
   */
  activationType: ActivationType = ActivationType.Click;

  get id(): string {
    return this.code;
  }

  abstract icon: string;
  abstract name: string;
  abstract description: string;
  abstract code: SkillCode;
  abstract damage: Damage;
  protected abstract activate(params: ActivateParams): void;
  abstract copy(): ActiveSkill;

  canActivate(player: PlayerOnLevel) {
    if (player.mana >= this.cost) {
      return true;
    }
    throw new Error(`Not enough mana to use ${this.name}.`);
  }

  execute(pos: Position) {
    const { player, actions } = useGameLevelStore.getState();
    const { addAnimation } = useAnimationStore.getState().actions;
    const {
      lastUsedSkills,
      actions: { addHistory },
    } = useSkillStore.getState();

    try {
      this.checkCooldown(lastUsedSkills.get(this.id));

      const passives = useSkillStore.getState().passiveSkills;

      const skillCopy = this.copy();

      passives.forEach((passive) => passive.before(skillCopy));

      skillCopy.canActivate(player);

      skillCopy.activate({
        pos,
        actions,
        scene: { playAnimation: addAnimation, playSound: playSound },
      });

      addHistory(skillCopy.id);

      actions.addEnergy(-skillCopy.cost);

      passives.forEach((passive) => passive.after(skillCopy));

      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  checkCooldown(lastUsed?: number) {
    if (this.coolDown && lastUsed) {
      const seconds = Math.floor(
        (this.coolDown - (Date.now() - lastUsed)) / 1000
      );

      if (seconds > 0) {
        throw new Error(`Skill is on cooldown for ${seconds} seconds.`);
      }
    }
  }
}
