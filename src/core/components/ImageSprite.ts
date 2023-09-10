import { SCALE_MODES, Sprite, Texture } from "PIXI";
import { decompressFromBase64 } from "lz-string";
import { BASE92_TABLE } from "core/constants.json";
import { DecompressedBitmap, ImagesJSON } from "core/utils/type";
import images from "game/assets/images.json";

const IMAGES_JSON = images as ImagesJSON<typeof images>;

const parseBase92 = (str: string) => {
  const base = BASE92_TABLE.length;
  return [...str].reverse().reduce((acc, char, i) => {
    const index = BASE92_TABLE.indexOf(char);
    if (index === -1) {
      throw new Error(`パースエラー: ${char}`);
    }
    return acc + index * Math.pow(base, i);
  }, 0);
};

export class ImageSprite extends Sprite {
  constructor(
    name: keyof typeof IMAGES_JSON,
    {
      antialias = false,
    }: Partial<{
      antialias: boolean;
    }> = {}
  ) {
    const image = IMAGES_JSON[name];

    let texture: ReturnType<typeof Texture.from>;
    if (image.format === "bmp") {
      const canvas = document.createElement("canvas");
      const bitmap = JSON.parse(
        decompressFromBase64(image.data)
      ) as DecompressedBitmap;
      const [palette, pixels] = [
        bitmap.palette.split(",").map(parseBase92) as number[],
        bitmap.pixels
          .split(",")
          .map((row) => [...row].map((col) => parseInt(col, 16))) as number[][],
      ];
      canvas.width = pixels[0].length;
      canvas.height = pixels.length;
      const ctx = canvas.getContext("2d")!;
      for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
          const index = pixels[y][x];
          if (index !== 0) {
            ctx.fillStyle = `#${palette[index].toString(16).padStart(6, "0")}`;
            ctx.fillRect(x, y, 1, 1);
          }
        }
      }
      texture = Texture.from(canvas);
    } else {
      if (image.format !== "png")
        throw new Error(
          "対応していないフォーマットです: " + `${name} (${image.format})`
        );
      texture = Texture.from(`data:image/png;base64,${image.data}`);
    }

    texture.baseTexture.scaleMode = antialias
      ? SCALE_MODES.LINEAR
      : SCALE_MODES.NEAREST;

    super(texture);
  }
}
