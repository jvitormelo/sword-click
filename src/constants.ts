export const distanceFromTop = {
  x: 0,
  y: 0,
};

export const boardSize = {
  width: 532,
  height: 532,
  get dangerZone() {
    return this.height - this.height * 0.1;
  },
};

export const FPS = 5;

export const gameTick = 1000 / FPS;
