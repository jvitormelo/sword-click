import { FPS } from "@/constants";
import { PlayerStats } from "@/modules/player/types";

type PlayerOnLevelProps = PlayerStats & {
  maxLife: number;
  maxMana: number;
};

export class PlayerOnLevel {
  life: number;
  maxLife: number;
  mana: number;
  manaRegen: number;
  maxMana: number;
  level: number = 1;

  constructor(player: PlayerOnLevelProps) {
    this.life = player.life;
    this.maxLife = player.maxLife;
    this.mana = player.mana;
    this.manaRegen = player.manaRegen;
    this.maxMana = player.maxMana;
    this.level = player.level;
  }

  addEnergy(energy: number) {
    const newEnergy = this.mana + energy;

    if (newEnergy > this.maxMana) {
      this.mana = this.maxMana;
    } else {
      this.mana = newEnergy;
    }
  }

  tick() {
    this.addEnergy(this.manaRegen / FPS);
  }
}
