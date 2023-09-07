import { Body, System } from "detect-collisions";
import { Application, Point } from "pixi.js";
import { InputManager } from "../InputManager";
import { Entity } from "../../components/Entity";
import { xy } from "../../utils/math";
import { Scene } from "../../components/Scene";

const PHYSICS_DEBUG_CANVAS_SCALE = 10;

export class GameManager {
  private drawingEngine: Application;
  private physicsEngine: System;

  private isPhysicsDebug: boolean;
  private physicsDebugCanvas?: HTMLCanvasElement;
  private physicsDebugContext?: CanvasRenderingContext2D;

  private frameCount: number = 0;
  private deltaTime: number = 0;

  input: InputManager;

  scene: Scene;
  scenes: Map<string, Scene>;

  constructor(scenes: Scene[], options?: { physicsDebug: true }) {
    this.drawingEngine = new Application({ width: 128, height: 96 });
    (globalThis as any).__PIXI_APP__ = this.drawingEngine;
    document.body.appendChild(this.drawingEngine.view as HTMLCanvasElement);
    this.drawingEngine.stage.name = "GameManager: stage";

    this.physicsEngine = new System();

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

    this.input = new InputManager(this.drawingEngine);

    if (scenes.length === 0)
      throw new Error("シーンは必ず１つ以上登録してください");
    this.scenes = new Map();
    scenes.forEach((scene) => {
      this.scenes.set(scene.name, scene);
    });
    this.scene = scenes[0];
    this.connectScene();

    this.drawingEngine.ticker.add((delta) => this.update(delta));
  }
  update(delta: number) {
    this.deltaTime = delta;
    this.frameCount++;
    this.input._update();
    this.updatePhysicsDebug();
    this.scene.update(this);
  }
  changeScene(name: string) {
    const scene = this.scenes.get(name);
    if (!scene) throw new Error("無効なシーン名です: " + name);
    this.clearScene();
    this.scene = scene;
    this.connectScene();
  }
  private clearScene() {
    this.scene.destoroy();
    this.scene.stage.removeChild(this.scene.stage);
    this.physicsEngine.clear();
  }
  private connectScene() {
    this.drawingEngine.stage.addChild(this.scene.stage);
    this.scene.setup(this).forEach((entity) => {
      this.spawn(entity);
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
   * 画面上の Entity の当たり判定をテストする
   * @param fn
   */
  hitTest(fn: (arg: { self: Body; target: Body; overlap: Point }) => void) {
    this.physicsEngine.checkAll(({ a, b, overlapV }) => {
      fn({ self: a, target: b, overlap: xy(overlapV.x, overlapV.y) });
    });
  }
  /**
   * 画面上に Entity をスポーンする
   * @param entity
   */
  spawn(entity: Entity) {
    this.physicsEngine.insert(entity.collider);
    this.scene.stage.addChild(entity.render);
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
