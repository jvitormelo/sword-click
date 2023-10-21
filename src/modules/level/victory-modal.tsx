import { Views, useViewStore } from "@/stores/view-store";
import { GoldCounter } from "../player/gold-counter";
import { useGameLevelStore } from "@/modules/level/game-level-store";
import { useModalStore } from "@/components/Modal/modal-store";
import { allLevels } from "./all-levels";

type Props = {
  goldEarned: number;
  levelId: string;
};

export const VictoryModalBody = ({ goldEarned = 10, levelId }: Props) => {
  const { setView } = useViewStore((s) => s.actions);
  const { play } = useGameLevelStore((s) => s.actions);
  const { close } = useModalStore((s) => s.actions);

  return (
    <div className="flex flex-col">
      <div className="flex">
        You earned <GoldCounter gold={goldEarned} />
      </div>

      <div className="flex gap-2 mt-4">
        <button
          onClick={() => {
            close();
            play(
              allLevels.find((level) => level.id === levelId) || allLevels[0]
            );
          }}
        >
          Repeat
        </button>
        <button
          onClick={() => {
            setView(Views.Town);
            close();
          }}
        >
          Town
        </button>
        <button>Next Level</button>
      </div>
    </div>
  );
};
