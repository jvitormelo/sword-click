import { motion } from "framer-motion";
import { useEffect } from "react";
import { useCutActions } from "../cut-store";
import { ActiveCut } from "../types";

export const BasicCut = ({
  position,
  id,
  height,
  width,
  duration,
}: ActiveCut) => {
  const { removeCut } = useCutActions();

  useEffect(() => {
    const timer = setTimeout(() => {
      removeCut(id);
    }, duration);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <motion.div
      className="shadow-md z-30"
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
      }}
      transition={{
        duration: 0.1,
        ease: "easeInOut",
      }}
    />
  );
};
