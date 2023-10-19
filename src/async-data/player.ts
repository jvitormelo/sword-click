type PlayerAsync = {
  life: number;
  mana: number;
  manaRegen: number;
};

export const defaultPlayer: PlayerAsync = {
  life: 100,
  mana: 100,
  manaRegen: 20,
};
