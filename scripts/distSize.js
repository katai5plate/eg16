import fs from "fs/promises";
import path from "path";

const getFolderSize = async (dirPath) => {
  let totalSize = 0;
  const files = await fs.readdir(dirPath);

  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const stats = await fs.stat(filePath);

    if (stats.isDirectory()) {
      totalSize += await getFolderSize(filePath);
    } else {
      totalSize += stats.size;
    }
  }

  return totalSize;
};

(async () => {
  console.log(
    "docs/**/*.*\t",
    +((await getFolderSize("./docs")) / 1024).toFixed(2),
    "kB"
  );
})();
