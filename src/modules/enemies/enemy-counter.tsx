import { memo } from "react";
import { useGameLevelStore } from "../../stores/game-level-store";

type Props = {
  quantity: number;
};

export const EnemyCounter = memo(({ quantity }: Props) => {
  const enemies = useGameLevelStore((s) => s.enemies);

  return (
    <span className="text-end">
      {enemies.size}/ {quantity}
    </span>
  );
});

EnemyCounter.displayName = "EnemyCounter";
