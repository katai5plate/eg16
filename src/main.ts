import "./style.css";
import { Graphics, Sprite, Texture } from "pixi.js";
import { GameManager } from "./managers/GameManager";
import { GameObject } from "./components/GameObject";
import { xy } from "./utils/math";
import { Scene } from "./components/Scene";

class Wall extends GameObject {
  constructor(color: number, x: number, y: number, w: number, h: number) {
    super({
      name: "wall",
      placement: {
        position: xy(x, y),
        size: xy(w, h),
      },
      shape: "BOX",
      render: ((_) => {
        _.beginFill(color);
        _.drawRect(0, 0, w, h);
        _.endFill();
        _.position.set(x, y);
        return _;
      })(new Graphics()),
    });
  }
}

class Sphere extends GameObject {
  constructor(color: number, x: number, y: number, r: number) {
    super({
      name: "sphere",
      placement: {
        position: xy(x, y),
        size: xy(r, r),
      },
      shape: "CIRCLE",
      render: ((_) => {
        _.beginFill(color);
        _.drawCircle(0, 0, r);
        _.endFill();
        _.position.set(x, y);
        return _;
      })(new Graphics()),
    });
  }
}

class MainScene extends Scene {
  constructor() {
    super("main");
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
      new Wall(0xffaa00, 0, $.height, $.width, 0),
      new Wall(0xffaa00, 0, 0, 16, 96),
      new Wall(0xffaa00, 112, 0, 16, 96),
      new Sphere(0xffaa00, 40, 24, 8),
      new Sphere(0xffaa00, 88, 72, 8),
      new Sphere(0xffaa00, 80, 32, 8),
      new Sphere(0xffaa00, 77, 40, 24),
    ];
  }
  update($: GameManager) {
    const player = this.getGameObject("player");
    const topWall = this.getGameObject("topWall");
    player.setPosition((position) => xy.add(position, $.input.getAxis("WASD")));
    player.setAngle(() => $.now);
    $.hitTest(({ self, target, overlap }) => {
      if (self === player.collider) {
        if (target === topWall.collider) {
          $.changeScene("sub");
        }
        player.setPosition((position) => xy.sub(position, overlap));
      }
    });
  }
}

class SubScene extends Scene {
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

(globalThis as any).__DEBUG__ = new GameManager(
  [new MainScene(), new SubScene()],
  {
    physicsDebug: true,
  }
);
