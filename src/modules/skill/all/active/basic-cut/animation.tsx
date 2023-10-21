import { Position, Size } from "@/types";
import { motion } from "framer-motion";
import { CSSProperties } from "react";

type Props = {
  position: Position;
  size: Size;
  style?: CSSProperties;
};

export const BasicCutAnimation = ({
  position,
  size: { height, width },
  style,
}: Props) => {
  return (
    <motion.div
      className="shadow-md z-30 cursor-pointer"
      style={{
        background: "white",
        width,
        position: "absolute",
        left: position.x,
        top: position.y,
        borderRadius: "50%",
        height,
        transformOrigin: "0 100%",
        scaleY: 0,
        translateY: "-50%",
        ...style,
      }}
      animate={{
        border: style?.border,
        scaleY: 1,
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
