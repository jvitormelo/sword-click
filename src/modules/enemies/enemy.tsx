import { useEffect, useRef } from "react";
import { EnemyModel } from "./types";
import { motion } from "framer-motion";
import { gameTick } from "@/constants";
import { Ailment } from "@/modules/skill/types";

export const Enemy = ({ enemy }: { enemy: EnemyModel }) => {
  const { id, position, health, size, image, ailments } = enemy;

  const maxHealth = useRef(health);
  const isAnimating = useRef(false);
  const initialPosition = useRef(position);

  const elementRef = useRef<HTMLImageElement>(null);

  const hasBurn = ailments.includes(Ailment.Burn);

  const hasChill = ailments.includes(Ailment.Chill);

  if (enemy.isAttacking && !isAnimating.current) {
    const prepareAttack = () => {
      isAnimating.current = true;
      const animation = elementRef.current?.animate(
        [
          { transform: "translateY(-6px) rotate(16deg)", scale: 0.9 },
          { transform: "translateY(6px) rotate(-8deg)", scale: 1.1 },
        ],
        {
          duration: enemy.attackSpeed,
          easing: "ease-in-out",
        }
      );

      if (animation) {
        animation.onfinish = () => {
          isAnimating.current = false;
        };
      }
    };

    prepareAttack();
  }

  useEffect(() => {
    const translateAnimation = enemy.isAttacking
      ? []
      : [
          { transform: "translateX(0px)" },
          { transform: "translateX(-5px)" },
          { transform: "translateX(5px)" },
          { transform: "translateX(-5px)" },
          { transform: "translateX(0px)" },
        ];
    if (health !== maxHealth.current) {
      elementRef.current?.animate(
        [
          // shake

          ...translateAnimation,
          { filter: "brightness(0.3) sepia(100%)" },
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
