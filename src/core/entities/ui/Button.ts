import { Rectangle } from "pixi.js";
import { Entity } from "core/components/Entity";
import { PaintSprite } from "core/components/PaintSprite";
import { calcCenterPosition, xy, xywh } from "core/utils/math";
import { fillRoundedRect } from "core/utils/canvas";
import { TextCanvas } from "core/canvases/TextCanvas";

export class Button extends Entity {
  constructor(
    rect: Rectangle,
    text: string,
    {
      backgroundColor = 0xffffff,
      textColor = 0x000000,
      borderRadius = 8,
      padding = 1,
    }: {
      backgroundColor?: number;
      textColor?: number;
      borderRadius?: number;
      padding?: number;
    } = {}
  ) {
    const textCanvas = new TextCanvas(text, textColor);
    const tcpos = calcCenterPosition(textCanvas.size, xywh.wh(rect));
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
      ctx.drawImage(textCanvas.canvas, tcpos.x, tcpos.y);
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
