import { useLoadPlayer } from "@/modules/player/use-player";
import { useSkillStore } from "@/modules/skill/skill-store";
import { useGameLevelStore } from "@/stores/game-level-store";
import { PropsWithChildren, useEffect, useState } from "react";

export const GameLoader = ({ children }: PropsWithChildren) => {
  const { isLoading, data } = useLoadPlayer();
  const [firstRender, setFirstRender] = useState(true);

  useEffect(() => {
    if (firstRender && data) {
      useGameLevelStore.setState({
        player: {
          energy: data.mana,
          health: data.life,
          maxEnergy: data.mana,
          energyRegen: data.manaRegen,
        },
      });

      useSkillStore.getState().actions.setSkills(data.skills);

      setFirstRender(false);
    }
  }, [data]);

  if (isLoading || !data || firstRender)
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        Loading...
      </div>
    );

  return <>{children}</>;
};
