import { ReactNode, useEffect, useRef } from "react";

import { boardSize, distanceFromTop } from "../../constants";
import { EnemiesSpawned } from "../enemies/enemies-spawn";
import { useGameLevelStore } from "@/stores/game-level-store";

import { Card } from "@/components/Card";

type Props = {
  background: string;
  content?: ReactNode;
};

export const GameLevel = ({ background, content }: Props) => {
  const boardRef = useRef<HTMLDivElement>(null);

  const level = useGameLevelStore((s) => s.level);

  useEffect(() => {
    const onResize = () => {
      if (boardRef.current) {
        const { top, left, width, height } =
          boardRef.current.getBoundingClientRect();
        distanceFromTop.x = left;
        distanceFromTop.y = top;
        boardSize.width = Math.floor(width);
        boardSize.height = Math.floor(height);
      }
    };

    addEventListener("resize", onResize);

    onResize();

    return () => {
      removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <Card
      ref={boardRef}
      className="relative"
      style={{
        backgroundImage: `url(${level?.background ?? background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        boxShadow: "inset 0 0 0 2000px rgba(0, 0, 0, 0.5)",
        cursor: level ? "pointer" : "default",
      }}
      id="game-level"
    >
      <EnemiesSpawned />
      {level && <DangerZone />}

      {content}
    </Card>
  );
};

function DangerZone() {
  return (
    <div className="absolute left-0 bottom-0 rounded-b-md w-full border-t bg-red-300 opacity-60  border-red-500 h-[5%] flex items-center justify-center" />
  );
}
