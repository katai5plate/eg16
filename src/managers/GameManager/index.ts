import { Body, System } from "detect-collisions";
import { Application, Point } from "pixi.js";
import { InputManager } from "../InputManager";
import { GameObject } from "../../components/GameObject";

export class GameManager {
  private drawingEngine: Application;
  private physicsEngine: System;

  input: InputManager;

  private mainLoop?: () => void;

  constructor() {
    this.drawingEngine = new Application({ width: 128, height: 96 });
    (globalThis as any).__PIXI_APP__ = this.drawingEngine;
    document.body.appendChild(this.drawingEngine.view as HTMLCanvasElement);
    this.drawingEngine.stage.name = "GameManager: stage";

    this.physicsEngine = new System();

    this.input = new InputManager(this.drawingEngine);
  }
  /**
   * メインループを開始する
   * @param fn
   */
  startMainLoop(fn: () => void) {
    if (!!this.mainLoop) throw new Error("main loop is defined");
    this.mainLoop = fn;
    this.drawingEngine.ticker.add(() => {
      this.input._update();
      this.mainLoop?.();
    });
  }
  /**
   * 画面上のゲームオブジェクトの当たり判定をテストする
   * @param fn
   */
  hitTest(fn: (a: Body, b: Body, overlap: Point) => void) {
    this.physicsEngine.checkAll(({ a, b, overlapV }) => {
      fn(a, b, new Point(overlapV.x, overlapV.y));
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
}
