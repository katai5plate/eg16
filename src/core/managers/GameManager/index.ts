import { Body } from "detect-collisions";
import { Point, Sprite } from "PIXI";
import { InputManager } from "core/managers/InputManager";
import { Entity } from "core/components/Entity";
import { xy } from "core/utils/math";
import { Scene } from "core/components/Scene";
import { DrawingEngine } from "./DrawingEngine";
import { PhysicsEngine } from "./PhysicsEngine";

export class GameManager {
  protected drawingEngine: DrawingEngine;
  protected physicsEngine: PhysicsEngine;

  protected frameCount: number = 0;
  protected deltaTime: number = 0;

  protected currentScene: Scene;
  protected sceneDict: Map<string, Scene>;

  protected _input: InputManager;

  constructor(scenes: Scene[]) {
    this.drawingEngine = new DrawingEngine();

    this.physicsEngine = new PhysicsEngine(this.drawingEngine, {
      physicsDebug: true,
    });

    this._input = new InputManager(
      xy(this.width, this.height),
      this.drawingEngine.stage
    );

    if (scenes.length === 0)
      throw new Error("シーンは必ず１つ以上登録してください");
    this.sceneDict = new Map();
    scenes.forEach((scene) => {
      this.sceneDict.set(scene.name, scene);
    });
    this.currentScene = scenes[0];
    this.connectScene();

    this.drawingEngine.ticker.add((delta) => this.update(delta));
  }
  update(delta: number) {
    this.deltaTime = delta;
    this.frameCount++;
    this._input._update();
    this.physicsEngine.updateDebug();
    this.currentScene.update(this);
  }
  changeScene(name: string) {
    const scene = this.sceneDict.get(name);
    if (!scene) throw new Error("無効なシーン名です: " + name);
    this.clearScene();
    this.currentScene = scene;
    this.connectScene();
  }
  private clearScene() {
    this.currentScene.destoroy();
    this.currentScene.stage.removeChild(this.currentScene.stage);
    this.physicsEngine.clear();
  }
  private connectScene() {
    this.drawingEngine.stage.addChild(this.currentScene.stage);
    this.currentScene.setup(this).forEach((entity) => {
      this.spawn(entity);
    });
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
    this.physicsEngine.insert(entity.collider as Body);
    this.currentScene.stage.addChild(entity.render as Sprite);
  }
  get input(): Readonly<typeof this._input> {
    return this._input;
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
