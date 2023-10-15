import { useEffect, useRef } from "react";
import {
  Enemy,
  useEnemiesOnFieldActions,
  useEnemiesOnFieldStore,
  useEnemyFactory,
} from "../enemies/enemies-store";
import { distanceFromTop } from "../../constants";
import Zombie from "../../assets/zombie.png";
import { AnimatePresence, motion } from "framer-motion";

export const GameMap = () => {
  useEnemyFactory({
    interval: 1500,
    quantity: 20,
    randomizeIntervalEvery: 5,
  });
  const enemies = useEnemiesOnFieldStore((s) => s.enemies);

  const boardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (boardRef.current) {
      const { top, left } = boardRef.current.getBoundingClientRect();
      distanceFromTop.x = left;
      distanceFromTop.y = top;
    }
  }, []);

  return (
    <div ref={boardRef} className="bg-white w-96 h-96 flex gap-4 relative">
      <AnimatePresence>
        {enemies.map((enemy) => (
          <Enemy {...enemy} key={enemy.id} />
        ))}
      </AnimatePresence>
    </div>
  );
};

const Enemy = ({ id, position, health }: Enemy) => {
  const maxHealth = useRef(health);
  const { moveToPlayer } = useEnemiesOnFieldActions();

  const elementRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (health !== maxHealth.current) {
      elementRef.current?.animate(
        [
          { transform: "translate(0px 0px)" },
          { transform: "translate(10px -10px)" },
          { transform: "translate(-10px 0px)" },
        ],
        {
          duration: 200,
        }
      );
    }
  }, [health]);

  useEffect(() => {
    const interval = setInterval(() => {
      moveToPlayer(id, 10);
    }, 333);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <motion.img
      ref={elementRef}
      draggable={false}
      style={{
        left: position.x,
        top: position.y,
        position: "absolute",
        transition: "all 0.1s ease-in-out",
      }}
      exit={{
        scale: [1, 1.2, 1],
        translateX: [0, -5, 5, -5, 0],
      }}
      transition={{
        duration: 0.2,
        ease: "easeInOut",
      }}
      animate={{
        scale: [1, 1.2, 1],
      }}
      data-id={id}
      className="w-12 h-12  rounded-lg"
      src={Zombie}
    />
  );
};
