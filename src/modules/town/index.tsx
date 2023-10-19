import { ReactNode, useState } from "react";
import { SkillBuyer } from "./skill-buyer";
import { LevelUpTown } from "./level-up-town";
import { Card } from "@/components/Card";
import { cn } from "@/utils/cn";

type TownViews = "skills" | "level";

const viewsMap: Record<TownViews, ReactNode> = {
  skills: <SkillBuyer />,
  level: <LevelUpTown />,
};

export const Town = () => {
  const [currentView, setCurrentView] = useState<TownViews>("skills");

  const views: TownViews[] = ["level", "skills"];

  return (
    <Card className="w-96 h-96">
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
            {value}
          </button>
        ))}
      </section>
      {viewsMap[currentView]}
    </Card>
  );
};
