import { boardSize } from "@/constants";
import { Position } from "@/types";
import { motion } from "framer-motion";
import FireSlashHit from "@/assets/skills/fire-slash-hit.png";
import { CSSProperties } from "react";

export const FireSlashAnimation = ({
  y,
  style,
}: Position & {
  style?: CSSProperties;
}) => {
  return (
    <motion.img
      src={FireSlashHit}
      width={50}
      style={{
        ...style,
        position: "absolute",
        top: y,
        zIndex: 100,
        translateY: "-50%",
      }}
      animate={{
        translateX: [boardSize.width, 0],
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
