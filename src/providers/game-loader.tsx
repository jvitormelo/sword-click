import { useLoadPlayer } from "@/modules/player/use-player";
import { useSkillStore } from "@/modules/skill/skill-store";
import { useGameLevelStore } from "@/stores/game-level-store";
import { PropsWithChildren, useEffect } from "react";

export const GameLoader = ({ children }: PropsWithChildren) => {
  const { isLoading, data } = useLoadPlayer();

  const { setPlayer } = useGameLevelStore((s) => s.actions);
  const { setSkills } = useSkillStore((s) => s.actions);

  useEffect(() => {
    if (data) {
      setPlayer(data);
      setSkills(data.skills);
    }
  }, [data]);

  if (isLoading || !data)
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        Loading...
      </div>
    );

  return <>{children}</>;
};
