export const distanceFromTop = {
  x: 0,
  y: 0,
};

export const boardSize = {
  width: 384,
  height: 384,
  get dangerZone() {
    return this.height - this.height * 0.1;
  },
};

export const gameTick = 333;
