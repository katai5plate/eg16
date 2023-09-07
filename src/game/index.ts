import { GameManager } from "core/managers/GameManager";
import { CollisionTest } from "game/scene/CollisionTest";
import { Menu } from "game/scene/Menu";

export const game = new GameManager([
  //
  new Menu(),
  new CollisionTest(),
]);
