import { FPS, gameTick } from "@/constants";

import { Level, LevelActive } from "@/modules/level/level-selector";
import { PlayerOnLevel } from "@/modules/player/types";
import { PlayerModel, updatePlayer } from "@/modules/player/use-player";
import { Ailment, Damage, SkillDamageType } from "@/modules/skill/types";
import { Position, Size } from "@/types";
import {
  Circle,
  Point,
  areCircleAndRectangleTouching,
  arePointsTouching,
} from "@/utils/geometry";
import { playSound } from "@/utils/sound";
import { create } from "zustand";
import { EnemyOnLevel } from "../modules/enemies/enemy-on-level";
import { EnemyModel } from "../modules/enemies/types";
import { PlayerLevel } from "../modules/player/player-level";
import { useModalStore } from "./modal-store";

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

type EnemyMap = Map<string, EnemyOnLevel>;

type DamageConfig = {
  condition?: (enemy: EnemyOnLevel) => boolean;
  beforeDamage?: (enemy: EnemyOnLevel, damage: Damage) => void;
};

export type GameActions = {
  spawn: (enemy: EnemyOnLevel) => void;
  addEnergy: (energy: number) => void;
  // TODO BAD IF > Refactor this
  play: (level: Level, isAbyss?: boolean) => void;
  setPlayer: (player: PlayerModel) => void;
  addEntity: (entity: EntityOnLevel) => void;
  damageEnemy: (id: string, damage: Damage, config?: DamageConfig) => void;
  damagePointArea: (
    position: Point,
    damage: Damage,
    config?: DamageConfig
  ) => { enemiesHit: EnemyMap };
  damageCircleArea: (
    circle: Circle,
    damage: Damage,
    config?: DamageConfig
  ) => { enemiesHit: EnemyMap };
};

type Store = {
  gold: number;
  level: LevelActive | null;
  isPlaying: boolean;
  player: PlayerOnLevel;
  enemies: Map<string, EnemyOnLevel>;
  entities: Map<string, EntityOnLevel>;
  actions: GameActions;
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
        const player = new PlayerLevel(state.player);

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

      const toSpawnEnemies = level.enemies();

      set({
        level: {
          ...level,
          enemies: toSpawnEnemies,
        },
        isPlaying: true,
      });

      interval = setInterval(() => {
        set((state) => {
          let gold = 0;
          const levelPayload = {
            enemies: state.enemies,

            player: state.player,
            currentTick: totalTick,
          };

          for (const enemy of state.enemies.values()) {
            enemy.tick({
              player: levelPayload.player,
              totalTicks: totalTick,
            });
          }

          gold += removeDeadEnemies(state.enemies);

          new PlayerLevel(levelPayload.player).tick();

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

          for (const [key, entity] of state.entities) {
            const { enemiesHit } = state.actions.damagePointArea(
              {
                pos: entity.position,
                size: entity.size,
              },
              {
                ailment: [Ailment.Chill],
                type: SkillDamageType.Ice,
                value: [10, 20],
              }
            );

            if (enemiesHit.size > 0) {
              playSound(entity.hitSound, 200);
              entity.position.y -= entity.speed / 2;
            } else {
              entity.position.y -= entity.speed;
            }

            if (entity.position.y < 0) {
              state.entities.delete(key);
            }
          }

          gold += removeDeadEnemies(state.enemies);

          const newEnemies = new Map(levelPayload.enemies);

          return {
            enemies: newEnemies,
            gold: state.gold + gold,
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
    spawn: (enemy) => {
      set((state) => {
        const enemies = new Map(state.enemies);

        enemies.set(enemy.id, enemy);

        return {
          enemies,
        };
      });
    },
    damagePointArea: (line, damage, config) => {
      const enemiesHit = new Map<string, EnemyOnLevel>();

      const condition = config?.condition ?? (() => true);
      const beforeDamage = config?.beforeDamage ?? (() => {});

      set((state) => {
        for (const enemy of state.enemies.values()) {
          const movementMargin = enemy.speed / FPS / 2;

          const isTouching = arePointsTouching(
            {
              pos: {
                x: enemy.position.x,
                y: enemy.position.y - movementMargin,
              },
              size: {
                width: enemy.size.width,
                height: enemy.size.height + movementMargin * 2,
              },
            },
            line
          );

          if (isTouching && condition(enemy)) {
            beforeDamage(enemy, damage);

            enemy.takeDamage(damage);
            enemiesHit.set(enemy.id, enemy);
          }
        }

        const gold = removeDeadEnemies(state.enemies);

        return {
          enemies: new Map(state.enemies),
          gold: state.gold + gold,
        };
      });

      return {
        enemiesHit: enemiesHit,
      };
    },
    damageCircleArea(circle, damage) {
      const enemiesHit = new Map<string, EnemyOnLevel>();
      set((state) => {
        for (const enemy of state.enemies.values()) {
          if (
            areCircleAndRectangleTouching(circle, {
              x: enemy.position.x,
              height: enemy.size.height,
              width: enemy.size.width,
              y: enemy.position.y,
            })
          ) {
            enemy.takeDamage(damage);
            enemiesHit.set(enemy.id, enemy);
          }
        }

        const gold = removeDeadEnemies(state.enemies);

        return {
          enemies: new Map(state.enemies),
          gold: state.gold + gold,
        };
      });
      return {
        enemiesHit: enemiesHit,
      };
    },
    damageEnemy(id, damage) {
      set((state) => {
        const enemy = state.enemies.get(id);

        if (!enemy) return state;

        enemy.takeDamage(damage);

        const gold = removeDeadEnemies(state.enemies);

        return {
          enemies: new Map(state.enemies),
          gold,
        };
      });
    },
  },
}));

export function gameActions() {
  return useGameLevelStore.getState().actions;
}

function removeDeadEnemies(enemies: Map<string, EnemyModel>) {
  let gold = 0;
  for (const [key, enemy] of enemies) {
    if (enemy.health <= 0) {
      enemies.delete(key);
      gold += 10;
    }
  }
  return gold;
}
