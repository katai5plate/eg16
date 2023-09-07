import { Point, Rectangle } from "pixi.js";
import { rect, xy } from "../utils/math";

export interface PlacementProps {
  position: Point;
  size: Point;
  angle?: number;
  scale?: Point;
  pivot?: Point;
}

export class Placement {
  public posize: Rectangle;
  public angle: number;
  public scale: Point;
  public origin: Point;

  constructor({
    position,
    size,
    angle = 0,
    scale = xy(1, 1),
    pivot = xy(0, 0),
  }: PlacementProps) {
    this.posize = rect(position.x, position.y, size.x, size.y);
    this.angle = angle;
    this.scale = scale;
    this.origin = pivot;
  }
}
