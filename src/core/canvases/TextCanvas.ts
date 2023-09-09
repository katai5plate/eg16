import MAIN_FONT_DATA from "core/assets/font.main.json";
import { xy } from "core/utils/math";
import { Point } from "PIXI";

const toPerfectTable = (table: Record<string, string>) => ({
  ...table,
  " ": "-0",
  "　": "+0",
});

export class TextCanvas {
  protected binarySize: number;
  protected fontSize: number;

  protected _canvas: HTMLCanvasElement;

  constructor(text: string, color: number, fontData = MAIN_FONT_DATA) {
    this._canvas = document.createElement("canvas");
    const table = toPerfectTable(fontData.table);
    this.fontSize = fontData.scale * 8;
    this.binarySize = Number(`0b${"1".repeat(this.fontSize)}`).toString(
      16
    ).length;
    const textTable = [...text].map((char) =>
      this.unzip(table[char as keyof typeof table])
    );
    const textSize = textTable.reduce(
      (p, c) => p + (c?.isHalf ? 0.5 : 1) * this.fontSize,
      0
    );

    this._canvas.width = textSize;
    this._canvas.height = this.fontSize;
    const ctx = this._canvas.getContext("2d")!;

    let currentX = 0;
    for (let i = 0; i < textTable.length; i++) {
      const { isHalf, content } = textTable[i];
      const currentSize = isHalf ? this.fontSize / 2 : this.fontSize;
      for (let y = 0; y < this.fontSize; y++) {
        for (let x = 0; x < currentSize; x++) {
          if (!content) {
            ctx.fillStyle = `#${((Math.random() * 0xffffff) | 0)
              .toString(16)
              .padStart(6, "0")}`;
            ctx.fillRect(currentX + x, y, 1, 1);
          } else {
            ctx.fillStyle = `#${color.toString(16).padStart(6, "0")}`;
            if (content[y][x] === 1) {
              ctx.fillRect(currentX + x, y, 1, 1);
            }
          }
        }
      }
      currentX += currentSize;
    }
  }
  get canvas(): Readonly<HTMLCanvasElement> {
    return this._canvas;
  }
  get size(): Readonly<Point> {
    return xy(this._canvas.width, this._canvas.height);
  }
  protected unzip(zip: string) {
    try {
      const isHalf = zip.slice(0, 1) === "-";
      const crypt = zip.slice(1);
      const zeros = "0".repeat(
        this.fontSize * (isHalf ? this.binarySize / 2 : this.binarySize) -
          crypt.length
      );
      const value = zeros + crypt;
      const binaryRows = value
        .match(new RegExp(`\.{${value.length / this.fontSize}}`, "g"))!
        .map((row) =>
          Number(`0x${row}`)
            .toString(2)
            .padStart(isHalf ? this.fontSize / 2 : this.fontSize, "0")
        );
      const content = binaryRows.map((row) => [...row].map(Number));
      return { isHalf, content };
    } catch {
      return { isHalf: false, content: null };
    }
  }
}
