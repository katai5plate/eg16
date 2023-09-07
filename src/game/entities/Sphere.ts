import { Graphics } from "pixi.js";
import { Entity } from "../../core/components/Entity";
import { xy } from "../../core/utils/math";

export class Sphere extends Entity {
  constructor(color: number, x: number, y: number, r: number) {
    super({
      name: "sphere",
      placement: {
        position: xy(x, y),
        size: xy(r, r),
      },
      shape: "CIRCLE",
      render: ((_) => {
        _.beginFill(color);
        _.drawCircle(0, 0, r);
        _.endFill();
        _.position.set(x, y);
        return _;
      })(new Graphics()),
    });
  }
}
