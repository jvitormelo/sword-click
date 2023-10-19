import { Card } from "@/components/Card";
import { useOpenModal } from "@/hooks/useOpenModal";
import { GoldCounter } from "../player/gold-counter";
import { PlayerModel, updatePlayer, usePlayer } from "../player/use-player";
import { useGameLevelStore } from "@/stores/game-level-store";

export const LevelUpTown = () => {
  const { player } = usePlayer();
  const { open } = useOpenModal();

  const upgradedPlayer = (() => {
    const { life, mana, manaRegen, ...rest } = player;

    return {
      ...rest,
      level: player.level + 1,
      life: life + 10,
      mana: mana + 10,
      manaRegen: manaRegen + 1,
    };
  })();

  const levelUpPrice = (() => {
    const basePrice = 100; // Initial price
    const scaleFactor = 1.2; // Adjust this value to control the rate of increase

    return Math.floor(basePrice * Math.pow(scaleFactor, player.level - 1));
  })();

  function levelUp() {
    if (player.gold < levelUpPrice)
      return open({
        title: "nao aprendeu nao?",
        body: "Faz o L",
      });

    const updatedPlayer = updatePlayer((p) => ({
      ...upgradedPlayer,
      gold: p.gold - levelUpPrice,
    }));

    if (!updatedPlayer) return;

    useGameLevelStore.getState().actions.setPlayer(updatedPlayer);
  }

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-center gap-2">
        <StatsCard {...player} />
        <span>-{`>`}</span>
        <StatsCard {...upgradedPlayer} />
      </div>

      <button
        onClick={levelUp}
        className="flex items-center mt-12 mx-auto w-fit"
      >
        Level Up <GoldCounter gold={levelUpPrice} />
      </button>
    </div>
  );
};

function StatsCard(player: PlayerModel) {
  return (
    <Card className="p-2 text-base">
      <span>Level: {player.level}</span>
      <span>Life: {player.life}</span>
      <span>Mana: {player.mana}</span>
      <span> ManaRegen: {player.manaRegen.toFixed(2)}</span>
    </Card>
  );
}
