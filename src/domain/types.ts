export type EnemyOnLevel = {
  id: string;
  health: number;
  position: {
    x: number;
    y: number;
  };
  size: {
    width: number;
    height: number;
  };

  image: string;
  attack: number;
  speed: number;
};

export type PlayerOnLevel = {
  health: number;
  energy: number;
  energyRegen: number;
  maxEnergy: number;
};

export type LevelModel = {
  player: PlayerOnLevel;
  enemies: Map<string, EnemyOnLevel>;
  gold: number;
};
