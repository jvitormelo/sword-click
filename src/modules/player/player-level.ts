import { FPS } from "@/constants";
import { LevelModel } from "../../domain/types";

export class PlayerLevel {
  constructor(protected level: LevelModel) {}

  addEnergy(energy: number) {
    const newEnergy = this.level.player.mana + energy;

    if (newEnergy > this.level.player.maxMana) {
      this.level.player.mana = this.level.player.maxMana;
    } else {
      this.level.player.mana = newEnergy;
    }
  }

  tick() {
    this.addEnergy(this.level.player.manaRegen / FPS);
  }
}
