import { GameManager } from "../core/managers/GameManager";
import { MainScene } from "./scene/MainScene";
import { SubScene } from "./scene/SubScene";

export const game = new GameManager([new MainScene(), new SubScene()]);
