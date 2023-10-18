import { PropsWithChildren, useEffect } from "react";
import { useGameLevelStore } from "../stores/game-level-store";
import { gameTick } from "@/constants";

export const GameLoop = ({ children }: PropsWithChildren) => {
  const { tick } = useGameLevelStore((s) => s.actions);

  useEffect(() => {
    const interval = setInterval(() => {
      tick();
    }, gameTick);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return <>{children}</>;
};
