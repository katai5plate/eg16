import { System } from "detect-collisions";
import { DrawingEngine } from "./DrawingEngine";

const DEBUG_FINENESS = 10;

export class PhysicsEngine extends System {
  protected physicsDebugCanvas?: HTMLCanvasElement;
  protected physicsDebugContext?: CanvasRenderingContext2D;

  constructor(
    drawingEngine: DrawingEngine,
    options?: { physicsDebug: boolean }
  ) {
    super();

    if (options?.physicsDebug) {
      this.physicsDebugCanvas = document.createElement("canvas");
      this.physicsDebugCanvas.width =
        drawingEngine.screen.width * DEBUG_FINENESS;
      this.physicsDebugCanvas.height =
        drawingEngine.screen.height * DEBUG_FINENESS;
      this.physicsDebugContext = this.physicsDebugCanvas.getContext("2d")!;
      document.body.appendChild(this.physicsDebugCanvas);
    }
  }
  updateDebug() {
    if (this.physicsDebugCanvas) {
      const [{ width, height }, ctx] = [
        this.physicsDebugCanvas!,
        this.physicsDebugContext!,
      ];
      ctx.save();
      ctx.scale(DEBUG_FINENESS, DEBUG_FINENESS);
      ctx.clearRect(0, 0, width, height);
      ctx.lineWidth = 1 / DEBUG_FINENESS;

      // Body
      ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
      ctx.beginPath();
      this.draw(ctx);
      ctx.stroke();

      // BVH
      ctx.strokeStyle = "rgba(0, 255, 0, 0.5)";
      ctx.beginPath();
      this.drawBVH(ctx);
      ctx.stroke();

      ctx.restore();
    }
  }
}
