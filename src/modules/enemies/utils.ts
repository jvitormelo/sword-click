export function attackSpeedToTicks(attackSpeed: number) {
  const ms = (1 / attackSpeed) * 1000;
  return Math.ceil(ms);
}
