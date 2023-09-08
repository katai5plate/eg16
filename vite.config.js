import Unfonts from "unplugin-fonts/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import fontSettings from "./assets/fonts/settings.json";
import { defineConfig } from "vite";

const families = Object.entries(fontSettings).reduce(
  (p, [file, v]) => ({
    ...p,
    [v.name]: {
      src: `./public/fonts/${file}`,
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
