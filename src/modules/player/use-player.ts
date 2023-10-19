import { queryClient } from "@/lib/query-client";
import { useQuery } from "@tanstack/react-query";

type PlayerAsync = {
  life: number;
  mana: number;
  manaRegen: number;
  gold: number;
};

const defaultPlayer: PlayerAsync = {
  life: 100,
  mana: 100,
  manaRegen: 20,
  gold: 0,
};

export const useLoadPlayer = () => {
  return useQuery({
    queryKey: ["player"],
    queryFn: async () => {
      const player = localStorage.getItem("player");

      if (!player) {
        updatePlayer(defaultPlayer);

        return defaultPlayer;
      }

      return JSON.parse(player) as PlayerAsync;
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};

export const usePlayer = () => {
  const { data } = useLoadPlayer();

  return {
    player: data ?? defaultPlayer,
  };
};

export const updatePlayer = (
  player:
    | Partial<PlayerAsync>
    | ((oldPlayer: PlayerAsync) => Partial<PlayerAsync>)
) => {
  queryClient.setQueryData<PlayerAsync>(["player"], (oldValue) => {
    if (!oldValue) return oldValue;

    const newValue = typeof player === "function" ? player(oldValue) : player;

    const updatedValue = {
      ...oldValue,
      ...newValue,
    };

    localStorage.setItem("player", JSON.stringify(updatedValue));

    return updatedValue;
  });
};
