import { motion } from "framer-motion";
import { useEffect, useMemo } from "react";
import { between } from "../../../utils/random";
import { useEnemiesOnFieldActions } from "../../enemies/enemies-store";
import { useCutActions } from "../cut-store";
import { ActiveCut } from "../types";

export const BasicCut = ({
  position,
  id,
  height,
  width,
  damage,
  duration,
}: ActiveCut) => {
  const { removeCut } = useCutActions();
  const { cutPosition } = useEnemiesOnFieldActions();

  const randomX = useMemo(() => between(-5, 5), []);

  const left = position.x + randomX;

  useEffect(() => {
    const timer = setTimeout(() => {
      removeCut(id);
    }, duration);

    console.log("Chamou");
    cutPosition(
      {
        height: height,
        width,
        x: left,
        y: position.y - height / 2,
      },
      between(damage[0], damage[1])
    );

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
        left,
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
