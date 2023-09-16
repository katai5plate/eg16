import { Point } from "@pixi/core";
import { Entity } from "core/components/Entity";
import { ImageSprite } from "core/components/ImageSprite";
import { Scene } from "core/components/Scene";
import { GameManager } from "core/managers/GameManager";
import { xy } from "core/utils/math";
import { Background } from "game/entities/Background";
import { Wall } from "game/entities/Wall";

const ball = (position: Point) =>
  new Entity({
    name: "ball",
    placement: { position },
    shape: "BOX",
    render: new ImageSprite("ball"),
  });
const paddle = (position: Point) =>
  new Entity({
    name: "paddle",
    placement: { position },
    shape: "BOX",
    render: new ImageSprite("paddle"),
  });

const ballState = {
  x: 40,
  y: 67,
  dx: 1,
  dy: -1,
};

export class Breakout extends Scene {
  walls: Entity[] = [];
  constructor() {
    super("breakout");
  }
  setup($: GameManager) {
    this.walls = [
      this.addEntity(new Wall(0xffffff, 0, 0, $.width, 0)),
      this.addEntity(new Wall(0xffffff, $.width, 0, $.width, 0)),
      this.addEntity(new Wall(0xffffff, 0, 0, $.height, 0)),
      this.addEntity(new Wall(0xffffff, 0, $.height, $.width, $.height)),
    ];
    return [
      this.addEntity(new Background()),
      this.addEntity(ball(xy.from(ballState))),
      this.addEntity(paddle(xy(24, 80))),
      ...this.walls,
    ];
  }
  update($: GameManager) {
    const { ball, paddle } = this.getEntities();
    if ($.input.getAxis("WASD").x === -1)
      paddle.setPosition((p) => xy.add(p, xy(-1, 0)));
    if ($.input.getAxis("WASD").x === 1)
      paddle.setPosition((p) => xy.add(p, xy(1, 0)));
    // ball.setPosition((p) => xy.add(p, xy.pick(ballState, "dx", "dy")));
    // $.hitTest(({ self, target, overlap }) => {
    //   if (self === ball.collider) {
    //     if (this.walls.map((x) => x.collider).includes(target)) {
    //       ballState.dy *= 1;
    //     }
    //   }
    // });
  }
}
