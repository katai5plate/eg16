import { Point, Rectangle } from "pixi.js";
import { xywh, xy } from "core/utils/math";

export interface PlacementProps {
  position: Point;
  size: Point;
  angle?: number;
  scale?: Point;
  origin?: Point;
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
    origin = xy(0, 0),
  }: PlacementProps) {
    this.posize = xywh(position.x, position.y, size.x, size.y);
    this.angle = angle;
    this.scale = scale;
    this.origin = origin;
  }
}
