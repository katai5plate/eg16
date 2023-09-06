import { Application, Point } from "pixi.js";
import { KeyboardManager, KeyCodeNames } from "./keyboard";
import {
  GamepadManager,
  PadButtonNames,
  getVelocityWithinRange,
} from "./gamepad";
import { MouseButtonNames, MouseManager } from "./mouse";

export class InputManager {
  private keyboard: KeyboardManager;
  private gamepad: GamepadManager;
  private mouse: MouseManager;

  constructor(pixiApp: Application) {
    this.keyboard = new KeyboardManager();
    this.gamepad = new GamepadManager();
    this.mouse = new MouseManager(pixiApp);
  }
  _update() {
    this.keyboard._update();
    this.gamepad._update();
    this.mouse._update();
  }
  isKeyTriggered(key: KeyCodeNames) {
    return (this.keyboard._buttons.get(key) ?? NaN) === 1;
  }
  isKeyPressed(key: KeyCodeNames, frames = 1) {
    return (this.keyboard._buttons.get(key) ?? NaN) > frames;
  }
  isKeyReleased(key: KeyCodeNames) {
    return !this.keyboard._buttons.has(key);
  }
  isPadTriggered(player: number, button: PadButtonNames) {
    const pad = this.gamepad._buttons.get(player);
    return (pad?.get(button) ?? NaN) === 1;
  }
  isPadPressed(player: number, button: PadButtonNames, frames = 1) {
    const pad = this.gamepad._buttons.get(player);
    return (pad?.get(button) ?? NaN) > frames;
  }
  isPadReleased(player: number, button: PadButtonNames) {
    const pad = this.gamepad._buttons.get(player);
    return !pad?.has(button);
  }
  isMouseTriggered(button: MouseButtonNames) {
    return (this.mouse._buttons.get(button) ?? NaN) === 1;
  }
  isMousePressed(button: MouseButtonNames, frames = 1) {
    return (this.mouse._buttons.get(button) ?? NaN) > frames;
  }
  isMouseReleased(button: MouseButtonNames) {
    return !this.mouse._buttons.has(button);
  }
  getPadStick(player: number, stick: number, threshold = 0.2) {
    const polar = this.gamepad._sticks.get(player)?.[stick];
    if (!polar) return new Point();
    const { dx, dy } = polar;
    return new Point(
      dx >= threshold || dx <= threshold ? dx : 0,
      dy >= threshold || dy <= threshold ? dy : 0
    );
  }
  getPadStickAngle(
    player: number,
    stick: number,
    angle: number,
    range = 45,
    threshold = 0.2
  ) {
    const polar = this.gamepad._sticks.get(player)?.[stick];
    if (!polar) return 0;
    const velocity = getVelocityWithinRange(polar, angle, range);
    return velocity >= threshold ? velocity : 0;
  }
  getPadStickRight(player: number, stick: number, range = 45, threshold = 0.2) {
    return this.getPadStickAngle(player, stick, 45 * 0, range, threshold);
  }
  getPadStickDown(player: number, stick: number, range = 45, threshold = 0.2) {
    return this.getPadStickAngle(player, stick, 45 * 2, range, threshold);
  }
  getPadStickLeft(player: number, stick: number, range = 45, threshold = 0.2) {
    return this.getPadStickAngle(player, stick, 45 * 4, range, threshold);
  }
  getPadStickUp(player: number, stick: number, range = 45, threshold = 0.2) {
    return this.getPadStickAngle(player, stick, 45 * 6, range, threshold);
  }
  getMousePosition() {
    return this.mouse._position;
  }
  getMouseMoveDelta(threshold = 0.2, limit = Infinity) {
    const { x, y } = this.mouse._deltaPosition;
    return new Point(
      x >= threshold
        ? Math.min(limit, x)
        : x <= -threshold
        ? Math.max(-limit, x)
        : 0,
      y >= threshold
        ? Math.min(limit, y)
        : y <= -threshold
        ? Math.max(-limit, y)
        : 0
    );
  }
  getAxis(
    mode:
      | "WASD"
      | "ARROW"
      | "NUM"
      | "HJKL"
      | "IJKL"
      | "4PAD"
      | "4STICK"
      | "STICK"
      | "WHEEL",
    {
      padPlayer = 0,
      padStick = 0,
      padRange = 45,
      threshold = 0.2,
    }: {
      padPlayer?: number;
      padStick?: number;
      padRange?: number;
      threshold?: number;
    } = {}
  ) {
    const p = new Point();
    switch (mode) {
      case "WASD": {
        if (this.isKeyPressed("w")) p.y = -1;
        if (this.isKeyPressed("a")) p.x = -1;
        if (this.isKeyPressed("s")) p.y = 1;
        if (this.isKeyPressed("d")) p.x = 1;
        break;
      }
      case "ARROW": {
        if (this.isKeyPressed("ArrowLeft")) p.x = -1;
        if (this.isKeyPressed("ArrowRight")) p.x = 1;
        if (this.isKeyPressed("ArrowUp")) p.y = -1;
        if (this.isKeyPressed("ArrowDown")) p.y = 1;
        break;
      }
      case "NUM": {
        if (this.isKeyPressed("2")) p.y = 1;
        if (this.isKeyPressed("4")) p.x = -1;
        if (this.isKeyPressed("6")) p.x = 1;
        if (this.isKeyPressed("8")) p.y = -1;
        break;
      }
      case "HJKL": {
        if (this.isKeyPressed("h")) p.x = -1;
        if (this.isKeyPressed("j")) p.y = 1;
        if (this.isKeyPressed("k")) p.y = -1;
        if (this.isKeyPressed("l")) p.x = 1;
        break;
      }
      case "IJKL": {
        if (this.isKeyPressed("i")) p.y = -1;
        if (this.isKeyPressed("j")) p.x = -1;
        if (this.isKeyPressed("k")) p.y = 1;
        if (this.isKeyPressed("l")) p.x = 1;
        break;
      }
      case "4PAD": {
        if (this.isPadPressed(padPlayer, "LEFT")) p.x = -1;
        if (this.isPadPressed(padPlayer, "RIGHT")) p.x = 1;
        if (this.isPadPressed(padPlayer, "UP")) p.y = -1;
        if (this.isPadPressed(padPlayer, "DOWN")) p.y = 1;
        break;
      }
      case "4STICK": {
        const [left, right, up, down] = [
          this.getPadStickRight(padPlayer, padStick, padRange, threshold),
          this.getPadStickLeft(padPlayer, padStick, padRange, threshold),
          this.getPadStickUp(padPlayer, padStick, padRange, threshold),
          this.getPadStickDown(padPlayer, padStick, padRange, threshold),
        ];
        if (right) p.x = -right;
        if (left) p.x = left;
        if (up) p.y = -up;
        if (down) p.y = down;
        break;
      }
      case "STICK": {
        const pad = this.getPadStick(padPlayer, padStick, threshold);
        p.x = pad.x;
        p.y = pad.y;
        break;
      }
      case "WHEEL": {
        if (this.isMousePressed("WHEEL_LEFT")) p.x = -1;
        if (this.isMousePressed("WHEEL_RIGHT")) p.x = 1;
        if (this.isMousePressed("WHEEL_UP")) p.y = -1;
        if (this.isMousePressed("WHEEL_DOWN")) p.y = 1;
        break;
      }
    }
    return p;
  }
}
