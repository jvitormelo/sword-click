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
import { PlayerHealth } from "../PlayerHealth";

const quantity = 20;

export const GameMap = () => {
  const { isGameActive, start, spawnedQuantity } = useEnemyFactory({
    interval: 1500,
    quantity,
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
    <div className="flex flex-col">
      <span className="text-end">
        {spawnedQuantity}/{quantity}
      </span>
      <div ref={boardRef} className="bg-white w-96 h-96 flex gap-4 relative">
        {!isGameActive && (
          <div className="flex w-full  items-center justify-center">
            <button onClick={start}>Start</button>
          </div>
        )}
        <AnimatePresence>
          {enemies.map((enemy) => (
            <Enemy {...enemy} key={enemy.id} />
          ))}
        </AnimatePresence>

        <div className="absolute bottom-0 w-full bg-red-300 h-10"></div>
      </div>

      <PlayerHealth />
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
        scale: [1, 1.3, 0.5],
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
      className="w-12 h-12  z-10"
      src={Zombie}
    />
  );
};
