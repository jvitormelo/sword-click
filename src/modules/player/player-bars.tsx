import { useEffect, useRef } from "react";
import { useGameLevelStore } from "../../stores/game-level-store";
import MainCharacterImage from "@/assets/main-character.jpeg";
import { GoldCounter } from "./gold-counter";

export const PlayerOnLevel = () => {
  const { health } = useGameLevelStore((s) => s.player);

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
    <div className="border border-amber-900 bg-slate-800 p-4 rounded-md flex-shrink-0 flex-grow">
      <img
        width={100}
        ref={imgRef}
        src={MainCharacterImage}
        className="rounded-md border border-amber-700"
      />
      <GoldCounter />
    </div>
  );
};
