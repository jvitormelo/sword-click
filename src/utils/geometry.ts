interface Point {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function arePointsTouching(point1: Point, point2: Point): boolean {
  console.log();
  return (
    point1.x < point2.x + point2.width &&
    point1.x + point1.width > point2.x &&
    point1.y < point2.y + point2.height &&
    point1.y + point1.height > point2.y
  );
}
