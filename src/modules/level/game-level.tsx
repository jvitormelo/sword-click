import { ReactNode, useEffect, useRef } from "react";

import { boardSize, distanceFromTop } from "../../constants";
import { EnemiesSpawned } from "../enemies/enemies-spawned";
import { useGameLevelStore } from "@/stores/game-level-store";

import { Card } from "@/components/Card";
import { motion } from "framer-motion";

type Props = {
  background: string;
  content?: ReactNode;
  audio?: string;
};

export const GameLevel = ({ background, content, audio }: Props) => {
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
        boxShadow: `inset 0 0 0 2000px rgba(0, 0, 0, ${level ? 0.6 : 0.4})`,
        cursor: level ? "pointer" : "default",
      }}
      id="game-level"
    >
      <EnemiesSpawned />
      {level && <DangerZone />}

      {!level && (
        <>
          {content}
          {audio && (
            <audio
              ref={(el) => {
                if (!el) return;
                el.volume = 0.5;
              }}
              src={audio}
              autoPlay
              loop
            />
          )}
        </>
      )}
    </Card>
  );
};

function DangerZone() {
  return (
    <motion.div
      animate={{
        opacity: [0, 0.6],
      }}
      className="absolute left-0 bottom-0 rounded-b-md w-full border-t bg-red-300  border-red-500 h-[5%] flex items-center justify-center"
    />
  );
}
