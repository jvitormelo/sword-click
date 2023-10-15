import { motion } from "framer-motion";
import { ActiveCut } from "../types";

export const BasicCut = ({ position, height, width }: ActiveCut) => {
  return (
    <motion.div
      className="shadow-md z-30 cursor-pointer"
      style={{
        width,
        background: "white",
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
        border: "1px solid black",
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
