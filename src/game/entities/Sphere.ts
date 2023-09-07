import { Entity } from "core/components/Entity";
import { xy } from "core/utils/math";
import { PaintSprite } from "core/components/PaintSprite";
import { fillIn } from "core/utils/canvas";

export class Sphere extends Entity {
  constructor(color: number, x: number, y: number, r: number) {
    super({
      name: "sphere",
      placement: {
        position: xy(x, y),
        size: xy(r, r),
        origin: xy(0.5, 0.5),
      },
      shape: "CIRCLE",
      render: new PaintSprite(xy(r * 2, r * 2), (ctx) => {
        fillIn(
          ctx,
          color,
          () => {
            ctx.beginPath();
            ctx.ellipse(r, r, r, r, 0, 0, 2 * Math.PI);
          },
          true
        );
      }),
    });
  }
}
