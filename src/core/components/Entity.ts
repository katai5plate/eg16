import { Body, Box, Ellipse, SATVector, deg2rad } from "detect-collisions";
import { Point, Rectangle, Sprite } from "pixi.js";
import { Placement, PlacementProps } from "./Placement";
import { xy } from "../utils/math";

interface EntityProps {
  name: string;
  placement: PlacementProps;
  // Polygon は動作が不安定なので使用を制限する
  shape: "BOX" | "CIRCLE";
  render: Sprite;
}

export class Entity {
  protected placement: Placement;
  protected destroyed: boolean = false;

  protected _name: string;
  protected _collider: Body;
  protected _render: Sprite;

  constructor({ name, placement, shape, render }: EntityProps) {
    this._name = name;

    this.placement = new Placement(placement);
    this._render = render;
    this._render.name = name;
    if (shape === "BOX")
      this._collider = new Box(
        placement.position,
        placement.size.x,
        placement.size.y
      );
    else if (shape === "CIRCLE")
      this._collider = new Ellipse(
        placement.position,
        placement.size.x,
        placement.size.y
      );
    else throw new Error("無効な形状タイプ");
    this.apply();
  }
  get name() {
    return this._name;
  }
  get collider(): Readonly<typeof this._collider> {
    return this._collider;
  }
  get render(): Readonly<typeof this._render> {
    return this._render;
  }
  get globalRect(): Readonly<Rectangle> {
    return this.placement.posize;
  }
  destroy() {
    this._render.destroy();
    this._collider.system?.remove(this._collider);
    this.destroyed = true;
  }
  get position(): Readonly<Point> {
    const { x, y } = this.placement.posize;
    return xy(x, y);
  }
  setPosition(fn: (prev: Point) => Point) {
    const { x, y } = fn(this.position);
    this.placement.posize.x = x;
    this.placement.posize.y = y;
    this.apply();
  }
  get angle() {
    return this.placement.angle;
  }
  setAngle(fn: (prev: number) => number) {
    const angle = fn(this.placement.angle);
    this.placement.angle = angle;
    this.apply();
  }
  get scale(): Readonly<Point> {
    return this.placement.scale;
  }
  setScale(fn: (prev: Point) => Point) {
    const { x, y } = fn(this.scale);
    this.placement.scale.x = x;
    this.placement.scale.y = y;
    this.apply();
  }
  get origin(): Readonly<Point> {
    return this.placement.origin;
  }
  setOrigin(fn: (prev: Point) => Point) {
    const { x, y } = fn(this.origin);
    this.placement.origin.x = x;
    this.placement.origin.y = y;
    this.apply();
  }
  protected apply() {
    if (this.destroyed) return;
    const { posize, angle, scale, origin } = this.placement;
    this._render.position.set(posize.x | 0, posize.y | 0);
    this._collider.setPosition(posize.x, posize.y);
    this._render.angle = angle;
    this._collider.setAngle(deg2rad(angle));
    this._render.scale.set(scale.x, scale.y);
    this._collider.setScale(scale.x, scale.y);
    this._render.anchor.set(origin.x, origin.y);
    if (this._collider.type === "Ellipse") {
      this._collider.setOffset(
        new SATVector(
          posize.width * scale.x * (1 - 2 * origin.x),
          posize.height * scale.y * (1 - 2 * origin.y)
        )
      );
    } else {
      this._collider.setOffset(
        new SATVector(
          posize.width * scale.x * -origin.x,
          posize.height * scale.y * -origin.y
        )
      );
    }
  }
}
