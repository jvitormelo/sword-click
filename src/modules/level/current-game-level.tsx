import { Views, useViewStore } from "@/stores/view-store";

import CampfireAudioBg from "@/assets/bg-sound/campire-bg-sound.mp3";
import AbyssBgSound from "@/assets/bg-sound/dungeon-bg-sound.mp3";

import AbyssBg from "@/assets/abyss-bg.jpeg";
import CampfireBg from "@/assets/campfire.jpeg";
import { Town } from "../town";
import { GameLevel } from "./game-level";
import { AbyssSelector } from "../abyss/abyss-selector";

export function CurrentView() {
  const view = useViewStore((s) => s.view);

  if (view === Views.Town) return <Town />;

  if (view === Views.Abyss)
    return (
      <GameLevel
        background={AbyssBg}
        audio={AbyssBgSound}
        content={
          <div>
            <GameLevel.ShadowCard>
              Where hope fades into darkness
            </GameLevel.ShadowCard>
            <div className="mt-40">
              <AbyssSelector />
            </div>
          </div>
        }
      />
    );

  return (
    <GameLevel
      audio={CampfireAudioBg}
      content={
        <GameLevel.ShadowCard>
          Rest easy, your adventure begins here
        </GameLevel.ShadowCard>
      }
      background={CampfireBg}
    />
  );
}
