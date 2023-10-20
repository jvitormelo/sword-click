export type PlayerStats = {
  life: number;
  level: number;
  mana: number;
  manaRegen: number;
  skills: string[];
};

export type PlayerOnLevel = {
  life: number;
  maxLife: number;
  mana: number;
  manaRegen: number;
  maxMana: number;
};
