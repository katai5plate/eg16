import { GameManager } from "core/managers/GameManager";

// import { Menu } from "game/scene/Menu";
import { Breakout } from "game/scene/Breakout";
import { CollisionTest } from "game/scene/CollisionTest";

new GameManager([
  //
  // new Menu(),
  new Breakout(),
  new CollisionTest(),
]);
