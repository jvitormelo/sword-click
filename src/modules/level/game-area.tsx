import { useEffect, useRef } from "react";

import { distanceFromTop } from "../../constants";
import { EnemiesSpawn } from "../enemies/enemies-spawn";

export const GameArea = () => {
  const boardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onResize = () => {
      if (boardRef.current) {
        const { top, left } = boardRef.current.getBoundingClientRect();
        distanceFromTop.x = left;
        distanceFromTop.y = top;
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
      className="bg-blue-300 w-96 h-96 flex gap-4 relative cursor-pointer"
      id="game"
    >
      <EnemiesSpawn />
      <div className="absolute bottom-0 w-full border-t border-red-500 h-10 flex items-center justify-center">
        <div>(You)</div>
      </div>
    </div>
  );
};
