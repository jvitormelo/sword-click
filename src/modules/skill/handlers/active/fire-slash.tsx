import { Position } from "@/types";
import { ActiveSkill, SkillCode, SkillType } from "../../types";
import Icon from "@/assets/icons/fire-slash.png";
import { useGameLevelStore } from "@/stores/game-level-store";
import { boardSize, distanceFromTop } from "@/constants";
import { between } from "@/utils/random";
import { motion } from "framer-motion";
import FireSlashHit from "@/assets/skills/fire-slash-hit.png";
import { animationStore, playSound } from "@/providers/animation-provider";
import FireSound from "@/assets/sounds/fire.mp3";
import { Ailment } from "@/modules/enemies/enemies-level";
export class FireSlash implements ActiveSkill {
  id = "fire-slash";
  aoe = 8;
  code: SkillCode = SkillCode.FireSlash;
  cost = 30;
  damage = [30, 50] as [number, number];
  description = " Deals 30-50 damage to all enemies in a 8 tile radius.";
  icon = Icon;
  name = "Fire Slash";
  type: SkillType.Active = SkillType.Active;

  activate(absolutePos: Position, boardPosition: Position) {
    useGameLevelStore.getState().actions.damageLineArea(
      {
        x: 0,
        y: boardPosition.y,
        width: boardSize.width,
        height: 10,
      },
      between(this.damage[0], this.damage[1]),
      [Ailment.Burn]
    );

    const animationDuration = 300;

    animationStore
      .getState()
      .addAnimation(<FireSlashAnimation {...absolutePos} />, animationDuration);

    playSound(FireSound, animationDuration);
  }
}

const FireSlashAnimation = ({ y }: Position) => {
  return (
    <motion.img
      src={FireSlashHit}
      width={50}
      style={{
        position: "absolute",
        left: boardSize.width + distanceFromTop.x,
        top: y,
        zIndex: 100,
        translateY: "-50%",
      }}
      animate={{
        translateX: [0, -boardSize.width],
        rotate: [0, -45, -90],
        opacity: [1, 1, 0.8],
        transition: {
          duration: 0.3,
          ease: "easeInOut",
        },
      }}
    />
  );
};
