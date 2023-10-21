import { AnimationObject } from "@/modules/skill/types";
import { Position, Size } from "@/types";
import { CSSProperties } from "react";

type Params = {
  pos: Position;
  size: Size;
  style?: CSSProperties;
};
export const createCutAnimation = ({
  pos,
  size: { height, width },
  style,
}: Params) =>
  ({
    className: "shadow-md z-30 cursor-pointer",
    style: {
      width,
      left: pos.x,
      top: pos.y,
      height,
      backgroundColor: "white",
      position: "absolute",
      borderRadius: "50%",
      transformOrigin: "0 100%",
      translateY: "-50%",
      ...style,
    },
    animate: {
      scaleY: [0, 1],
    },
    transition: {
      duration: 0.1,
      ease: "easeInOut",
    },
    exit: {
      scaleY: 0,
      opacity: 0,
    },
  } as AnimationObject);
