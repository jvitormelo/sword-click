import MainCharacterImage from "@/assets/main-character.jpeg";
import { useEffect, useRef } from "react";
import { useGameLevelStore } from "../level/game-level-store";

export const PlayerPortrait = () => {
  const life = useGameLevelStore((s) => s.player.life);
  const maxLife = useGameLevelStore((s) => s.player.maxLife);

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
    <img
      ref={imgRef}
      src={MainCharacterImage}
      className="rounded-md w-full aspect-square border border-amber-700 mb-2"
    />
  );
};
