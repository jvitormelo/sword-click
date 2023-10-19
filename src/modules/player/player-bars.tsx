import MainCharacterImage from "@/assets/main-character.jpeg";
import { useEffect, useRef } from "react";
import { useGameLevelStore } from "../../stores/game-level-store";
import { GoldCounter } from "./gold-counter";
import { usePlayer } from "./use-player";
import { Card } from "@/components/Card";

export const PlayerOnLevel = () => {
  const { life: health } = useGameLevelStore((s) => s.player);
  const { player } = usePlayer();

  const maxLife = useRef(health);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (health !== maxLife.current) {
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

    if (health <= 0) {
      console.log("You died");
    }
  }, [health]);

  return (
    <Card>
      <img
        width={100}
        ref={imgRef}
        src={MainCharacterImage}
        className="rounded-md border border-amber-700"
      />
      <GoldCounter gold={player.gold} />
    </Card>
  );
};
