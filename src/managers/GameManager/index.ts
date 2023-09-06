import { Body, System } from "detect-collisions";
import { Application, Point } from "pixi.js";
import { InputManager } from "../InputManager";
import { GameObject } from "../../components/GameObject";
import { xy } from "../../utils/math";

const PHYSICS_DEBUG_CANVAS_SCALE = 10;

export class GameManager {
  private drawingEngine: Application;
  private physicsEngine: System;

  input: InputManager;

  private mainLoop?: () => void;

  isPhysicsDebug: boolean;
  physicsDebugCanvas?: HTMLCanvasElement;
  physicsDebugContext?: CanvasRenderingContext2D;

  private frameCount: number;
  private deltaTime: number;

  constructor(options?: { physicsDebug: true }) {
    this.drawingEngine = new Application({ width: 128, height: 96 });
    (globalThis as any).__PIXI_APP__ = this.drawingEngine;
    document.body.appendChild(this.drawingEngine.view as HTMLCanvasElement);
    this.drawingEngine.stage.name = "GameManager: stage";

    this.physicsEngine = new System();

    this.input = new InputManager(this.drawingEngine);

    this.isPhysicsDebug = !!options?.physicsDebug;
    if (this.isPhysicsDebug) {
      this.physicsDebugCanvas = document.createElement("canvas");
      this.physicsDebugCanvas.width =
        this.drawingEngine.screen.width * PHYSICS_DEBUG_CANVAS_SCALE;
      this.physicsDebugCanvas.height =
        this.drawingEngine.screen.height * PHYSICS_DEBUG_CANVAS_SCALE;
      this.physicsDebugContext = this.physicsDebugCanvas.getContext("2d")!;
      document.body.appendChild(this.physicsDebugCanvas);
    }

    this.frameCount = 0;
    this.deltaTime = 0;
  }
  /**
   * メインループを開始する
   * @param fn
   */
  startMainLoop(fn: () => void) {
    if (!!this.mainLoop) throw new Error("main loop is defined");
    this.mainLoop = fn;
    this.drawingEngine.ticker.add((delta) => {
      this.deltaTime = delta;
      this.frameCount++;
      this.input._update();
      this.updatePhysicsDebug();
      this.mainLoop?.();
    });
  }
  private updatePhysicsDebug() {
    if (this.isPhysicsDebug) {
      const [{ width, height }, ctx] = [
        this.physicsDebugCanvas!,
        this.physicsDebugContext!,
      ];
      ctx.save();
      ctx.scale(PHYSICS_DEBUG_CANVAS_SCALE, PHYSICS_DEBUG_CANVAS_SCALE);
      ctx.clearRect(0, 0, width, height);
      ctx.lineWidth = 1 / PHYSICS_DEBUG_CANVAS_SCALE;

      // Body
      ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
      ctx.beginPath();
      this.physicsEngine.draw(ctx);
      ctx.stroke();

      // BVH
      ctx.strokeStyle = "rgba(0, 255, 0, 0.5)";
      ctx.beginPath();
      this.physicsEngine.drawBVH(ctx);
      ctx.stroke();

      ctx.restore();
    }
  }
  /**
   * 画面上のゲームオブジェクトの当たり判定をテストする
   * @param fn
   */
  hitTest(fn: (a: Body, b: Body, overlap: Point) => void) {
    this.physicsEngine.checkAll(({ a, b, overlapV }) => {
      fn(a, b, xy(overlapV.x, overlapV.y));
    });
  }
  /**
   * 画面上にゲームオブジェクトをスポーンする
   * @param gameObject
   */
  spawn(gameObject: GameObject) {
    this.physicsEngine.insert(gameObject.collider);
    this.drawingEngine.stage.addChild(gameObject.render);
  }
  get width() {
    return this.drawingEngine.screen.width;
  }
  get height() {
    return this.drawingEngine.screen.height;
  }
  get now() {
    return this.frameCount;
  }
  get delta() {
    return this.deltaTime;
  }
  get fps() {
    return this.drawingEngine.ticker.FPS;
  }
}
