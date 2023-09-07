import { Point, Rectangle } from "pixi.js";

export const calc = <T>(target: T, fn: (prev: T) => T) => fn(target);

/** `Point` と互換性のある座標指定 */
export interface PointLike {
  x: number;
  y: number;
}
/** `Point` を作成 */
export const xy = (x: number, y: number) => new Point(x, y);
/** `{x, y}` から `Point` に変換、または複製する */
xy.from = (p: PointLike) => xy(p.x, p.y);
/** 加算 */
xy.add = (from: PointLike, to: PointLike) =>
  xy.from(calc(from, (prev) => xy(prev.x + to.x, prev.y + to.y)));
/** 減算 */
xy.sub = (from: PointLike, to: PointLike) =>
  xy.from(calc(from, (prev) => xy(prev.x - to.x, prev.y - to.y)));
/** 乗算 */
xy.mul = (from: PointLike, to: PointLike) =>
  xy.from(calc(from, (prev) => xy(prev.x * to.x, prev.y * to.y)));
/** 除算 */
xy.div = (from: PointLike, to: PointLike) =>
  xy.from(calc(from, (prev) => xy(prev.x / to.x, prev.y / to.y)));
/** 剰余 */
xy.mod = (from: PointLike, to: PointLike) =>
  xy.from(calc(from, (prev) => xy(prev.x % to.x, prev.y % to.y)));

/** `Rectangle` を作成 */
export const rect = (x: number, y: number, w: number, h: number) =>
  new Rectangle(x, y, w, h);

/** `[x, y, x, y, ...]` を `[{x, y}, {x, y}, ...]` に変換 */
export const numsToPoints = (nums: number[]) =>
  nums.filter((_, i) => i % 2 === 0).map((val, i) => xy(val, nums[i * 2 + 1]));
