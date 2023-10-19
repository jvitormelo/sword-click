import { useGameLevelStore } from "@/stores/game-level-store";

export const ManaGlobe = () => {
  const energy = useGameLevelStore((s) => s.player.mana);
  const maxEnergy = useGameLevelStore((s) => s.player.maxMana);

  const height = energy < 0 ? 0 : (energy / maxEnergy) * 100;

  const currentEnergy = energy < 0 ? 0 : energy;

  return (
    <div className="border-2 relative h-20 w-20 mx-auto aspect-square border-blue-600 rounded-full overflow-hidden flex-shrink-0">
      <div
        className="w-full bottom-0 bg-blue-500 absolute transition-all duration-200"
        style={{ height: `${height}%` }}
      />
      <div className="absolute text-[8px] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white font-bold">
        {Math.ceil(currentEnergy)} / {maxEnergy}
      </div>
    </div>
  );
};
