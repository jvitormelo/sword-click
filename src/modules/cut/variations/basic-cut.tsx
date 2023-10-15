import { useEffect, useMemo } from "react";
import { useCutActions } from "../cut-store";
import { ActiveCut } from "../types";
import { motion } from "framer-motion";
import { between } from "../../../utils/random";
import { useEnemiesOnFieldActions } from "../../enemies/enemies-store";

const duration = 500;

const height = 150;

export const BasicCut = ({ position, id }: ActiveCut) => {
  const { removeCut } = useCutActions();
  const { cutPosition } = useEnemiesOnFieldActions();

  const randomX = useMemo(() => between(-5, 5), []);

  const left = position.x + randomX;

  useEffect(() => {
    const timer = setTimeout(() => {
      removeCut(id);
    }, duration);

    cutPosition(
      {
        height: height,
        width: 3,
        x: left,
        y: position.y - height / 2,
      },
      10
    );

    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      className="shadow-md z-30"
      style={{
        width: "4px",
        background: "white",
        position: "absolute",

        left: left,
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
