import { useEffect, useRef } from "react";

import { boardSize, distanceFromTop } from "../../constants";
import { EnemiesSpawned } from "../enemies/enemies-spawn";
import { useGameLevelStore } from "@/stores/game-level-store";
import CampfireBf from "@/assets/campfire.jpeg";

export const GameLevel = () => {
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
    <div
      ref={boardRef}
      className="bg-slate-500 w-96 h-96 flex gap-4 relative rounded-md border border-amber-800"
      style={{
        backgroundImage: `url(${level?.background ?? CampfireBf})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        boxShadow: "inset 0 0 0 2000px rgba(0, 0, 0, 0.3)",
        cursor: level ? "pointer" : "default",
      }}
      id="game-level"
    >
      <EnemiesSpawned />
      <div className="absolute bottom-0 rounded-b-md w-full border-t bg-red-300 opacity-60  border-red-500 h-[5%] flex items-center justify-center" />
    </div>
  );
};
