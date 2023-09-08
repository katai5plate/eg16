import { Rectangle } from "pixi.js";

export const fillIn = (
  ctx: CanvasRenderingContext2D,
  color: number,
  fn: () => void,
  fillLast = false
) => {
  const { fillStyle } = ctx;
  ctx.fillStyle = `#${color.toString(16)}`;
  fn();
  fillLast && ctx.fill();
  ctx.fillStyle = fillStyle;
};
export const strokeIn = (
  ctx: CanvasRenderingContext2D,
  color: number,
  fn: () => void,
  strokeLast = false
) => {
  const { strokeStyle } = ctx;
  ctx.strokeStyle = `#${color.toString(16)}`;
  fn();
  strokeLast && ctx.stroke();
  ctx.strokeStyle = strokeStyle;
};
// export const textIn = (
//   ctx: CanvasRenderingContext2D,
//   px: number,
//   align: CanvasTextAlign,
//   baseline: CanvasTextBaseline,
//   fn: () => void,
//   fontType: "DEFAULT" | "CUSTOM" = "DEFAULT"
// ) => {
//   const { font, textAlign, textBaseline, imageSmoothingEnabled } = ctx;
//   ctx.imageSmoothingEnabled = false;
//   ctx.font = `${px}px ${fontType === "DEFAULT" ? "GameFont" : "CustomFont"}`;
//   ctx.textAlign = align;
//   ctx.textBaseline = baseline;
//   fn();
//   ctx.imageSmoothingEnabled = imageSmoothingEnabled;
//   ctx.font = font;
//   ctx.textAlign = textAlign;
//   ctx.textBaseline = textBaseline;
// };

const roundedRect = (
  ctx: CanvasRenderingContext2D,
  rect: Rectangle,
  borderRadius: number
) => {
  const { x, y, width, height } = rect;
  ctx.beginPath();
  ctx.moveTo(x + borderRadius, y);
  ctx.lineTo(x + width - borderRadius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + borderRadius);
  ctx.lineTo(x + width, y + height - borderRadius);
  ctx.quadraticCurveTo(
    x + width,
    y + height,
    x + width - borderRadius,
    y + height
  );
  ctx.lineTo(x + borderRadius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - borderRadius);
  ctx.lineTo(x, y + borderRadius);
  ctx.quadraticCurveTo(x, y, x + borderRadius, y);
  ctx.closePath();
};

export const fillRoundedRect = (
  ctx: CanvasRenderingContext2D,
  color: number,
  rect: Rectangle,
  borderRadius: number
) =>
  fillIn(
    ctx,
    color,
    () => {
      roundedRect(ctx, rect, borderRadius);
    },
    true
  );
export const strokeRoundedRect = (
  ctx: CanvasRenderingContext2D,
  color: number,
  rect: Rectangle,
  borderRadius: number
) =>
  strokeIn(
    ctx,
    color,
    () => {
      roundedRect(ctx, rect, borderRadius);
    },
    true
  );
