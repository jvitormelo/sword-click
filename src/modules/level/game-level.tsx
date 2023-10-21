import { PropsWithChildren, ReactNode, useEffect, useRef } from "react";

import { boardSize, distanceFromTop } from "../../constants";
import { EnemiesSpawned } from "../enemies/enemies-spawned";
import { useGameLevelStore } from "@/modules/level/game-level-store";

import { Card } from "@/components/Card";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import { AnimationRender } from "@/modules/animation/animation-render";
import { EntitiesRender } from "@/modules/entities/entities-render";

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
      <section className="pointer-events-none select-none">
        <EntitiesRender />
        <EnemiesSpawned />
        <AnimationRender />
        {level && <DangerZone />}
      </section>

      {!level && (
        <>
          {content}
          {audio && (
            <audio
              ref={(el) => {
                if (el) el.volume = 0.8;
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
      className="absolute left-0 bottom-0 rounded-b-md h-full border-t bg-red-300  border-red-500 w-[5%] flex items-center justify-center"
    />
  );
}

const ShadowCard = ({
  children,
  className,
}: PropsWithChildren & {
  className?: string;
}) => {
  return (
    <div
      style={{
        textShadow: "0 0 10px #000",
        background: "rgba(0,0,0,0.6)",
        boxShadow: "0 0 10px #000",
      }}
      className={cn(
        "absolute rounded-md top-10 font-extrabold text-slate-100 text-xl  w-fit mx-auto p-8 left-0 right-0 flex items-center justify-center",
        className
      )}
    >
      {children}
    </div>
  );
};

GameLevel.ShadowCard = ShadowCard;
