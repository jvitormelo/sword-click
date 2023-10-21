import { FPS } from "@/constants";
import { PlayerOnLevel } from "@/modules/player/types";

export class PlayerLevel {
  constructor(protected player: PlayerOnLevel) {}

  addEnergy(energy: number) {
    const newEnergy = this.player.mana + energy;

    if (newEnergy > this.player.maxMana) {
      this.player.mana = this.player.maxMana;
    } else {
      this.player.mana = newEnergy;
    }
  }

  tick() {
    this.addEnergy(this.player.manaRegen / FPS);
  }
}
