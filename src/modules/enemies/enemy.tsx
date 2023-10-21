import { useEffect, useMemo, useRef } from "react";
import { EnemyOnLevel } from "./types";
import { motion } from "framer-motion";
import { Ailment } from "@/modules/enemies/enemies-level";
import { gameTick } from "@/constants";

export const Enemy = ({ enemy }: { enemy: EnemyOnLevel }) => {
  const { id, position, health, size, image, ailments } = enemy;

  const maxHealth = useRef(health);
  const initialPosition = useRef(position);

  const elementRef = useRef<HTMLImageElement>(null);

  const hasBurn = useMemo(() => ailments.includes(Ailment.Burn), [ailments]);

  const hasChill = useMemo(() => ailments.includes(Ailment.Chill), [ailments]);

  useEffect(() => {
    if (health !== maxHealth.current) {
      elementRef.current?.animate(
        [
          // shake
          { transform: "translateX(0px)" },
          { transform: "translateX(-5px)" },
          { transform: "translateX(5px)" },
          { transform: "translateX(-5px)" },
          { transform: "translateX(0px)" },
          { filter: "brightness(0.5) sepia(100%)" },
        ],
        {
          duration: 200,
        }
      );
    }
  }, [health]);

  return (
    <motion.img
      ref={elementRef}
      draggable={false}
      style={{
        left: initialPosition.current.x,
        top: initialPosition.current.y,
        position: "absolute",
        width: size.width,
        height: size.height,
        backgroundColor: hasBurn ? "red" : hasChill ? "blue" : undefined,
      }}
      exit={{
        scale: [1.1, 0.3],
        filter: "brightness(0.5) sepia(100%)",
        transition: {
          duration: 0.2,
        },
      }}
      animate={{
        top: position.y,
        left: position.x,
        scale: [0.8, 1.1, 1],
        rotate: [0, -5, 5, 0],
        transition: {
          // walk animation
          duration: gameTick / 1000,
          ease: "linear",
          loop: Infinity,
        },
      }}
      data-id={id}
      className="z-10 pointer-events-none"
      src={image}
    />
  );
};
