import { Body, Box, Ellipse, SATVector, deg2rad } from "detect-collisions";
import { Container, Point } from "pixi.js";
import { Placement, PlacementProps } from "./Placement";
import { xy } from "../utils/math";

interface EntityProps {
  name: string;
  placement: PlacementProps;
  // Polygon は動作が不安定なので使用を制限する
  shape: "BOX" | "CIRCLE";
  render: Container;
}

export class Entity {
  readonly name: string;
  private placement: Placement;

  readonly collider: Body;
  readonly render: Container;

  private destroyed: boolean = false;

  constructor({ name, placement, shape, render }: EntityProps) {
    this.name = name;

    this.placement = new Placement(placement);
    this.render = render;
    this.render.name = name;
    if (shape === "BOX")
      this.collider = new Box(
        placement.position,
        placement.size.x,
        placement.size.y
      );
    else if (shape === "CIRCLE")
      this.collider = new Ellipse(
        placement.position,
        placement.size.x,
        placement.size.y
      );
    else throw new Error("無効な形状タイプ");
    this.apply();
  }
  destroy() {
    this.render.destroy();
    this.collider.system?.remove(this.collider);
    this.destroyed = true;
  }
  get position() {
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
  get scale() {
    return this.placement.scale;
  }
  setScale(fn: (prev: Point) => Point) {
    const { x, y } = fn(this.scale);
    this.placement.scale.x = x;
    this.placement.scale.y = y;
    this.apply();
  }
  get origin() {
    return this.placement.origin;
  }
  setOrigin(fn: (prev: Point) => Point) {
    const { x, y } = fn(this.origin);
    this.placement.origin.x = x;
    this.placement.origin.y = y;
    this.apply();
  }
  apply() {
    if (this.destroyed) return;
    const { posize, angle, scale, origin } = this.placement;
    this.render.position.set(posize.x, posize.y);
    this.collider.setPosition(posize.x, posize.y);
    this.render.angle = angle;
    this.collider.setAngle(deg2rad(angle));
    this.render.scale.set(scale.x, scale.y);
    this.collider.setScale(scale.x, scale.y);
    this.render.pivot.set(posize.width * origin.x, posize.height * origin.y);
    this.collider.setOffset(
      new SATVector(posize.width * -origin.x, posize.height * -origin.y)
    );
  }
}
