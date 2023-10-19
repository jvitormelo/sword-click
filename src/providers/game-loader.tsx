import { useLoadPlayer } from "@/modules/player/use-player";
import { useGameLevelStore } from "@/stores/game-level-store";
import { PropsWithChildren } from "react";

let firstRender = true;

export const GameLoader = ({ children }: PropsWithChildren) => {
  const { isLoading, data } = useLoadPlayer();

  if (isLoading || !data) return <div>Loading...</div>;

  if (firstRender) {
    firstRender = false;
    useGameLevelStore.setState({
      player: {
        energy: data.mana,
        health: data.life,
        maxEnergy: data.mana,
        energyRegen: data.manaRegen,
      },
    });
  }

  return <>{children}</>;
};
