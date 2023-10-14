import { useEffect } from "react";
import { useCutActions } from "../cut-store";
import { ActiveCut } from "../types";
import { motion } from "framer-motion";
import { between } from "../../../utils/random";
import { useEnemiesActions } from "../../enemies/enemies-store";

const duration = 500;

export const BasicCut = ({ position, id }: ActiveCut) => {
  const { removeCut } = useCutActions();
  const { cutPosition } = useEnemiesActions();

  useEffect(() => {
    const timer = setTimeout(() => {
      removeCut(id);
    }, duration);

    cutPosition(
      {
        from: {
          x: position.x,
          y: position.y,
        },
        to: {
          x: position.x + 1,
          y: position.y + 100,
        },
      },
      10
    );

    return () => clearTimeout(timer);
  }, []);

  const randomX = between(-5, 5);

  const rotate = (() => {
    return 0;
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
