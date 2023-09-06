import "./style.css";
import { Graphics, Point, Sprite, Texture } from "pixi.js";
import { GameManager } from "./managers/GameManager";
import { GameObject } from "./components/GameObject";

class Wall extends GameObject {
  constructor(color: number, x: number, y: number, w: number, h: number) {
    super({
      name: "wall",
      placement: {
        position: new Point(x, y),
        size: new Point(w, h),
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
        position: new Point(x, y),
        size: new Point(r, r),
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

class Player extends GameObject {
  constructor() {
    super({
      name: "player",
      placement: {
        position: new Point(40, 67),
        size: new Point(16, 16),
        pivot: new Point(0.5, 0.5),
      },
      shape: "BOX",
      render: new Sprite(Texture.WHITE),
    });
  }
}

const $ = new GameManager();

const player = new Player();

[
  player,
  new Wall(0xffaa00, 0, 0, $.width, 0),
  new Wall(0xffaa00, 0, $.height, $.width, 0),
  new Wall(0xffaa00, 0, 0, 16, 96),
  new Wall(0xffaa00, 112, 0, 16, 96),
  new Sphere(0xffaa00, 40, 24, 8),
  new Sphere(0xffaa00, 88, 72, 8),
  new Sphere(0xffaa00, 80, 32, 8),
  new Sphere(0xffaa00, 77, 40, 24),
].forEach((gameObject) => $.spawn(gameObject));

$.startMainLoop(() => {
  player.setPosition(
    ({ x, y }) =>
      new Point(x + $.input.getAxis("WASD").x, y + $.input.getAxis("WASD").y)
  );
  player.setAngle(() => Date.now() / 10);
  $.hitTest((col, _, overlap) => {
    if (col === player.collider) {
      player.setPosition(({ x, y }) => new Point(x - overlap.x, y - overlap.y));
    }
  });
});
