import { useEffect } from "react";
import { useCutActions } from "../cut-store";
import { Cut } from "../types";
import { motion } from "framer-motion";
import { between } from "../../../utils/random";

type CutWithoutType = Omit<Cut, "type">;

const duration = 500;

export const BasicCut = ({ position, id }: CutWithoutType) => {
  const { removeCut } = useCutActions();

  useEffect(() => {
    const timer = setTimeout(() => {
      removeCut(id);
    }, duration);
    return () => clearTimeout(timer);
  }, []);

  const randomX = between(-5, 5);

  const rotate = (() => {
    const mapper = {
      leftToRight: 0,
      rightToLeft: 180,
      topToBottom: 90,
      bottomToTop: 270,
      leftTopToRightBottom: 45,
      rightBottomToLeftTop: 225,
      leftBottomToRightTop: 135,
      rightTopToLeftBottom: 315,
    };

    const values = [
      mapper["leftToRight"],
      mapper["rightToLeft"],
      mapper["topToBottom"],
      mapper["bottomToTop"],
      mapper["leftTopToRightBottom"],
      mapper["rightBottomToLeftTop"],
      mapper["leftBottomToRightTop"],
      mapper["rightTopToLeftBottom"],
    ];

    const randomIndex = between(0, values.length - 1);
    return values[randomIndex];
  })();

  return (
    <motion.div
      className="shadow-md"
      style={{
        width: "4px",
        background: "white",
        position: "absolute",
        border: "1px solid black",
        left: position.x + randomX,
        top: position.y - 60,
        borderRadius: "50%",
        rotate: rotate,
      }}
      animate={{
        // make the height grow from bottom to top
        height: [30, 120],
      }}
      transition={{
        duration: 0.1,
        ease: "easeInOut",
      }}
    />
  );
};
