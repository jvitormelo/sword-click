import { useGameLevelStore } from "@/stores/game-level-store";

export const LifeGlobe = () => {
  const life = useGameLevelStore((s) => s.player.life);
  const maxLife = useGameLevelStore((s) => s.player.maxLife);

  const height = life < 0 ? 0 : (life / maxLife) * 100;

  const currentLife = life < 0 ? 0 : life;

  return (
    <div className="relative h-32 w-32 mx-auto aspect-square border-2 border-red-600 rounded-full overflow-hidden flex-shrink-0">
      <div
        className="w-full bottom-0 bg-red-500 absolute transition-all duration-200 ease-out"
        style={{ height: `${height}%` }}
      />
      <div className="absolute   whitespace-nowrap top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white font-bold">
        {Math.ceil(currentLife)} / {maxLife}
      </div>
    </div>
  );
};
