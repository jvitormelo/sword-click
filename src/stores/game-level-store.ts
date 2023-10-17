import { create } from "zustand";
import { EnemiesAction, EnemiesLevel } from "../domain/enemies-level";
import { GameLevel } from "../domain/game-level";
import { PlayerLevel } from "../domain/player-level";
import { EnemyOnLevel, PlayerOnLevel } from "../domain/types";

type Store = {
  gold: number;
  player: PlayerOnLevel;
  enemies: Map<string, EnemyOnLevel>;
  actions: {
    addEnergy: (energy: number) => void;
  } & EnemiesAction;
};

export const useGameLevelStore = create<Store>((set) => ({
  enemies: new Map(),
  gold: 0,
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
    tick() {
      set((state) => {
        const gameLevel = new GameLevel({
          enemies: state.enemies,
          gold: state.gold,
          player: state.player,
        });

        gameLevel.tick();

        return {
          enemies: new Map(state.enemies),
          gold: state.gold,
          player: { ...state.player },
        };
      });
    },
    spawn: (enemy: EnemyOnLevel) => {
      set((state) => {
        const enemiesLevel = new EnemiesLevel(state);

        enemiesLevel.spawn(enemy);

        return {
          enemies: new Map(state.enemies),
        };
      });
    },
    damageLineArea: (line, damage) => {
      set((state) => {
        const enemiesController = new EnemiesLevel(state);

        enemiesController.damageLineArea(line, damage);

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
