import { Application, Point, Sprite, Texture } from "pixi.js";

enum Buttons {
  LEFT = 0,
  CENTER,
  RIGHT,
  WHEEL_UP = 100,
  WHEEL_DOWN,
  WHEEL_LEFT,
  WHEEL_RIGHT,
}

export type MouseButtonNames = keyof typeof Buttons;

export class MouseManager {
  _buttons: Map<MouseButtonNames, number>;
  _wheelDelta: Point;
  _position: Point;
  _prevPosition: Point;
  _deltaPosition: Point;
  constructor(app: Application) {
    this._buttons = new Map();
    this._wheelDelta = new Point();
    this._position = new Point();
    this._prevPosition = new Point();
    this._deltaPosition = new Point();
    document.addEventListener("mousedown", (e) => {
      const buttonName = Buttons[e.button] as MouseButtonNames;
      if (e.button < 3 && !this._buttons.has(buttonName)) {
        this._buttons.set(buttonName, 0);
      }
    });
    document.addEventListener("mouseup", (e) => {
      const buttonName = Buttons[e.button] as MouseButtonNames;
      this._buttons.delete(buttonName);
    });
    document.addEventListener("contextmenu", (e) => e.preventDefault());
    document.addEventListener("wheel", ({ deltaX, deltaY }) => {
      this._wheelDelta.x = deltaX;
      this._wheelDelta.y = deltaY;
      if (deltaY < 0 && !this._buttons.has("WHEEL_UP"))
        this._buttons.set("WHEEL_UP", 0);
      if (deltaY > 0 && !this._buttons.has("WHEEL_DOWN"))
        this._buttons.set("WHEEL_DOWN", 0);
      if (deltaX < 0 && !this._buttons.has("WHEEL_LEFT"))
        this._buttons.set("WHEEL_LEFT", 0);
      if (deltaX > 0 && !this._buttons.has("WHEEL_RIGHT"))
        this._buttons.set("WHEEL_RIGHT", 0);
    });
    const touchScreen = new Sprite(Texture.WHITE);
    touchScreen.name = "MouseManager: touchScreen";
    touchScreen.width = app.screen.width;
    touchScreen.height = app.screen.height;
    touchScreen.alpha = 0;
    touchScreen.eventMode = "static";
    touchScreen.on("pointermove", (e) => {
      this._prevPosition.set(this._position.x, this._position.y);
      this._position.set(e.global.x, e.global.y);
      this._deltaPosition.set(
        this._position.x - this._prevPosition.x,
        this._position.y - this._prevPosition.y
      );
    });
    app.stage.addChild(touchScreen);
  }
  _update() {
    this._buttons.forEach((v, k) => {
      if (this._buttons.has(k)) this._buttons.set(k, v + 1);
      const KEEP_WHEEL_FRAMES = 5;
      if (
        (this._buttons.get("WHEEL_UP") ?? 0) >= KEEP_WHEEL_FRAMES ||
        (this._buttons.get("WHEEL_DOWN") ?? 0) >= KEEP_WHEEL_FRAMES ||
        (this._buttons.get("WHEEL_LEFT") ?? 0) >= KEEP_WHEEL_FRAMES ||
        (this._buttons.get("WHEEL_RIGHT") ?? 0) >= KEEP_WHEEL_FRAMES
      ) {
        this._buttons.delete("WHEEL_UP");
        this._buttons.delete("WHEEL_DOWN");
        this._buttons.delete("WHEEL_LEFT");
        this._buttons.delete("WHEEL_RIGHT");
        this._wheelDelta.set(0, 0);
      }
      this._deltaPosition.set(
        this._position.x - this._prevPosition.x,
        this._position.y - this._prevPosition.y
      );
    });
  }
}
