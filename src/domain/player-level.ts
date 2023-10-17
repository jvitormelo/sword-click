import { LevelModel } from "./types";

export class PlayerLevel {
  constructor(protected level: LevelModel) {}

  addEnergy(energy: number) {
    const newEnergy = this.level.player.energy + energy;

    if (newEnergy > this.level.player.maxEnergy) {
      this.level.player.energy = this.level.player.maxEnergy;
    } else {
      this.level.player.energy = newEnergy;
    }
  }

  tick() {
    this.addEnergy(this.level.player.energyRegen);
  }
}
