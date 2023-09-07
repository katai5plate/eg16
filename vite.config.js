import Unfonts from "unplugin-fonts/vite";
import fonts from "./fonts.json";

const families = Object.entries(fonts).reduce(
  (p, [k, v]) => ({
    ...p,
    [k]: {
      src: `./public/fonts/${v.file}`,
    },
  }),
  {}
);

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
        families,
      },
    }),
  ],
};
