import fs from "fs";
import LZString from "lz-string";
import { ASSETS_DIR, GAME_ASSETS_DIR } from "./constants.js";
import { numberToBase92, pngToBase64 } from "./utils.js";

const IMAGES_DIR = `${ASSETS_DIR}/images`;
const DIST_PATH = `./${GAME_ASSETS_DIR}/images.json`;

const bufferToBMP = (buffer) => {
  const width = buffer[18] | (buffer[19] << 8);
  const height = buffer[22] | (buffer[23] << 8);
  const bit = buffer[28] | (buffer[29] << 8);

  if (bit !== 4) throw new Error("１６色ビットマップではありません: " + file);

  const paletteData = [];
  for (let i = 0; i < 16; i++) {
    const offset = 54 + i * 4;
    const color =
      (buffer[offset + 2] << 16) | (buffer[offset + 1] << 8) | buffer[offset];
    paletteData.push(color);
  }

  const pixelsData = Array.from({ length: height }, () => []);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x += 2) {
      const byte =
        buffer[
          54 + 64 + (height - 1 - y) * Math.ceil(width / 2) + Math.floor(x / 2)
        ];
      pixelsData[y].push(byte >> 4);
      pixelsData[y].push(byte & 0xf);
    }
  }

  return LZString.compressToBase64(
    JSON.stringify({
      palette: paletteData
        .map((color) => numberToBase92(color).replace(/^0+/, ""))
        .join(),
      pixels: pixelsData
        .map((row) => row.map((col) => col.toString(16)).join(""))
        .join(),
    })
  ).replace(/=*$/, "");
};

fs.writeFileSync(
  DIST_PATH,
  JSON.stringify(
    fs
      .readdirSync(IMAGES_DIR)
      .filter((path) => /\.(bmp|png|jpg|jpeg|gif)$/.test(path))
      .reduce((p, file) => {
        const path = `${IMAGES_DIR}/${file}`;
        const buffer = fs.readFileSync(path);
        const [, name, ext] = file.match(/(^.+?)\.(bmp|png|jpg|jpeg|gif)$/);

        console.log(path);

        if (ext === "bmp") {
          return {
            ...p,
            [name]: {
              format: "bmp",
              data: bufferToBMP(buffer),
            },
          };
        }
        return {
          ...p,
          [name]: {
            format: ext === "jpeg" ? "jpg" : ext,
            data: pngToBase64(buffer, name),
          },
        };
      }, {})
  )
);
console.log(`\t--> ${DIST_PATH}`);
