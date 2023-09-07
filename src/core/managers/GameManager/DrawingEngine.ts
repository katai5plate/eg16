import { Application, BaseTexture, SCALE_MODES } from "pixi.js";
import fonts from "root/fonts.json";

export class DrawingEngine extends Application {
  constructor() {
    super({ width: 128, height: 96 });
    (globalThis as any).__PIXI_APP__ = this;
    this.stage.name = "GameManager: stage";
    BaseTexture.defaultOptions.scaleMode = SCALE_MODES.NEAREST;

    const style = document.createElement("style");
    style.innerHTML = Object.entries(fonts).reduce(
      (p, [k, v]) =>
        `${p}\n@font-face { font-family: "${k}"; src: url("./fonts/${v.file}") format("${v.format}"); }`,
      ""
    );
    document.head.appendChild(style);

    document.body.appendChild(this.view as HTMLCanvasElement);
  }
}
