import { SCALE_MODES, Sprite, Texture } from "pixi.js";
import bitmaps from "../../game/assets/bitmaps.json";

export class BitmapSprite extends Sprite {
  constructor(name: keyof typeof bitmaps, antialias = false) {
    const bitmapData = bitmaps[name];

    const canvas = document.createElement("canvas");
    canvas.width = bitmapData.pixels[0].length;
    canvas.height = bitmapData.pixels.length;
    const ctx = canvas.getContext("2d")!;

    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        ctx.fillStyle = `#${bitmapData.palette[bitmapData.pixels[y][x]]
          .toString(16)
          .padStart(6, "0")}`;
        ctx.fillRect(x, y, 1, 1);
      }
    }

    const texture = Texture.from(canvas);
    texture.baseTexture.scaleMode = antialias
      ? SCALE_MODES.LINEAR
      : SCALE_MODES.NEAREST;

    super(texture);
  }
}
