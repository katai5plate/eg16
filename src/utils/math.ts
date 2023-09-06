import { Point, Rectangle } from "pixi.js";

export const xy = (x: number, y: number) => new Point(x, y);
export const rect = (x: number, y: number, w: number, h: number) =>
  new Rectangle(x, y, w, h);

export const numsToPoints = (nums: number[]) =>
  nums.filter((_, i) => i % 2 === 0).map((val, i) => xy(val, nums[i * 2 + 1]));
