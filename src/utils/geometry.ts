import { Position, Size } from "@/types";

export type Point = {
  pos: Position;
  size: Size;
};

export function arePointsTouching(point1: Point, point2: Point): boolean {
  return (
    point1.pos.x < point2.pos.x + point2.size.width &&
    point1.pos.x + point1.size.width > point2.pos.x &&
    point1.pos.y < point2.pos.y + point2.size.height &&
    point1.pos.y + point1.size.height > point2.pos.y
  );
}

export interface Circle {
  pos: Position;
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
    Math.min(circle.pos.x, rectangle.x + rectangle.width)
  );
  const closestY = Math.max(
    rectangle.y,
    Math.min(circle.pos.y, rectangle.y + rectangle.height)
  );

  const distanceX = circle.pos.x - closestX;
  const distanceY = circle.pos.y - closestY;

  return (
    distanceX * distanceX + distanceY * distanceY <=
    circle.radius * circle.radius
  );
}

export function closestDistanceToCircle(point: Point, circle: Circle): number {
  const distance = Math.sqrt(
    Math.pow(circle.pos.x - point.pos.x, 2) +
      Math.pow(circle.pos.y - point.pos.y, 2)
  );
  const closestDistance = distance - circle.radius;
  return closestDistance;
}

export function boxToRadius(boxSize: number) {
  return boxSize / 2;
}
