import { Card } from "@/components/Card";
import { useModal } from "@/hooks/useModal";
import { GoldCounter } from "../player/gold-counter";
import { updatePlayer, usePlayer } from "../player/use-player";
import { PlayerStats } from "@/modules/player/types";

export const LevelUpTown = () => {
  const { player } = usePlayer();
  const { open } = useModal();

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

    updatePlayer((p) => ({
      ...upgradedPlayer,
      gold: p.gold - levelUpPrice,
    }));
  }

  return (
    <div className="flex flex-col pt-12">
      <div className="flex items-center justify-center gap-2">
        <StatsCard {...player} />
        <span className="text-4xl text-white font-bold">-{`>`}</span>
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

function StatsCard(player: PlayerStats) {
  const values = [
    {
      name: "Level",
      value: player.level,
    },
    {
      name: "Life",
      value: player.life,
    },
    {
      name: "Mana",
      value: player.mana,
    },
    {
      name: "ManaRegen",
      value: player.manaRegen.toFixed(2),
    },
  ];
  return (
    <Card className="p-4 gap-1">
      {values.map((value) => (
        <span>
          {value.name}: <span className="font-bold">{value.value}</span>
        </span>
      ))}
    </Card>
  );
}
