import { gameTick } from "@/constants";

import { Level } from "@/modules/level/level-selector";
import { PlayerOnLevel } from "@/modules/player/types";
import { PlayerModel, updatePlayer } from "@/modules/player/use-player";
import { Position, Size } from "@/types";
import { create } from "zustand";
import { EnemiesAction, EnemiesLevel } from "../modules/enemies/enemies-level";
import { EnemyOnLevel } from "../modules/enemies/types";
import { PlayerLevel } from "../modules/player/player-level";
import { useModalStore } from "./modal-store";
import { playSound } from "@/utils/sound";

export enum EntityCode {
  IceOrb = "ice-orb",
}

export type EntityOnLevel = {
  image: string;
  position: Position;
  speed: number;
  target: Position;
  id: string;
  size: Size;
  code: EntityCode;
  sound: string;
  hitSound: string;
};

type Store = {
  gold: number;
  level: Level | null;
  isPlaying: boolean;
  player: PlayerOnLevel;
  enemies: Map<string, EnemyOnLevel>;
  entities: Map<string, EntityOnLevel>;
  actions: {
    spawn: (enemy: EnemyOnLevel) => void;
    addEnergy: (energy: number) => void;
    bulkSpawn: (enemies: EnemyOnLevel[]) => void;
    // TODO BAD IF > Refactor this
    play: (level: Level, isAbyss?: boolean) => void;
    setPlayer: (player: PlayerModel) => void;
    addEntity: (entity: EntityOnLevel) => void;
  } & Omit<EnemiesAction, "tick">;
};

let interval: NodeJS.Timeout | null = null;

export const useGameLevelStore = create<Store>((set, get) => ({
  enemies: new Map(),
  isPlaying: false,
  level: null,
  entities: new Map(),
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
    addEntity(entity) {
      set((state) => {
        const entities = new Map(state.entities);

        entities.set(entity.id, entity);

        return {
          entities,
        };
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
    play(level, isAbyss) {
      if (interval) {
        clearInterval(interval);
      }

      let totalTick = 0;

      set({ level: structuredClone(level), isPlaying: true });

      interval = setInterval(() => {
        set((state) => {
          const levelPayload = {
            enemies: state.enemies,
            gold: state.gold,
            player: state.player,
          };
          for (const [key, entity] of state.entities) {
            const enemiesHit = new Map();
            state.actions.damageLineArea(
              {
                x: entity.position.x,
                y: entity.position.y,
                width: entity.size.width,
                height: entity.size.height,
              },
              [10, 20],
              [],
              enemiesHit
            );
            console.log(enemiesHit.size);
            if (enemiesHit.size > 0) {
              playSound(entity.hitSound, 200);
              entity.position.y -= entity.speed / 5;
            } else {
              entity.position.y -= entity.speed;
              entity.speed *= 0.98;
            }

            if (entity.position.y < 0) {
              state.entities.delete(key);
            }
          }

          new EnemiesLevel(levelPayload).tick();
          new PlayerLevel(levelPayload).tick();

          if (state.level) {
            for (const [key, recipe] of state.level.enemies) {
              if (Array.isArray(recipe)) {
                for (const enemyRecipe of recipe) {
                  if (totalTick >= enemyRecipe.spawnTime) {
                    levelPayload.enemies.set(
                      enemyRecipe.enemy.id,
                      enemyRecipe.enemy
                    );
                    state.level?.enemies.delete(key);
                  }
                }
              } else {
                if (totalTick >= recipe.spawnTime) {
                  levelPayload.enemies.set(recipe.enemy.id, recipe.enemy);
                  state.level?.enemies.delete(key);
                }
              }
            }
          }

          const newEnemies = new Map(levelPayload.enemies);

          return {
            enemies: newEnemies,
            gold: levelPayload.gold,
            player: { ...levelPayload.player },
            entities: new Map(state.entities),
          };
        });

        const isFinished =
          get().level?.enemies.size === 0 && get().enemies.size === 0;

        if (isFinished && interval) {
          clearInterval(interval);
          const goldEarned = get().gold;

          const level = get().level!;

          if (isAbyss) {
            updatePlayer((old) => {
              const isFirstAbyss = level.number === 1 && old.abyssLevel === 1;
              return {
                gold: old.gold + goldEarned,
                abyssLevel: isFirstAbyss
                  ? 2
                  : level.number > old.abyssLevel
                  ? level.number
                  : old.abyssLevel,
              };
            });
            set({
              isPlaying: false,
              level: null,
              gold: 0,
              entities: new Map(),
            });
          } else {
            setTimeout(() => {
              useModalStore.getState().actions.openVictory({
                goldEarned,
                levelId: level.id,
              });

              updatePlayer((old) => ({
                gold: old.gold + goldEarned,
                completedLevels: Array.from(
                  new Set([...old.completedLevels, level.id])
                ),
              }));
              set({
                isPlaying: false,
                level: null,
                gold: 0,
                entities: new Map(),
              });
            }, 500);
          }
        }
        totalTick += gameTick;
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
    damageLineArea: (line, damage, ailments, enemiesHit) => {
      set((state) => {
        const enemiesController = new EnemiesLevel(state);

        enemiesController.damageLineArea(line, damage, ailments, enemiesHit);

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

export function gameActions() {
  return useGameLevelStore.getState().actions;
}
