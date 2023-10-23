import { queryClient } from "@/lib/query-client";
import { useQuery } from "@tanstack/react-query";
import { PlayerStats } from "./types";

export type PlayerModel = {
  gold: number;
  completedLevels: string[];
  abyssLevel: number;
} & PlayerStats;

type PlayerModelWithSkills = PlayerModel & {
  skills: string[];
};

const defaultPlayer: PlayerModelWithSkills = {
  level: 1,
  life: 100,
  mana: 100,
  manaRegen: 10,
  gold: 1000,
  skills: [],
  completedLevels: [],
  abyssLevel: 1,
};

export const useLoadPlayer = () => {
  return useQuery({
    queryKey: ["player"],
    queryFn: () => {
      const player = localStorage.getItem("player");

      if (!player) {
        updatePlayer(defaultPlayer);

        return defaultPlayer;
      }

      const parsed = JSON.parse(player) as PlayerModelWithSkills;
      return {
        ...defaultPlayer,
        ...parsed,
      } as PlayerModelWithSkills;
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
    | Partial<PlayerModelWithSkills>
    | ((oldPlayer: PlayerModelWithSkills) => Partial<PlayerModelWithSkills>)
) => {
  try {
    const result = queryClient.setQueryData<PlayerModelWithSkills>(
      ["player"],
      (oldValue) => {
        if (!oldValue) return oldValue;

        const newValue =
          typeof player === "function" ? player(oldValue) : player;

        const updatedValue = {
          ...oldValue,
          ...newValue,
        };

        localStorage.setItem("player", JSON.stringify(updatedValue));

        return updatedValue;
      }
    );
    return result;
  } catch (e) {
    console.error(e);
  }
};
