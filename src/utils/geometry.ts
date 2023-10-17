interface Point {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function arePointsTouching(point1: Point, point2: Point): boolean {
  return (
    point1.x < point2.x + point2.width &&
    point1.x + point1.width > point2.x &&
    point1.y < point2.y + point2.height &&
    point1.y + point1.height > point2.y
  );
}

export interface Circle {
  x: number;
  y: number;
  radius: number;
}

interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function areCircleAndRectangleTouching(
  circle: Circle,
  rectangle: Rectangle
): boolean {
  const closestX = Math.max(
    rectangle.x,
    Math.min(circle.x, rectangle.x + rectangle.width)
  );
  const closestY = Math.max(
    rectangle.y,
    Math.min(circle.y, rectangle.y + rectangle.height)
  );

  const distanceX = circle.x - closestX;
  const distanceY = circle.y - closestY;

  return (
    distanceX * distanceX + distanceY * distanceY <=
    circle.radius * circle.radius
  );
}

interface Point {
  x: number;
  y: number;
}

export function closestDistanceToCircle(point: Point, circle: Circle): number {
  const distance = Math.sqrt(
    Math.pow(circle.x - point.x, 2) + Math.pow(circle.y - point.y, 2)
  );
  const closestDistance = distance - circle.radius;
  return closestDistance;
}
