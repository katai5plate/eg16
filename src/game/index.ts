import { GameManager } from "../core/managers/GameManager";
import { CollisionTest } from "./scene/CollisionTest";
import { Menu } from "./scene/Menu";

export const game = new GameManager([
  //
  new Menu(),
  new CollisionTest(),
]);
