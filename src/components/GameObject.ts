import {
  Body,
  Box,
  Ellipse,
  Polygon,
  SATVector,
  deg2rad,
} from "detect-collisions";
import { Container, Point } from "pixi.js";
import { Placement, PlacementProps } from "./Placement";
import { xy } from "../utils/math";

interface GameObjectProps {
  name?: string;
  placement: PlacementProps;
  shape: "BOX" | "CIRCLE" | Point[];
  render: Container;
}

export class GameObject {
  private placement: Placement;

  readonly collider: Body;
  readonly render: Container;

  constructor({ name, placement, shape, render }: GameObjectProps) {
    this.placement = new Placement(placement);
    this.render = render;
    name && (this.render.name = name);
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
    else this.collider = new Polygon(placement.position, shape);
    this.apply();
  }
  destroy() {
    this.render.destroy();
    this.collider.system?.remove(this.collider);
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
