import { memo } from "react";
import { useEnemyFactory } from "./use-enemy-factory";

type Props = {
  quantity: number;
};

export const SpawnEnemiesButton = memo(({ quantity }: Props) => {
  const { start } = useEnemyFactory({
    interval: 333,
    quantity,
    randomizeIntervalEvery: 2,
  });

  return <span onClick={start}>Start</span>;
});

SpawnEnemiesButton.displayName = "SpawnEnemiesButton";
