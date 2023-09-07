import { Graphics } from "pixi.js";
import { Entity } from "../../core/components/Entity";
import { xy } from "../../core/utils/math";

export class Wall extends Entity {
  constructor(color: number, x: number, y: number, w: number, h: number) {
    super({
      name: "wall",
      placement: {
        position: xy(x, y),
        size: xy(w, h),
      },
      shape: "BOX",
      render: ((_) => {
        _.beginFill(color);
        _.drawRect(0, 0, w, h);
        _.endFill();
        _.position.set(x, y);
        return _;
      })(new Graphics()),
    });
  }
}
