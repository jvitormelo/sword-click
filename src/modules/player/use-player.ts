import { queryClient } from "@/lib/query-client";
import { useQuery } from "@tanstack/react-query";

export type PlayerModel = {
  life: number;
  mana: number;
  manaRegen: number;
  gold: number;

  skills: string[];
  equippedSkills: string[];
};

const defaultPlayer: PlayerModel = {
  life: 100,
  mana: 100,
  manaRegen: 20,
  gold: 0,
  equippedSkills: [],
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

      return JSON.parse(player) as PlayerModel;
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
