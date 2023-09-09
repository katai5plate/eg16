import { Application, BaseTexture, SCALE_MODES } from "PIXI";

export class DrawingEngine extends Application {
  constructor() {
    super({ width: 128, height: 96 });
    (globalThis as any).__PIXI_APP__ = this;
    this.stage.name = "GameManager: stage";
    BaseTexture.defaultOptions.scaleMode = SCALE_MODES.NEAREST;

    document.body.appendChild(this.view as HTMLCanvasElement);
  }
}
