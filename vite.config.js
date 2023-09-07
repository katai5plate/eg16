import fs from "fs";
import Unfonts from "unplugin-fonts/vite";

const OVERWRITE_FONT_PATH = "./src/game/assets/font.ttf";
const isOverwritten = fs.existsSync(OVERWRITE_FONT_PATH);

export default {
  base: "./",
  build: {
    outDir: "docs",
    rollupOptions: {
      output: {
        entryFileNames: `[name].js`,
        chunkFileNames: `[name].js`,
        assetFileNames: `[name].[ext]`,
      },
    },
  },
  plugins: [
    Unfonts({
      custom: {
        families: {
          GameFont: {
            src: "./src/core/assets/font.ttf",
          },
          CustomFont: {
            src: "./src/game/assets/font.ttf",
          },
        },
      },
    }),
  ],
};
