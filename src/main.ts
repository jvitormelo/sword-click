import { EnemyOnLevel } from "@/modules/enemies/enemy-on-level";
import { EntityOnLevel } from "@/modules/entities/types";
import { removeDeadEnemies } from "@/modules/level/game-level-store";
import { LevelOnLevel } from "@/modules/level/level-on-level";
import { PlayerOnLevel } from "@/modules/player/player-level";

export function mainTick(
  entities: Map<string, EntityOnLevel>,
  enemies: Map<string, EnemyOnLevel>,
  player: PlayerOnLevel,
  level: LevelOnLevel,
  totalTick: number
) {
  let gold = 0;

  for (const entity of entities.values()) {
    entity.tick({ enemies });
    if (entity.removable) {
      entities.delete(entity.id);
    }
  }

  gold += removeDeadEnemies(enemies);

  // Enemies tick
  for (const enemy of enemies.values()) {
    enemy.tick({ player, totalTicks: totalTick });
  }

  gold += removeDeadEnemies(enemies);

  // Player tick
  player.tick();

  // Level tick
  if (level) {
    level.tick(enemies, totalTick);
  }

  return {
    enemies: new Map(enemies),
    gold,
    player: new PlayerOnLevel(player),
    entities: new Map(entities),
  };
}
