import { AnimatePresence } from "framer-motion";
import { useGameLevelStore } from "../../stores/game-level-store";
import { useMemo } from "react";
import { Enemy } from "./enemy";

export const EnemiesSpawn = () => {
  const enemies = useGameLevelStore((s) => s.enemies);

  const enemyArr = useMemo(() => Array.from(enemies), [enemies]);

  return (
    <AnimatePresence>
      {enemyArr.map(([key, enemy]) => (
        <Enemy enemy={enemy} key={key} />
      ))}
    </AnimatePresence>
  );
};
