import { resolve } from "path";
import Handlebars from "handlebars";
import { getSplitCharacter, trimAndSplit, underscoreToCamelCase } from "./strings";
import { generateExports, getFilesList, readFile, writeFile } from "./file";

export const processFolder = async (input, output) => {
  const splitCharacter = getSplitCharacter(input);
  const fullBasePath = `${resolve(input)}${splitCharacter}`;
  const fileList = await getFilesList(input);

  console.log({ fileList });

  for (let i = 0; i < fileList.length; i++) {
    const path = fileList[i];
    const packages = trimAndSplit(path, fullBasePath);
    const pathPackages = packages.slice(0, -1);
    const file = packages.slice(-1)[0];

    const code = readFile(path);
    const name = underscoreToCamelCase(file.replace(".cdc", ""));

    const data = Handlebars.templates.asset({ code, name, assetName: name });

    const templateFolder = pathPackages.join(`/`);
    const filePath = `${output}/${templateFolder}/${name}.js`;

    writeFile(filePath, data);
  }

  // Generate index.js exports in each folder
  await generateExports(output, Handlebars.templates.package);
};
