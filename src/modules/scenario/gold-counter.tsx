import { useGameLevelStore } from "../../stores/game-level-store";

export const GoldCounter = () => {
  const gold = useGameLevelStore((s) => s.gold);

  return <span>Gold: {gold}</span>;
};
