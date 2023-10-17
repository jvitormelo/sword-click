import { useEffect, useMemo, useRef } from "react";
import {
  Enemy,
  useEnemiesOnFieldActions,
  useEnemiesOnFieldStore,
  useEnemyFactory,
} from "../enemies/enemies-store";
import { distanceFromTop } from "../../constants";
import Zombie from "../../assets/zombie.png";
import { AnimatePresence, motion } from "framer-motion";
import { PlayerBars } from "../player/player-bars";
import { SkillBar } from "../skill/skill-bar";
import { useGoldStore } from "../../stores/gold-store";

const quantity = 20;

export const GameMap = () => {
  const { isGameActive, start, spawnedQuantity } = useEnemyFactory({
    interval: 1000,
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

  const enemyArr = useMemo(() => Array.from(enemies), [enemies]);

  const gold = useGoldStore((s) => s.gold);

  return (
    <div className="flex flex-col">
      <div className="flex justify-end gap-4">
        <span>Gold: {gold}</span>

        <span className="text-end">
          {spawnedQuantity}/{quantity}
        </span>
      </div>
      <div
        ref={boardRef}
        className="bg-blue-300 w-96 h-96 flex gap-4 relative cursor-pointer"
        id="game"
      >
        {!isGameActive && (
          <div className="flex w-full  items-center justify-center">
            <button onClick={start}>Start</button>
          </div>
        )}
        <AnimatePresence>
          {enemyArr.map(([key, enemy]) => (
            <Enemy {...enemy} key={key} />
          ))}
        </AnimatePresence>

        <div className="absolute bottom-0 w-full border-t border-red-500 h-10 flex items-center justify-center">
          <div>(You)</div>
        </div>
      </div>

      <PlayerBars />
      <SkillBar />
    </div>
  );
};

const Enemy = ({ id, position, health }: Enemy) => {
  const maxHealth = useRef(health);
  const { moveToPlayer } = useEnemiesOnFieldActions();
  const initialPosition = useRef(position);

  const elementRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (health !== maxHealth.current && health > 0) {
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
    }, 200);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <motion.img
      ref={elementRef}
      draggable={false}
      style={{
        left: initialPosition.current.x,
        top: initialPosition.current.y,
        position: "absolute",
      }}
      exit={{
        scale: [1.1, 0.3],
      }}
      transition={{
        duration: 0.3,
        ease: "easeInOut",
      }}
      animate={{
        top: position.y,
        left: position.x,
        scale: [0.8, 1.1, 1],
        rotate: [0, -5, 5, 0],
      }}
      data-id={id}
      className="w-12 h-12 z-10"
      src={Zombie}
    />
  );
};
