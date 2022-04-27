const path = require("path");
const { processFolder, getFilesList } = require("../generator/src");

(async () => {
  const input = path.resolve("./cadence");
  const output = path.resolve("./generated");
  const fileList = await getFilesList(input);
  console.log({ input, output, fileList });
  await processFolder(input, output);
  console.log("✅ Done!");
})();
