import "./style.css";

import { game } from "game/index";

if (import.meta.env.DEV) {
  (globalThis as any).__DEBUG__ = game;

  const memoryState = {
    prevHeap: 0,
    currentHeap: 0,
  };
  setInterval(() => {
    memoryState.prevHeap = memoryState.currentHeap;
    memoryState.currentHeap =
      ((globalThis as any).performance.memory.totalJSHeapSize / (1024 * 2)) | 0;
    const diff = memoryState.prevHeap - memoryState.currentHeap;
    diff !== 0 &&
      console.log(
        `RAM: ${memoryState.currentHeap} MB (${diff > 0 ? "+" : "-"}${Math.abs(
          diff
        )})`
      );
  }, 1000);
}
