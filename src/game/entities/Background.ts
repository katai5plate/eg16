import { ImageSprite } from "core/components/ImageSprite";
import { Entity } from "core/components/Entity";
import { xy } from "core/utils/math";

export class Background extends Entity {
  constructor() {
    super({
      name: "background",
      placement: {
        position: xy(0, 0),
      },
      shape: "NONE",
      render: new ImageSprite("fujisan", { antialias: true }),
    });
  }
}
