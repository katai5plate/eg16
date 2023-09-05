import { Point } from "pixi.js";

export const numsToPoints = (nums: number[]) =>
  nums
    .filter((_, i) => i % 2 === 0)
    .map((val, i) => new Point(val, nums[i * 2 + 1]));
