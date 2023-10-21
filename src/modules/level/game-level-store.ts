import { FPS, gameTick } from "@/constants";

import { EntityOnLevel } from "@/modules/entities/types";

import { PlayerOnLevel } from "@/modules/player/types";
import { PlayerModel, updatePlayer } from "@/modules/player/use-player";
import { Damage } from "@/modules/skill/types";
import {
  Circle,
  Point,
  areCircleAndRectangleTouching,
  arePointsTouching,
} from "@/utils/geometry";
import { create } from "zustand";
import { useModalStore } from "../../components/Modal/modal-store";
import { EnemyOnLevel } from "../enemies/enemy-on-level";
import { EnemyModel } from "../enemies/types";
import { PlayerLevel } from "../player/player-level";
import { LevelModel } from "@/modules/level/types";
import { LevelOnLevel } from "@/modules/level/level-on-level";

type EnemyMap = Map<string, EnemyOnLevel>;

type DamageConfig = {
  condition?: (enemy: EnemyOnLevel) => boolean;
  beforeDamage?: (enemy: EnemyOnLevel, damage: Damage) => void;
};

type DamagePointArea = (
  position: Point,
  damage: Damage,
  config?: DamageConfig
) => { enemiesHit: EnemyMap };

type DamageCircleArea = (
  circle: Circle,
  damage: Damage,
  config?: DamageConfig
) => { enemiesHit: EnemyMap };

export type GameActions = {
  addEnergy: (energy: number) => void;
  // TODO BAD IF > Refactor this
  play: (level: LevelModel, isAbyss?: boolean) => void;
  setPlayer: (player: PlayerModel) => void;
  addEntity: (entity: EntityOnLevel) => void;
  damageEnemy: (id: string, damage: Damage, config?: DamageConfig) => void;
  damagePointArea: DamagePointArea;
  damageCircleArea: DamageCircleArea;
};

type Store = {
  gold: number;
  level: LevelOnLevel | null;
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

      set({ level: new LevelOnLevel(level), isPlaying: true });

      interval = setInterval(() => {
        set((state) => {
          const levelPayload = {
            enemies: state.enemies,
            player: state.player,
            entities: state.entities,
            gold: 0,
          };

          for (const entity of levelPayload.entities.values()) {
            entity.tick({ enemies: levelPayload.enemies });
            if (entity.removable) {
              state.entities.delete(entity.id);
            }
          }

          levelPayload.gold += removeDeadEnemies(levelPayload.enemies);

          // Enemies tick
          for (const enemy of levelPayload.enemies.values()) {
            enemy.tick({
              player: levelPayload.player,
              totalTicks: totalTick,
            });
          }

          levelPayload.gold += removeDeadEnemies(levelPayload.enemies);

          // Player tick
          new PlayerLevel(levelPayload.player).tick();

          // Level tick
          if (state.level) {
            state.level.tick(levelPayload.enemies, totalTick);
          }

          return {
            enemies: new Map(levelPayload.enemies),
            gold: state.gold + levelPayload.gold,
            player: { ...levelPayload.player },
            entities: new Map(levelPayload.entities),
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
    damagePointArea: (line, damage, config) => {
      const state = get();

      const { enemies, enemiesHit } = pureDamagePointArea(
        state.enemies,
        line,
        damage,
        config
      );

      const gold = removeDeadEnemies(enemies);

      set({ enemies, gold: state.gold + gold });

      return {
        enemiesHit,
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
          gold: state.gold + gold,
        };
      });
    },
  },
}));

export const pureDamagePointArea = (
  enemies: Map<string, EnemyOnLevel>,
  line: Point,
  damage: Damage,
  config?: DamageConfig
) => {
  const enemyCopy = new Map(enemies);
  const enemiesHit = new Map<string, EnemyOnLevel>();

  const condition = config?.condition ?? (() => true);
  const beforeDamage = config?.beforeDamage ?? (() => {});

  for (const enemy of enemyCopy.values()) {
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

  return {
    enemiesHit,
    enemies: enemyCopy,
  };
};

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
