import { useGameLevelStore } from "../../stores/game-level-store";
import GoldIcon from "@/assets/icons/gold-coin.png";

export const GoldCounter = () => {
  const gold = useGameLevelStore((s) => s.gold);

  return (
    <span className="flex pt-1 text-sm items-center">
      <img width={24} src={GoldIcon} />

      <span className="pt-[0.5px]">{gold}</span>
    </span>
  );
};
