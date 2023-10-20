import { queryClient } from "@/lib/query-client";
import { useQuery } from "@tanstack/react-query";

export type PlayerModel = {
  level: number;
  life: number;
  mana: number;
  manaRegen: number;
  gold: number;
  skills: string[];
};

const defaultPlayer: PlayerModel = {
  level: 1,
  life: 100,
  mana: 100,
  manaRegen: 10,
  gold: 1000,
  skills: [],
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

      const parsed = JSON.parse(player);
      return {
        ...defaultPlayer,
        ...parsed,
      } satisfies PlayerModel;
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
    | Partial<PlayerModel>
    | ((oldPlayer: PlayerModel) => Partial<PlayerModel>)
) => {
  const result = queryClient.setQueryData<PlayerModel>(
    ["player"],
    (oldValue) => {
      if (!oldValue) return oldValue;

      const newValue = typeof player === "function" ? player(oldValue) : player;

      const updatedValue = {
        ...oldValue,
        ...newValue,
      };

      localStorage.setItem("player", JSON.stringify(updatedValue));

      return updatedValue;
    }
  );

  return result;
};