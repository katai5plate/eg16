import { Scene } from "core/components/Scene";
import { GameManager } from "core/managers/GameManager";
import { xywh, testPointInRect } from "core/utils/math";
import { Button } from "core/entities/ui/Button";

export class Menu extends Scene {
  constructor() {
    super("main");
  }
  setup(_$: GameManager) {
    return [
      this.addEntity(new Button(xywh(32, 16, 64, 16), "判定テスト")),
      this.addEntity(new Button(xywh(32, 32, 64, 16), "BREAK OUT!")),
    ];
  }
  update($: GameManager) {
    const { button } = this.getEntities();
    if (testPointInRect($.input.getMousePosition(), button.globalRect)) {
      $.input.isMouseTriggered("LEFT") && $.changeScene("breakout");
    }
  }
}
