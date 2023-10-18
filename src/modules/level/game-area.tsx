import { useEffect, useRef } from "react";

import { boardSize, distanceFromTop } from "../../constants";
import { EnemiesSpawn } from "../enemies/enemies-spawn";

export const GameArea = () => {
  const boardRef = useRef<HTMLDivElement>(null);

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
      className="bg-blue-300 w-96 h-96 flex gap-4 relative cursor-pointer"
      id="game"
    >
      <EnemiesSpawn />
      <div className="absolute bottom-0 w-full border-t bg-red-300 opacity-30 border-red-500 h-[5%] flex items-center justify-center">
        <div>(You)</div>
      </div>
    </div>
  );
};
