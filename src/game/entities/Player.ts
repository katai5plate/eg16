import { Sprite, Texture } from "pixi.js";
import { Entity } from "../../core/components/Entity";
import { xy } from "../../core/utils/math";

export class Player extends Entity {
  constructor(x: number, y: number) {
    super({
      name: "player",
      placement: {
        position: xy(x, y),
        size: xy(16, 16),
        pivot: xy(0.5, 0.5),
      },
      shape: "BOX",
      render: new Sprite(Texture.WHITE),
    });
  }
}
