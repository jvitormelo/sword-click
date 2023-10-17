import { PropsWithChildren, useEffect } from "react";
import { useGameLevelStore } from "../stores/game-level-store";

export const GameLoop = ({ children }: PropsWithChildren) => {
  const { tick } = useGameLevelStore((s) => s.actions);

  useEffect(() => {
    const interval = setInterval(() => {
      tick();
    }, 333);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return <>{children}</>;
};
