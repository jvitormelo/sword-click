import MainCharacterImage from "@/assets/main-character.jpeg";
import { useEffect, useRef } from "react";
import { useGameLevelStore } from "../../stores/game-level-store";
import { GoldCounter } from "./gold-counter";
import { usePlayer } from "./use-player";
import { Card } from "@/components/Card";

export const PlayerSideBar = () => {
  const life = useGameLevelStore((s) => s.player.life);
  const maxLife = useGameLevelStore((s) => s.player.maxLife);
  const { player } = usePlayer();

  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (life !== maxLife) {
      // shake the image
      imgRef.current?.animate(
        [
          // shake
          { transform: "translateX(0px)" },
          { transform: "translateX(-5px)" },
          { transform: "translateX(5px)" },
          { transform: "translateX(-5px)" },
          { transform: "translateX(0px)" },
          { filter: "brightness(0.5) sepia(100%)" },
        ],
        {
          duration: 400,
        }
      );
    }
  }, [life]);

  return (
    <Card className="w-full">
      <img
        ref={imgRef}
        src={MainCharacterImage}
        className="rounded-md w-full aspect-square border border-amber-700 mb-2"
      />
      <span className="text-lg">
        <GoldCounter gold={player.gold} />
      </span>
    </Card>
  );
};
