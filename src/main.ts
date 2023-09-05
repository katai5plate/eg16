import "./style.css";
import { Application, Graphics, Sprite, Texture } from "pixi.js";
import { System } from "detect-collisions";
import { InputManager } from "./managers/InputManager";

const app = new Application({ width: 128, height: 96 });
(globalThis as any).__PIXI_APP__ = app;
document.body.appendChild(app.view as HTMLCanvasElement);

const physics = new System();

const input = new InputManager(app);

const createWall = (
  color: number,
  x: number,
  y: number,
  w: number,
  h: number
) => {
  const displayObject = new Graphics();
  displayObject.beginFill(color);
  displayObject.drawRect(0, 0, w, h);
  displayObject.endFill();
  displayObject.position.set(x, y);
  const collider = physics.createBox({ x, y }, w, h);
  return { displayObject, collider };
};
const createSphere = (color: number, x: number, y: number, r: number) => {
  const displayObject = new Graphics();
  displayObject.beginFill(color);
  displayObject.drawCircle(0, 0, r);
  displayObject.endFill();
  displayObject.position.set(x, y);
  const collider = physics.createCircle({ x, y }, r);
  return { displayObject, collider };
};
const playerState = {
  speed: 0.5,
  x: 48,
  y: 48,
  up: false,
  down: false,
  left: false,
  right: false,
};
const createPlayer = () => {
  const displayObject = new Sprite(Texture.WHITE);
  const { x, y } = playerState;
  displayObject.position.set(x, y);

  const collider = physics.createBox({ x, y }, 16, 16);

  return { displayObject, collider };
};

const player = createPlayer();

[
  player,
  createWall(0xffaa00, 0, 0, app.screen.width, 0),
  createWall(0xffaa00, 0, app.screen.height, app.screen.width, 0),
  createWall(0xffaa00, 112, 0, 16, 96),
  createWall(0xffaa00, 0, 0, 16, 96),
  createWall(0xffaa00, 112, 0, 16, 96),
  createSphere(0xffaa00, 40, 24, 8),
  createSphere(0xffaa00, 88, 72, 8),
  createSphere(0xffaa00, 80, 32, 8),
  createSphere(0xffaa00, 77, 40, 24),
].forEach(({ displayObject, collider }) => {
  physics.insert(collider);
  app.stage.addChild(displayObject);
});

app.ticker.add(() => {
  input.update();
  playerState.x += input.getAxis("STICK").x;
  playerState.y += input.getAxis("STICK").y;
  player.collider.setPosition(playerState.x, playerState.y);
  physics.checkAll(({ a, overlapV }) => {
    if (a === player.collider) {
      playerState.x -= overlapV.x;
      playerState.y -= overlapV.y;
      player.collider.setPosition(playerState.x, playerState.y);
    }
  });
  player.displayObject.position.set(playerState.x, playerState.y);
});
