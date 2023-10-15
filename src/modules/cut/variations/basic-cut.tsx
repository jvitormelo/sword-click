import { motion } from "framer-motion";
import { ActiveCut } from "../types";

export const BasicCut = ({
  position,
  height,
  width,
  background,
  border,
}: ActiveCut) => {
  return (
    <motion.div
      className="shadow-md z-30 cursor-pointer"
      style={{
        width,
        background,
        position: "absolute",
        left: position.x,
        top: position.y,
        borderRadius: "50%",
        height,
        transformOrigin: "0 100%",
        scaleY: 0,
        translateY: "-50%",
      }}
      animate={{
        border,
        scaleY: 1,
        transition: {},
      }}
      transition={{
        duration: 0.1,
        ease: "easeInOut",
      }}
      exit={{
        scaleY: 0,
        opacity: 0,
      }}
    />
  );
};
