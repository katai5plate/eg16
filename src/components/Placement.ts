import { Point, Rectangle } from "pixi.js";

export interface PlacementProps {
  position: Point;
  size: Point;
  angle?: number;
  scale?: Point;
  pivot?: Point;
}

export class Placement {
  rect: Rectangle;
  angle: number;
  scale: Point;
  origin: Point;
  constructor({
    position,
    size,
    angle = 0,
    scale = new Point(1, 1),
    pivot = new Point(0, 0),
  }: PlacementProps) {
    this.rect = new Rectangle(position.x, position.y, size.x, size.y);
    this.angle = angle;
    this.scale = scale;
    this.origin = pivot;
  }
}
