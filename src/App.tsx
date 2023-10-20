import { LevelSelector } from "./modules/level/level-selector";
import CampfireBg from "@/assets/campfire.jpeg";
import AbyssBg from "@/assets/abyss-bg.jpeg";
import { GameLevel } from "./modules/level/game-level";
import { LifeGlobe } from "./modules/player/life-globe";
import { ManaGlobe } from "./modules/player/mana-globe";
import { PlayerSideBar } from "./modules/player/player-side-bar";
import { SkillBar } from "./modules/skill/skill-bar";
import { Town } from "./modules/town";
import CampfireAudioBg from "@/assets/bg-sound/campire-bg-sound.mp3";
import { Views, useViewStore } from "./stores/view-store";

export function App() {
  return (
    <main className="flex h-screen items-center justify-center flex-col w-screen select-none p-4 ">
      <div className="flex flex-col bg-stone-950 p-4 rounded-md max-w-5xl w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_550px_1fr] gap-4 lg:h-[550px]">
          <PlayerSideBar />

          <CurrentView />

          <LevelSelector />
        </div>

        <div className="flex gap-4 pt-4 px-4">
          <LifeGlobe />
          <SkillBar />
          <ManaGlobe />
        </div>
      </div>
    </main>
  );
}

function CurrentView() {
  const view = useViewStore((s) => s.view);

  if (view === Views.Town) return <Town />;

  if (view === Views.Abyss)
    return (
      <GameLevel
        background={AbyssBg}
        content={
          <div
            style={{
              textShadow: "0 0 10px #000",

              background: "rgba(0,0,0,0.6)",
              boxShadow: "0 0 10px #000",
            }}
            className="absolute rounded-md font-extrabold translate-y-1/2 text-slate-100 bottom-1/2 text-xl  w-fit mx-auto p-8 left-0 right-0 flex items-center justify-center "
          >
            Where hope fades into darkness
          </div>
        }
      />
    );

  return (
    <GameLevel
      audio={CampfireAudioBg}
      content={
        <div
          style={{
            textShadow: "0 0 10px #000",
            background: "rgba(0,0,0,0.6)",
            boxShadow: "0 0 10px #000",
          }}
          className="absolute rounded-md font-extrabold translate-y-[-165%] text-slate-100 bottom-1/2 text-xl  w-fit mx-auto p-8 left-0 right-0 flex items-center justify-center "
        >
          Rest easy, your adventure begins here
        </div>
      }
      background={CampfireBg}
    />
  );
}
