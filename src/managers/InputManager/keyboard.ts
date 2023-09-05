import keycode from "keycode";
import { Key } from "ts-key-enum";

export type KeyCodeNames = keyof (typeof keycode)["codes"] | keyof typeof Key;

export class KeyboardManager {
  _buttons: Map<KeyCodeNames, number>;
  constructor() {
    this._buttons = new Map();
    document.addEventListener("keydown", (e) => {
      const keyName = e.key as KeyCodeNames;
      if (!this._buttons.has(keyName)) {
        this._buttons.set(keyName, 0);
      }
    });
    document.addEventListener("keyup", (e) => {
      const keyName = e.key as KeyCodeNames;
      this._buttons.delete(keyName);
    });
  }
  _update() {
    this._buttons.forEach((v, k) => {
      if (this._buttons.has(k)) this._buttons.set(k, v + 1);
    });
  }
}
