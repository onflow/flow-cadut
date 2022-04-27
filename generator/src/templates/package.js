import { each } from "./utils";

export default (props) => {
  const { folders, files, contracts } = props;
  return `
    ${each(folders, (item) => `import ${item} from './${item}'`)}
    
    ${each(files, (item) => `import { ${item}Template, ${item} } from './${item}'`)}
    
    ${each(contracts, (item) => `import { ${item}Template, deploy${item} } from './${item}'`)}
    
    export default {
      ${each(folders, (item) => `${item},`)}
      ${each(files, (item) => `${item}Template, ${item},`)}
      ${each(contracts, (item) => `${item}Template, deploy${item},`)}
    }
  `;
};
