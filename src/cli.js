import { processFolder } from "./processor";
import "./templates"

export async function run(args) {
  const hideBin = args.slice(2)
  const [input, output] = hideBin;
  await processFolder(input, output);
}
