import { gameTick } from "@/constants";

import { Level } from "@/modules/level/level-selector";
import { create } from "zustand";
import { EnemiesAction, EnemiesLevel } from "../modules/enemies/enemies-level";
import { PlayerLevel } from "../modules/player/player-level";
import { EnemyOnLevel, PlayerOnLevel } from "../domain/types";
import { PlayerModel, updatePlayer } from "@/modules/player/use-player";
import { useModalStore } from "./modal-store";

type Store = {
  gold: number;
  level: Level | null;
  isPlaying: boolean;
  player: PlayerOnLevel;
  enemies: Map<string, EnemyOnLevel>;
  actions: {
    addEnergy: (energy: number) => void;
    bulkSpawn: (enemies: EnemyOnLevel[]) => void;
    play: (level: Level) => void;
    setPlayer: (player: PlayerModel) => void;
  } & Omit<EnemiesAction, "tick">;
};

let interval: NodeJS.Timeout | null = null;

export const useGameLevelStore = create<Store>((set, get) => ({
  enemies: new Map(),
  isPlaying: false,
  level: null,
  gold: 0,
  player: {
    mana: 0,
    maxMana: 0,
    manaRegen: 0,
    life: 1,
    maxLife: 1,
  },
  actions: {
    setPlayer(data) {
      set({
        player: {
          life: data.life,
          maxLife: data.life,
          mana: data.mana,
          maxMana: data.mana,
          manaRegen: data.manaRegen,
        },
      });
    },
    addEnergy: (energy) => {
      set((state) => {
        const player = new PlayerLevel(state);

        player.addEnergy(energy);

        return {
          player: { ...state.player },
        };
      });
    },
    play(level) {
      if (interval) {
        clearInterval(interval);
      }

      set({ level: structuredClone(level), isPlaying: true });

      interval = setInterval(() => {
        set((state) => {
          const nextToSpawn = state.level?.enemies.shift();

          const level = {
            enemies: state.enemies,
            gold: state.gold,
            player: state.player,
          };

          new EnemiesLevel(level).tick();
          new PlayerLevel(level).tick();

          const newEnemies = new Map(level.enemies);

          if (nextToSpawn) {
            newEnemies.set(nextToSpawn.id, nextToSpawn);
          }

          return {
            enemies: newEnemies,
            gold: level.gold,
            player: { ...level.player },
          };
        });

        const isFinished =
          get().level?.enemies.length === 0 && get().enemies.size === 0;

        if (isFinished && interval) {
          clearInterval(interval);
          const goldEarned = get().gold;

          const level = get().level!;

          setTimeout(() => {
            useModalStore.getState().actions.openVictory({
              goldEarned,
              levelId: level.id,
            });
            updatePlayer((old) => ({ gold: old.gold + goldEarned }));
            set({ isPlaying: false, level: null, gold: 0 });
          }, 500);
        }
      }, gameTick);
    },
    bulkSpawn: (enemies: EnemyOnLevel[]) => {
      set((state) => {
        const newEnemies = new Map(state.enemies);

        for (const enemy of enemies) {
          newEnemies.set(enemy.id, enemy);
        }

        return {
          enemies: newEnemies,
        };
      });
    },
    spawn: (enemy: EnemyOnLevel) => {
      set((state) => {
        const enemies = new Map(state.enemies);

        enemies.set(enemy.id, enemy);

        return {
          enemies,
        };
      });
    },
    damageLineArea: (line, damage, ailments) => {
      set((state) => {
        const enemiesController = new EnemiesLevel(state);

        enemiesController.damageLineArea(line, damage, ailments);

        return {
          enemies: new Map(state.enemies),
          gold: state.gold,
        };
      });
    },
    damageCircleArea(circle, damage, enemiesHit) {
      set((state) => {
        const enemiesLevel = new EnemiesLevel(state);

        enemiesLevel.damageCircleArea(circle, damage, enemiesHit);

        return {
          enemies: new Map(state.enemies),
          gold: state.gold,
        };
      });
    },
    damageEnemy(id, damage) {
      set((state) => {
        const enemiesLevel = new EnemiesLevel(state);

        enemiesLevel.damageEnemy(id, damage);

        return {
          enemies: new Map(state.enemies),
        };
      });
    },
  },
}));
