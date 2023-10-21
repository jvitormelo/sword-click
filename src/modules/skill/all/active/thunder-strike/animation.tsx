import ThunderStrikeHit from "@/assets/skills/thunder-strike-hit.png";
import { motion } from "framer-motion";

export const ThunderStrikeAnimation = ({ x, y }: { x: number; y: number }) => {
  return (
    <motion.img
      width={20}
      height={60}
      className="pointer-events-none"
      src={ThunderStrikeHit}
      animate={{
        opacity: [0, 1],
        translateY: ["-300%", "-50%"],
        transition: {
          duration: 0.1,
          ease: "easeOut",
        },
      }}
      exit={{
        opacity: 0,
        transition: {
          duration: 0.1,
        },
      }}
      style={{
        position: "absolute",
        translateX: "-50%",
        left: x,
        top: y,
        zIndex: 100,
      }}
    />
  );
};
