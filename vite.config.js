import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vite";

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
  plugins: [tsconfigPaths()],
});
