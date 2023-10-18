import { memo } from "react";
import { useEnemyFactory } from "./use-enemy-factory";
import { gameTick } from "@/constants";

type Props = {
  quantity: number;
};

export const SpawnEnemiesButton = memo(({ quantity }: Props) => {
  const { start } = useEnemyFactory({
    interval: gameTick,
    quantity,
    randomizeIntervalEvery: 10,
  });

  return <span onClick={start}>Start</span>;
});

SpawnEnemiesButton.displayName = "SpawnEnemiesButton";
