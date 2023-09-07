import { Scene } from "../../core/components/Scene";
import { GameManager } from "../../core/managers/GameManager";
import { xy } from "../../core/utils/math";
import { Wall } from "../entities/Wall";
import { Sphere } from "../entities/Sphere";
import { Player } from "../entities/Player";

export class CollisionTest extends Scene {
  constructor() {
    super("main");
  }
  setup($: GameManager) {
    return [
      this.addEntity(new Player(40, 67)),
      this.addEntity(new Wall(0xffaa00, 0, 0, $.width, 0), "topWall"),
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
    const player = this.getEntity("player");
    const topWall = this.getEntity("topWall");
    player.setPosition((position) => xy.add(position, $.input.getAxis("WASD")));
    player.setAngle(() => $.now);
    $.hitTest(({ self, target, overlap }) => {
      if (self === player.collider) {
        if (target === topWall.collider) {
          // $.changeScene("sub");
          console.log("HIT!");
        }
        player.setPosition((position) => xy.sub(position, overlap));
      }
    });
  }
}
