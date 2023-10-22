import { FPS, gameTick } from "@/constants";

import { EntityOnLevel } from "@/modules/entities/types";

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
import { PlayerOnLevel } from "../player/player-level";
import { LevelModel } from "@/modules/level/types";
import { LevelOnLevel } from "@/modules/level/level-on-level";
import { mainTick } from "@/modules/main";

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
  damageAllEnemies: (damage: Damage, config?: DamageConfig) => void;
  searchEnemies: (condition: (enemy: EnemyOnLevel) => boolean) => EnemyMap;
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
  player: new PlayerOnLevel({
    level: 1,
    life: 0,
    mana: 0,
    manaRegen: 0,
    maxLife: 0,
    maxMana: 0,
  }),
  actions: {
    setPlayer(data) {
      set({
        player: new PlayerOnLevel({
          ...data,
          maxLife: data.life,
          maxMana: data.mana,
        }),
      });
    },
    addEntity(entity) {
      set((state) => {
        const entities = new Map(state.entities);

        entities.set(entity.id, entity);

        return { entities };
      });
    },
    addEnergy: (energy) => {
      set((state) => {
        const player = new PlayerOnLevel(state.player);

        player.addEnergy(energy);

        return { player };
      });
    },
    play(level, isAbyss) {
      if (interval) {
        clearInterval(interval);
      }

      let totalTick = 0;

      set({ level: new LevelOnLevel(level), isPlaying: true });

      interval = setInterval(() => {
        const { enemies, gold, player, entities, level } = get();

        if (!level) throw new Error("Level is null");

        const isFinished = level?.enemies.size === 0 && enemies.size === 0;

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

        const nextTick = mainTick(entities, enemies, player, level, totalTick);

        set({
          enemies: nextTick.enemies,
          gold: gold + nextTick.gold,
          player: nextTick.player,
          entities: nextTick.entities,
        });

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
              y: enemy.position.y,
              height: enemy.size.height,
              width: enemy.size.width,
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
    damageAllEnemies(damage, config) {
      set((state) => {
        const enemiesCopy = new Map(state.enemies);
        const condition = config?.condition ?? (() => true);
        const beforeDamage = config?.beforeDamage ?? (() => {});
        for (const enemy of enemiesCopy.values()) {
          if (condition(enemy)) {
            beforeDamage(enemy, damage);
            enemy.takeDamage(damage);
          }
        }
        const gold = removeDeadEnemies(enemiesCopy);

        return {
          enemies: enemiesCopy,
          gold: state.gold + gold,
        };
      });
    },
    searchEnemies(condition) {
      const state = get();

      const enemies = new Map<string, EnemyOnLevel>();

      for (const enemy of state.enemies.values()) {
        if (condition(enemy)) {
          enemies.set(enemy.id, enemy);
        }
      }

      return enemies;
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

export function removeDeadEnemies(enemies: Map<string, EnemyModel>) {
  let gold = 0;
  for (const [key, enemy] of enemies) {
    if (enemy.health <= 0) {
      enemies.delete(key);
      gold += 10;
    }
  }
  return gold;
}
