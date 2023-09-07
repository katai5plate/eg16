import { GameManager } from "../core/managers/GameManager";
import { CollisionTest } from "./scene/CollisionTest";

export const game = new GameManager([
  //
  new CollisionTest(),
]);
