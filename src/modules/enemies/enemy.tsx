import { useEffect, useMemo, useRef } from "react";
import { EnemyOnLevel } from "../../domain/types";
import { motion } from "framer-motion";
import { Ailment } from "@/domain/enemies-level";

export const Enemy = ({
  id,
  position,
  health,
  size,
  image,
  ailments,
}: EnemyOnLevel) => {
  const maxHealth = useRef(health);
  const initialPosition = useRef(position);

  const elementRef = useRef<HTMLImageElement>(null);

  const hasBurn = useMemo(() => ailments.includes(Ailment.Burn), [ailments]);

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
        backgroundColor: hasBurn ? "red" : undefined,
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
          type: "spring",
          damping: 10,
          stiffness: 100,
        },
      }}
      data-id={id}
      className="z-10"
      src={image}
    />
  );
};
