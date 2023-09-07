import { Application } from "pixi.js";

export class DrawingEngine extends Application {
  constructor() {
    super({ width: 128, height: 96 });
    (globalThis as any).__PIXI_APP__ = this;
    document.body.appendChild(this.view as HTMLCanvasElement);
    this.stage.name = "GameManager: stage";
  }
}
