import { Sprite, Texture } from "pixi.js";
import { GameObject } from "../core/components/GameObject";
import { Scene } from "../core/components/Scene";
import { GameManager } from "../core/managers/GameManager";
import { Wall } from "./Wall";
import { Sphere } from "./Sphere";
import { xy } from "../core/utils/math";

export class SubScene extends Scene {
  constructor() {
    super("sub");
  }
  setup($: GameManager) {
    this.addGameObject(
      new GameObject({
        name: "player",
        placement: {
          position: xy(40, 67),
          size: xy(16, 16),
          pivot: xy(0.5, 0.5),
        },
        shape: "BOX",
        render: new Sprite(Texture.WHITE),
      })
    );
    this.addGameObject(new Wall(0xffaa00, 0, 0, $.width, 0), "topWall");
    return [
      this.getGameObject("player"),
      this.getGameObject("topWall"),
      new Wall(0xfeeaaf, 0, $.height, $.width, 0),
      new Wall(0xeeaaff, 0, 0, 16, 96),
      new Wall(0xeaaffe, 112, 0, 16, 96),
      // new Sphere(0xaaffee, 40, 24, 8),
      new Sphere(0xaffeea, 88, 72, 8),
      new Sphere(0xffaa00, 80, 32, 8),
    ];
  }
  update($: GameManager) {
    const player = this.getGameObject("player");
    const topWall = this.getGameObject("topWall");
    player.setPosition((position) =>
      xy.add(position, $.input.getAxis("ARROW"))
    );
    player.setAngle(() => -$.now);
    $.hitTest(({ self, target, overlap }) => {
      if (self === player.collider) {
        if (target === topWall.collider) {
          $.changeScene("main");
        }
        player.setPosition((position) => xy.sub(position, overlap));
      }
    });
  }
}
