import Unfonts from "unplugin-fonts/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import fonts from "./fonts.json";
import { defineConfig } from "vite";

const families = Object.entries(fonts).reduce(
  (p, [k, v]) => ({
    ...p,
    [k]: {
      src: `./public/fonts/${v.file}`,
    },
  }),
  {}
);

export default defineConfig({
  base: "./",
  resolve: {
    alias: {
      "~/": `${__dirname}/`,
      "core/": `${__dirname}/src/core/`,
      "game/": `${__dirname}/src/game/`,
    },
  },
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
        families,
      },
    }),
    tsconfigPaths(),
  ],
});
