import { Container } from "pixi.js";
import { GameManager } from "../managers/GameManager";
import { Entity } from "./Entity";

export class Scene {
  name: string;
  stage: Container;
  entities: Map<string, Entity>;
  constructor(name: string) {
    this.stage = new Container();
    this.name = name;
    this.stage.name = `Scene: ${this.name}`;
    this.entities = new Map();
  }
  protected addEntity(entity: Entity, customName?: string) {
    const name = customName || entity.name;
    this.entities.set(name, entity);
    return this.getEntity(name);
  }
  protected removeEntity(name: string) {
    this.entities.delete(name);
  }
  protected getEntity(name: string) {
    const entity = this.entities.get(name);
    if (!entity) throw new Error("指定の Entity が存在しません: " + name);
    return entity;
  }
  destoroy() {
    this.stage.removeChildren();
    this.entities.forEach((entity) => {
      entity.destroy();
    });
    this.entities.clear();
  }
  setup(
    //@ts-ignore
    $: GameManager
  ): Entity[] {
    return [];
  }
  update(
    //@ts-ignore
    $: GameManager
  ) {}
}
