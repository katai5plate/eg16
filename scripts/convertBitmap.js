import fs from "fs";

const ASSETS_DIR = "src/game/assets";
const BITMAP_DIR = `${ASSETS_DIR}/_bitmaps`;
const BITMAP_DIST = `./${ASSETS_DIR}/bitmaps.json`;

fs.writeFileSync(
  BITMAP_DIST,
  JSON.stringify(
    fs
      .readdirSync(BITMAP_DIR)
      .filter((path) => /\.bmp$/.test(path))
      .reduce((p, file) => {
        const path = `${BITMAP_DIR}/${file}`;

        console.log(path);

        const buffer = fs.readFileSync(path);

        const width = buffer[18] | (buffer[19] << 8);
        const height = buffer[22] | (buffer[23] << 8);
        const bit = buffer[28] | (buffer[29] << 8);

        if (bit !== 4)
          throw new Error("１６色ビットマップではありません: " + file);

        const palette = [];
        for (let i = 0; i < 16; i++) {
          const offset = 54 + i * 4;
          const color =
            (buffer[offset + 2] << 16) |
            (buffer[offset + 1] << 8) |
            buffer[offset];
          palette.push(color);
        }

        const pixels = Array.from({ length: height }, () => []);
        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x += 2) {
            const byte =
              buffer[
                54 +
                  64 +
                  (height - 1 - y) * Math.ceil(width / 2) +
                  Math.floor(x / 2)
              ];
            pixels[y].push(byte >> 4);
            pixels[y].push(byte & 0xf);
          }
        }

        const name = file.split(".bmp")[0];

        return { ...p, [name]: { palette, pixels } };
      }, {})
  )
);
console.log(`\t--> ${BITMAP_DIST}`);
