import LevelUpBg from "@/assets/level-up-bg.jpeg";
import { Card } from "@/components/Card";
import { GoldCounter } from "@/modules/player/gold-counter";
import { usePlayer } from "@/modules/player/use-player";
import { cn } from "@/utils/cn";
import { ReactNode, useState } from "react";
import { LevelUpTown } from "./level-up-town";
import { SkillBuyer } from "@/modules/town/skill-buyer";

enum TownViewsEnum {
  Skills = "skills",
  Level = "level",
}

const viewsMap: Record<TownViewsEnum, ReactNode> = {
  [TownViewsEnum.Skills]: <SkillBuyer />,
  [TownViewsEnum.Level]: <LevelUpTown />,
};

const viewTextMap: Record<TownViewsEnum, string> = {
  [TownViewsEnum.Skills]: "Skills",
  [TownViewsEnum.Level]: "Level Up",
};

export const Town = () => {
  const [currentView, setCurrentView] = useState<TownViewsEnum>(
    TownViewsEnum.Level
  );

  const { player } = usePlayer();

  const views = Object.values(TownViewsEnum);

  return (
    <Card
      style={{
        backgroundImage: `url(${LevelUpBg})`,
        backgroundSize: "cover",
        boxShadow: "inset 0 0 0 2000px rgba(0, 0, 0, 0.5)",
      }}
    >
      <section className="flex gap-2 mb-4">
        {views.map((value) => (
          <button
            key={value}
            id={value}
            className={cn(
              currentView === value && "bg-amber-800 border-amber-950"
            )}
            onClick={() => setCurrentView(value)}
          >
            {viewTextMap[value]}
          </button>
        ))}
        <div className="ml-auto text-xl bg-primary flex items-center justify-center rounded-md px-4">
          <GoldCounter gold={player.gold} />
        </div>
      </section>
      {viewsMap[currentView]}
    </Card>
  );
};
