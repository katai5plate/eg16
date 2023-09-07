import { BitmapSprite } from "../../core/components/BitmapSprite";
import { Entity } from "../../core/components/Entity";
import { xy } from "../../core/utils/math";

export class Ball extends Entity {
  constructor(x: number, y: number) {
    super({
      name: "player",
      placement: {
        position: xy(x, y),
        size: xy(8, 8),
        origin: xy(0.5, 0.5),
        scale: xy(2, 2),
      },
      shape: "BOX",
      render: new BitmapSprite("ball", true),
    });
  }
}
