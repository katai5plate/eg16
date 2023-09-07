import { GameManager } from "../core/managers/GameManager";
import { MainScene } from "./MainScene";
import { SubScene } from "./SubScene";

export const game = new GameManager([new MainScene(), new SubScene()], {
  physicsDebug: true,
});
