import { Point, SCALE_MODES, Sprite, Texture } from "pixi.js";

export class PaintSprite extends Sprite {
  constructor(
    size: Point,
    fn: (ctx: CanvasRenderingContext2D) => void,
    antialias = false
  ) {
    const canvas = document.createElement("canvas");
    canvas.width = size.x;
    canvas.height = size.y;
    fn(canvas.getContext("2d")!);

    const texture = Texture.from(canvas);
    texture.baseTexture.scaleMode = antialias
      ? SCALE_MODES.LINEAR
      : SCALE_MODES.NEAREST;

    super(texture);
  }
}
