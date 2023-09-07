import { Container } from "pixi.js";
import { GameManager } from "../managers/GameManager";
import { GameObject } from "./GameObject";

export class Scene {
  name: string;
  stage: Container;
  gameObjects: Map<string, GameObject>;
  constructor(name: string) {
    this.stage = new Container();
    this.name = name;
    this.stage.name = `Scene: ${this.name}`;
    this.gameObjects = new Map();
  }
  protected addGameObject(gameObject: GameObject, customName?: string) {
    const name = customName || gameObject.name;
    this.gameObjects.set(name, gameObject);
    return this.getGameObject(name);
  }
  protected removeGameObject(name: string) {
    this.gameObjects.delete(name);
  }
  protected getGameObject(name: string) {
    const gameObject = this.gameObjects.get(name);
    if (!gameObject)
      throw new Error("指定のゲームオブジェクトが存在しません: " + name);
    return gameObject;
  }
  destoroy() {
    this.stage.removeChildren();
    this.gameObjects.forEach((gameObject) => {
      gameObject.destroy();
    });
    this.gameObjects.clear();
  }
  setup(
    //@ts-ignore
    $: GameManager
  ): GameObject[] {
    return [];
  }
  update(
    //@ts-ignore
    $: GameManager
  ) {}
}
