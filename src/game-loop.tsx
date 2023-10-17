import { PropsWithChildren, useEffect } from "react";
import { useEnemiesOnFieldActions } from "./modules/enemies/enemies-store";

export const GameLoop = ({ children }: PropsWithChildren) => {
  const { moveEnemiesToPlayer } = useEnemiesOnFieldActions();

  useEffect(() => {
    const interval = setInterval(() => {
      moveEnemiesToPlayer();
    }, 333);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return <>{children}</>;
};
