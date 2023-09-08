import { createCanvas, registerFont } from "canvas";
import fs from "fs";
import {
  ASSETS_DIR,
  BASIC_CHARS,
  CORE_ASSETS_DIR,
  GAME_ASSETS_DIR,
} from "./constants.js";

const FONT_DIR = `${ASSETS_DIR}/fonts`;

const SETTINGS = JSON.parse(
  fs.readFileSync(`./${FONT_DIR}/settings.json`, { encoding: "utf-8" })
);

for (const FILE_NAME_EXT of fs
  .readdirSync(FONT_DIR)
  .filter((path) => /\.ttf$/.test(path))) {
  const FILE_NAME = FILE_NAME_EXT.split(".")[0];
  const FONT_PATH = `./${FONT_DIR}/${FILE_NAME_EXT}`;

  const SETTING = SETTINGS[FILE_NAME_EXT];
  if ((SETTING.scale !== SETTING.scale) | 0)
    throw new Error("scale は整数でなければなりません: " + SETTING.scale);
  if (!["core", "game"].includes(SETTING.dist))
    throw new Error(
      "dist は core か game でなければなりません: " + SETTING.dist
    );

  const FONT_SIZE = SETTING.scale * 8; // 16 進数に変換する関係上、サイズは 8 の倍数でなければならない
  const DIST_PATH = `./${
    SETTING.dist === "core" ? CORE_ASSETS_DIR : GAME_ASSETS_DIR
  }/font.${FILE_NAME}.json`;

  const BINARY_SIZE = Number(`0b${"1".repeat(FONT_SIZE)}`).toString(16).length;
  const FONT_FACE = "ConvertFont";

  const contentView = (content) =>
    content
      .map((row) => row.map((col) => (col ? "██" : "..")).join(""))
      .join("\n");

  const unzip = (zip) => {
    const isHalf = zip.slice(0, 1) === "-";
    const crypt = zip.slice(1);
    const zeros = "0".repeat(
      FONT_SIZE * (isHalf ? BINARY_SIZE / 2 : BINARY_SIZE) - crypt.length
    );
    const value = zeros + crypt;
    const binaryRows = value
      .match(new RegExp(`\.{${value.length / FONT_SIZE}}`, "g"))
      .map((row) =>
        Number(`0x${row}`)
          .toString(2)
          .padStart(isHalf ? FONT_SIZE / 2 : FONT_SIZE, "0")
      );
    if (binaryRows.length !== FONT_SIZE) throw new Error("計算が合わない");
    const content = binaryRows.map((row) => [...row].map(Number));
    return { isHalf, content };
  };

  registerFont(FONT_PATH, { family: FONT_FACE });

  function generateFontArray(texts) {
    const fontMap = {};

    [...new Set(texts)].forEach((text) => {
      console.log("====================");
      console.log("対象文字:", text);

      /**
       * 文字の画像データの取得
       * @type {Uint8ClampedArray}
       */
      const imageData = (() => {
        const canvas = createCanvas(FONT_SIZE, FONT_SIZE);
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, FONT_SIZE, FONT_SIZE);
        ctx.font = `${FONT_SIZE}px ${FONT_FACE}`;
        ctx.fillStyle = "white";
        ctx.fillText(text, 0, FONT_SIZE);
        return ctx.getImageData(0, 0, FONT_SIZE, FONT_SIZE).data;
      })();

      /**
       * 文字の印字データを取得
       * @type {{ isHalf: boolean, content: number[][] | null }}
       */
      const charData = (() => {
        let charArray = [];
        let isHalf = true;
        for (let y = 0; y < FONT_SIZE; y++) {
          let row = [];
          for (let x = 0; x < FONT_SIZE; x++) {
            const index = (y * FONT_SIZE + x) * 4;
            const isBlack = imageData[index] === 0 ? 0 : 1; // 赤要素だけで判断
            row.push(isBlack);
            if (x >= FONT_SIZE / 2 && isBlack) isHalf = false;
          }
          charArray.push(row);
        }
        if (!charArray.flat().every((x) => x === 0)) {
          if (isHalf) {
            charArray = charArray.map((row) => row.slice(0, FONT_SIZE / 2));
          } else {
            charArray = charArray.map((row) => row.slice(0, FONT_SIZE));
          }
        } else {
          charArray = null;
        }
        return { isHalf, content: charArray };
      })();

      if (!charData.content) return;

      console.log("生データ:", "\n" + contentView(charData.content));

      const binarySize = Number(`0b${"1".repeat(FONT_SIZE)}`).toString(
        16
      ).length;

      /**
       * 文字列圧縮
       * @type {`${"-" | "+"}${string}` | undefined}
       */
      const zip = (({ isHalf, content }) => {
        if (content === null) return;
        if (isHalf) {
          return `-${content
            .map((row) =>
              BigInt(`0b${row.join("")}`)
                .toString(16)
                .padStart(binarySize / 2, "0")
            )
            .join("")
            .replace(/^0+/, "")}`;
        }
        return `+${content
          .map((row) =>
            BigInt(`0b${row.join("")}`)
              .toString(16)
              .padStart(binarySize, "0")
          )
          .join("")
          .replace(/^0+/, "")}`;
      })(charData);

      console.log("圧縮文字列:", zip);
      zip && (fontMap[text] = zip);

      const restored = unzip(zip);
      console.log("解凍テスト:", "\n" + contentView(restored.content));
      if (JSON.stringify(charData) !== JSON.stringify(restored)) {
        throw new Error("圧縮失敗");
      }
    });

    return fontMap;
  }

  // const table = generateFontArray([..."うえ$%#■〠"]);
  const table = generateFontArray([
    ...(SETTING.chars.kigou ? BASIC_CHARS.kigou : ""),
    ...(SETTING.chars.english ? BASIC_CHARS.english : ""),
    ...(SETTING.chars.kana ? BASIC_CHARS.kana : ""),
    ...(SETTING.chars.kanji ? BASIC_CHARS.kanji : ""),
  ]);
  fs.writeFileSync(DIST_PATH, JSON.stringify({ ...SETTING, table }));
}

console.log("\n完了！");
