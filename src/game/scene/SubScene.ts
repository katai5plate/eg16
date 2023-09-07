import { Scene } from "../../core/components/Scene";
import { GameManager } from "../../core/managers/GameManager";
import { Wall } from "../entities/Wall";
import { Sphere } from "../entities/Sphere";
import { xy } from "../../core/utils/math";
import { Player } from "../entities/Player";

export class SubScene extends Scene {
  constructor() {
    super("sub");
  }
  setup($: GameManager) {
    return [
      this.addEntity(new Player(40, 67)),
      this.addEntity(new Wall(0xffaa00, 0, 0, $.width, 0), "topWall"),
      new Wall(0xfeeaaf, 0, $.height, $.width, 0),
      new Wall(0xeeaaff, 0, 0, 16, 96),
      new Wall(0xeaaffe, 112, 0, 16, 96),
      new Sphere(0xaffeea, 88, 72, 8),
      new Sphere(0xffaa00, 80, 32, 8),
    ];
  }
  update($: GameManager) {
    const player = this.getEntity("player");
    const topWall = this.getEntity("topWall");
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
