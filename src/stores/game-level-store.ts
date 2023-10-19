import { gameTick } from "@/constants";
import { Level } from "@/modules/level/level-selector";
import { create } from "zustand";
import { EnemiesAction, EnemiesLevel } from "../domain/enemies-level";
import { PlayerLevel } from "../domain/player-level";
import { EnemyOnLevel, PlayerOnLevel } from "../domain/types";
import { useModalStore } from "@/hooks/useOpenModal";
import { completedLevels } from "@/modules/level/completed-levels";
import { asyncGold } from "@/async-data/gold";

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
  } & Omit<EnemiesAction, "tick">;
};

let interval: NodeJS.Timeout | null = null;

export const useGameLevelStore = create<Store>((set, get) => ({
  enemies: new Map(),
  isPlaying: false,
  level: null,
  gold: asyncGold.value,
  player: {
    energy: 100,
    maxEnergy: 100,
    energyRegen: 10,
    health: 100,
  },
  actions: {
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
      set({ level, isPlaying: true });

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
          useModalStore.getState().actions.openVictory({
            goldEarned: get().gold,
          });
          asyncGold.value += get().gold;
          completedLevels.push(get().level!);
          set({ isPlaying: false, level: null });
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
