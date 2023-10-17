import { EnemiesLevel } from "./enemies-level";
import { PlayerLevel } from "./player-level";
import { LevelModel } from "./types";

export class GameLevel {
  constructor(protected level: LevelModel) {}

  tick() {
    new EnemiesLevel(this.level).tick();
    new PlayerLevel(this.level).tick();
  }
}
