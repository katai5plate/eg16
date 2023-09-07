import { Entity } from "core/components/Entity";
import { xy } from "core/utils/math";
import { PaintSprite } from "core/components/PaintSprite";
import { fillIn } from "core/utils/canvas";

export class Wall extends Entity {
  constructor(color: number, x: number, y: number, w: number, h: number) {
    super({
      name: "wall",
      placement: {
        position: xy(x, y),
        size: xy(w, h),
      },
      shape: "BOX",
      render: new PaintSprite(xy(w, h), (ctx) => {
        fillIn(ctx, color, () => ctx.fillRect(0, 0, w, h));
      }),
    });
  }
}
