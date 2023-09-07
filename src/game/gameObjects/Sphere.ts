import { Graphics } from "pixi.js";
import { GameObject } from "../../core/components/GameObject";
import { xy } from "../../core/utils/math";

export class Sphere extends GameObject {
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
