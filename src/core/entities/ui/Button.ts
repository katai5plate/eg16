import { Rectangle } from "pixi.js";
import { Entity } from "core/components/Entity";
import { PaintSprite } from "core/components/PaintSprite";
import { xy, xywh } from "core/utils/math";
import { fillIn, fillRoundedRect, textIn } from "core/utils/canvas";

export class Button extends Entity {
  constructor(
    rect: Rectangle,
    text: string,
    {
      backgroundColor = 0xffffff,
      textColor = 0x000000,
      borderRadius = 8,
      textScale = 1,
      padding = 1,
    }: {
      backgroundColor?: number;
      textColor?: number;
      borderRadius?: number;
      textScale?: number;
      padding?: number;
    } = {}
  ) {
    const render = new PaintSprite(xy(rect.width, rect.height), (ctx) => {
      fillRoundedRect(
        ctx,
        backgroundColor,
        xywh(
          padding,
          padding,
          rect.width - padding * 2,
          rect.height - padding * 2
        ),
        borderRadius
      );
      fillIn(ctx, textColor, () => {
        textIn(ctx, 8 * textScale, "center", "middle", () => {
          ctx.fillText(text, rect.width / 2, rect.height / 2);
        });
      });
    });
    super({
      name: "button",
      placement: {
        position: xy(rect.x, rect.y),
        size: xy(rect.width, rect.height),
      },
      shape: "BOX",
      render,
    });
  }
}
