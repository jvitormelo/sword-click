import { Card } from "@/components/Card";
import { usePlayer } from "../player/use-player";
import { goblinFactory, zombieFactory } from "../enemies/enemies-factory";
import { Level } from "../level/level-selector";
import AbyssBg from "@/assets/abyss-bg.jpeg";
import { generateEnemies } from "../enemies/generate-enemies";
import { useGameLevelStore } from "@/modules/level/game-level-store";
import { cn } from "@/utils/cn";

function getEnemies(abyssLevel: number) {
  if (abyssLevel < 10) return [zombieFactory()];

  return [zombieFactory(), goblinFactory()];
}
function getAbyssInfo(abyssLevel: number) {
  const baseMonsterNumber = 5;

  return {
    level: abyssLevel,
    monsters: baseMonsterNumber + abyssLevel * 2,
    factories: getEnemies(abyssLevel),
    multiplier: abyssLevel * 0.8,
  };
}

type AbyssInfo = ReturnType<typeof getAbyssInfo>;

export const AbyssSelector = () => {
  const { player } = usePlayer();

  return (
    <section className="grid grid-cols-2 gap-4">
      {player.abyssLevel > 1 && (
        <AbyssCard {...getAbyssInfo(player.abyssLevel + 1)} />
      )}
      <AbyssCard current {...getAbyssInfo(player.abyssLevel)} />
    </section>
  );
};

const AbyssCard = (abyssInfo: AbyssInfo & { current?: boolean }) => {
  const { play } = useGameLevelStore((s) => s.actions);

  function handleClick() {
    play(generateAbyssLevel(abyssInfo), true);
  }

  const isCompleted = abyssInfo.current && abyssInfo.level > 1;

  return (
    <Card
      style={{
        background: `rgba(0,0,0,0.7)`,
      }}
      className={cn(
        "group hover:!bg-slate-950 h-fit transition-all duration-100 ease-in-out",

        isCompleted && "border-2 border-green-800"
      )}
    >
      <span className="text-lg">
        Abyss Level {abyssInfo.level} {abyssInfo.current && `(Done)`}
      </span>
      <div className="text-sm text-gray-300">
        Min Monsters: {abyssInfo.monsters}
      </div>
      <div className="text-sm text-gray-300">
        Strength Mult: {abyssInfo.multiplier.toFixed(2)}
      </div>
      <ul className="text-sm text-gray-300">
        Enemies:{" "}
        {abyssInfo.factories.map((factory) => (
          <span key={factory.name}>{factory.name}</span>
        ))}
      </ul>
      <button
        className="mt-4 duration-200  transition-all ease-in-out bg-transparent group-hover:!bg-amber-800 group-hover:bg-auto"
        onClick={handleClick}
      >
        {getButtonText(abyssInfo.level, !!abyssInfo.current)}
      </button>
    </Card>
  );
};

function getButtonText(level: number, current: boolean) {
  if (level === 1) {
    return "Face the Abyss";
  }

  if (level > 5) {
    if (current) {
      return "Stay in darkness";
    }
    return "Embrace the Unknown";
  }

  if (current) {
    return "Continue to madness";
  }

  return "Dare to Enter";
}

// TODO > improve this
function generateAbyssLevel(abyssInfo: AbyssInfo): Level {
  return {
    id: `abyss-${abyssInfo.level.toString()}`,
    number: abyssInfo.level,
    background: AbyssBg,
    enemies: () =>
      generateEnemies([
        {
          factory: zombieFactory,
          quantity: abyssInfo.monsters,
          interval: 1000 / (abyssInfo.multiplier + 1),
          multipleSpawn: {
            every: 5,
            quantity: [abyssInfo.level, abyssInfo.level + abyssInfo.multiplier],
          },
        },
      ]),
  };
}
