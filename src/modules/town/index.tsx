import { ReactNode, useState } from "react";
import { SkillBuyer } from "./skill-buyer";
import { LevelUpTown } from "./level-up-town";
import { Card } from "@/components/Card";
import { cn } from "@/utils/cn";
import LevelUpBg from "@/assets/level-up-bg.jpeg";

type TownViews = "skills" | "level";

enum TownViewsEnum {
  Skills = "skills",
  Level = "level",
}

const viewsMap: Record<TownViews, ReactNode> = {
  [TownViewsEnum.Skills]: <SkillBuyer />,
  [TownViewsEnum.Level]: <LevelUpTown />,
};

const viewTextMap: Record<TownViews, string> = {
  [TownViewsEnum.Skills]: "Skills",
  [TownViewsEnum.Level]: "Level Up",
};

export const Town = () => {
  const [currentView, setCurrentView] = useState<TownViews>("skills");

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
      </section>
      {viewsMap[currentView]}
    </Card>
  );
};
