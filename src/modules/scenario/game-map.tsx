import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef } from "react";
import Zombie from "../../assets/zombie.png";
import { distanceFromTop } from "../../constants";
import { useGoldStore } from "../../stores/gold-store";
import {
  Enemy,
  useEnemiesOnFieldStore,
  useEnemyFactory,
} from "../enemies/enemies-store";
import { PlayerBars } from "../player/player-bars";
import { SkillBar } from "../skill/skill-bar";

const quantity = 500;

export const GameMap = () => {
  const { start } = useEnemyFactory({
    interval: 10,
    quantity,
    randomizeIntervalEvery: 1,
  });

  const enemies = useEnemiesOnFieldStore((s) => s.enemies);

  const boardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onResize = () => {
      if (boardRef.current) {
        const { top, left } = boardRef.current.getBoundingClientRect();
        distanceFromTop.x = left;
        distanceFromTop.y = top;
      }
    };

    addEventListener("resize", onResize);

    onResize();

    return () => {
      removeEventListener("resize", onResize);
    };
  }, []);

  const enemyArr = useMemo(() => Array.from(enemies), [enemies]);

  const gold = useGoldStore((s) => s.gold);

  return (
    <div className="flex flex-col">
      <div className="flex justify-end gap-4">
        <span onClick={start}>Start</span>
        <span>Gold: {gold}</span>

        <span className="text-end">
          {enemyArr.length}/ {quantity}
        </span>
      </div>
      <div
        ref={boardRef}
        className="bg-blue-300 w-96 h-96 flex gap-4 relative cursor-pointer"
        id="game"
      >
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
  const initialPosition = useRef(position);

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
      className="w-12 h-12 z-10"
      src={Zombie}
    />
  );
};
