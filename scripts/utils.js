import fs from "fs";
import { PNG } from "pngjs";

const { BASE92_TABLE } = JSON.parse(
  fs.readFileSync("./src/core/constants.json")
);

export const numberToBase92 = (value) => {
  const base = BASE92_TABLE.length;
  let result = "";
  for (; value > 0; value = Math.floor(value / base)) {
    result = BASE92_TABLE[value % base] + result;
  }
  return result || BASE92_TABLE[0];
};

export const pngToBase64 = (buffer, name = "") => {
  const pngSignature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  try {
    if (buffer.slice(0, 8).equals(pngSignature)) {
      const png = PNG.sync.read(buffer);
      if (png.depth === 4) {
        return buffer.toString("base64");
      } else {
        throw new Error("これは 4bit PNG ではありません: " + name);
      }
    } else {
      throw new Error("これは PNG ではありません: " + name);
    }
  } catch (error) {
    console.error(error);
    return null;
  }
};

// export const compressCanvasBase64 = (text) => {
//   const buffer = Buffer.from(text);

//   const width = buffer.length;
//   const height = 1;

//   const canvas = createCanvas(width, height);
//   const ctx = canvas.getContext("2d");
//   const imageData = ctx.getImageData(0, 0, width, height);

//   for (let i = 0; i < buffer.length; i++) {
//     imageData.data[i * 4] = buffer[i]; // R
//     imageData.data[i * 4 + 1] = 0; // G
//     imageData.data[i * 4 + 2] = 0; // B
//     imageData.data[i * 4 + 3] = 255; // A
//   }

//   ctx.putImageData(imageData, 0, 0);

//   // PNGをBase64文字列として取得
//   return canvas.toDataURL().split(";base64,").pop();
// };
