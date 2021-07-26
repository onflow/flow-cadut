var Handlebars = require("handlebars");
var template = Handlebars.template,
  templates = (Handlebars.templates = Handlebars.templates || {});
templates["asset"] = template({
  compiler: [8, ">= 4.3.0"],
  main: function (container, depth0, helpers, partials, data) {
    var helper,
      alias1 = depth0 != null ? depth0 : container.nullContext || {},
      alias2 = container.hooks.helperMissing,
      alias3 = "function",
      alias4 = container.escapeExpression,
      lookupProperty =
        container.lookupProperty ||
        function (parent, propertyName) {
          if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
            return parent[propertyName];
          }
          return undefined;
        };

    return (
      "import { replaceImportAddresses } from \"flow-js-testing\";\r\nimport { getEnvironment, reportMissingImports } from 'utils'\r\n\r\nexport const CODE = `\r\n" +
      alias4(
        ((helper =
          (helper =
            lookupProperty(helpers, "code") ||
            (depth0 != null ? lookupProperty(depth0, "code") : depth0)) != null
            ? helper
            : alias2),
        typeof helper === alias3
          ? helper.call(alias1, {
              name: "code",
              hash: {},
              data: data,
              loc: { start: { line: 5, column: 0 }, end: { line: 5, column: 10 } },
            })
          : helper)
      ) +
      '\r\n`;\r\n\r\n/**\r\n* Method to generate cadence code for TestAsset\r\n* @param {Object.<string, string>} addressMap - contract name as a key and address where it\'s deployed as value\r\n* @param {( "emulator" | "testnet" | "mainnet" )} [env] - current working environment, defines default deployed contracts\r\n*/\r\nexport const ' +
      alias4(
        ((helper =
          (helper =
            lookupProperty(helpers, "assetName") ||
            (depth0 != null ? lookupProperty(depth0, "assetName") : depth0)) != null
            ? helper
            : alias2),
        typeof helper === alias3
          ? helper.call(alias1, {
              name: "assetName",
              hash: {},
              data: data,
              loc: { start: { line: 13, column: 13 }, end: { line: 13, column: 28 } },
            })
          : helper)
      ) +
      'Template = (addressMap = {}, env = "testnet") => {\r\n    const envMap = getEnvironment(env);\r\n    const fullMap = {\r\n    ...envMap,\r\n    ...addressMap,\r\n    };\r\n\r\n    // If there are any missing imports in fullMap it will be reported via console\r\n    reportMissingImports(CODE, fullMap, `' +
      alias4(
        ((helper =
          (helper =
            lookupProperty(helpers, "name") ||
            (depth0 != null ? lookupProperty(depth0, "name") : depth0)) != null
            ? helper
            : alias2),
        typeof helper === alias3
          ? helper.call(alias1, {
              name: "name",
              hash: {},
              data: data,
              loc: { start: { line: 21, column: 41 }, end: { line: 21, column: 51 } },
            })
          : helper)
      ) +
      " =>`)\r\n\r\n    return replaceImportAddresses(CODE, fullMap);\r\n};\r\n\r\n// TODO: compare number of arguments\r\n// TODO: pass signers\r\n// TOOD: compare number of signers\r\n// TODO: create specific method to scripts, transactions and contracts\r\n\r\nexport const  " +
      alias4(
        ((helper =
          (helper =
            lookupProperty(helpers, "assetName") ||
            (depth0 != null ? lookupProperty(depth0, "assetName") : depth0)) != null
            ? helper
            : alias2),
        typeof helper === alias3
          ? helper.call(alias1, {
              name: "assetName",
              hash: {},
              data: data,
              loc: { start: { line: 31, column: 14 }, end: { line: 31, column: 29 } },
            })
          : helper)
      ) +
      ' = (addressMap = {}, env = "testnet", args = []) => {\r\n  // TODO: implement sendTransaction or executeScript, based on context\r\n  const code = ' +
      alias4(
        ((helper =
          (helper =
            lookupProperty(helpers, "assetName") ||
            (depth0 != null ? lookupProperty(depth0, "assetName") : depth0)) != null
            ? helper
            : alias2),
        typeof helper === alias3
          ? helper.call(alias1, {
              name: "assetName",
              hash: {},
              data: data,
              loc: { start: { line: 33, column: 15 }, end: { line: 33, column: 29 } },
            })
          : helper)
      ) +
      "Template(addressMap, env, args)\r\n}\r\n"
    );
  },
  useData: true,
});
templates["contract"] = template({
  compiler: [8, ">= 4.3.0"],
  main: function (container, depth0, helpers, partials, data) {
    var stack1,
      helper,
      alias1 = depth0 != null ? depth0 : container.nullContext || {},
      alias2 = container.hooks.helperMissing,
      alias3 = "function",
      alias4 = container.escapeExpression,
      lookupProperty =
        container.lookupProperty ||
        function (parent, propertyName) {
          if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
            return parent[propertyName];
          }
          return undefined;
        };

    return (
      "/** pragma type contract **/\n\nimport {\n  getEnvironment,\n  replaceImportAddresses,\n  reportMissingImports,\n  deployContract,\n} from '" +
      alias4(
        ((helper =
          (helper =
            lookupProperty(helpers, "ixDependency") ||
            (depth0 != null ? lookupProperty(depth0, "ixDependency") : depth0)) != null
            ? helper
            : alias2),
        typeof helper === alias3
          ? helper.call(alias1, {
              name: "ixDependency",
              hash: {},
              data: data,
              loc: { start: { line: 8, column: 8 }, end: { line: 8, column: 26 } },
            })
          : helper)
      ) +
      "'\n\nexport const CODE = `\n  " +
      ((stack1 =
        ((helper =
          (helper =
            lookupProperty(helpers, "code") ||
            (depth0 != null ? lookupProperty(depth0, "code") : depth0)) != null
            ? helper
            : alias2),
        typeof helper === alias3
          ? helper.call(alias1, {
              name: "code",
              hash: {},
              data: data,
              loc: { start: { line: 11, column: 2 }, end: { line: 11, column: 14 } },
            })
          : helper)) != null
        ? stack1
        : "") +
      "\n`;\n\n/**\n* Method to generate cadence code for " +
      alias4(
        ((helper =
          (helper =
            lookupProperty(helpers, "assetName") ||
            (depth0 != null ? lookupProperty(depth0, "assetName") : depth0)) != null
            ? helper
            : alias2),
        typeof helper === alias3
          ? helper.call(alias1, {
              name: "assetName",
              hash: {},
              data: data,
              loc: { start: { line: 15, column: 38 }, end: { line: 15, column: 53 } },
            })
          : helper)
      ) +
      " transaction\n* @param {Object.<string, string>} addressMap - contract name as a key and address where it's deployed as value\n*/\nexport const " +
      alias4(
        ((helper =
          (helper =
            lookupProperty(helpers, "assetName") ||
            (depth0 != null ? lookupProperty(depth0, "assetName") : depth0)) != null
            ? helper
            : alias2),
        typeof helper === alias3
          ? helper.call(alias1, {
              name: "assetName",
              hash: {},
              data: data,
              loc: { start: { line: 18, column: 13 }, end: { line: 18, column: 28 } },
            })
          : helper)
      ) +
      "Template = async (addressMap = {}) => {\n  const envMap = await getEnvironment();\n  const fullMap = {\n  ...envMap,\n  ...addressMap,\n  };\n\n  // If there are any missing imports in fullMap it will be reported via console\n  reportMissingImports(CODE, fullMap, `" +
      alias4(
        ((helper =
          (helper =
            lookupProperty(helpers, "name") ||
            (depth0 != null ? lookupProperty(depth0, "name") : depth0)) != null
            ? helper
            : alias2),
        typeof helper === alias3
          ? helper.call(alias1, {
              name: "name",
              hash: {},
              data: data,
              loc: { start: { line: 26, column: 39 }, end: { line: 26, column: 49 } },
            })
          : helper)
      ) +
      " =>`)\n\n  return replaceImportAddresses(CODE, fullMap);\n};\n\n\n/**\n* Deploys " +
      alias4(
        ((helper =
          (helper =
            lookupProperty(helpers, "assetName") ||
            (depth0 != null ? lookupProperty(depth0, "assetName") : depth0)) != null
            ? helper
            : alias2),
        typeof helper === alias3
          ? helper.call(alias1, {
              name: "assetName",
              hash: {},
              data: data,
              loc: { start: { line: 33, column: 10 }, end: { line: 33, column: 25 } },
            })
          : helper)
      ) +
      " transaction to the network\n* @param {Object.<string, string>} addressMap - contract name as a key and address where it's deployed as value\n* @param Array<*> args - list of arguments\n* param Array<string> - list of signers\n*/\nexport const  deploy" +
      alias4(
        ((helper =
          (helper =
            lookupProperty(helpers, "assetName") ||
            (depth0 != null ? lookupProperty(depth0, "assetName") : depth0)) != null
            ? helper
            : alias2),
        typeof helper === alias3
          ? helper.call(alias1, {
              name: "assetName",
              hash: {},
              data: data,
              loc: { start: { line: 38, column: 20 }, end: { line: 38, column: 35 } },
            })
          : helper)
      ) +
      " = async (props) => {\n  const { addressMap = {} } = props;\n  const code = await " +
      alias4(
        ((helper =
          (helper =
            lookupProperty(helpers, "assetName") ||
            (depth0 != null ? lookupProperty(depth0, "assetName") : depth0)) != null
            ? helper
            : alias2),
        typeof helper === alias3
          ? helper.call(alias1, {
              name: "assetName",
              hash: {},
              data: data,
              loc: { start: { line: 40, column: 21 }, end: { line: 40, column: 36 } },
            })
          : helper)
      ) +
      'Template(addressMap);\n  const name = "' +
      alias4(
        ((helper =
          (helper =
            lookupProperty(helpers, "contractName") ||
            (depth0 != null ? lookupProperty(depth0, "contractName") : depth0)) != null
            ? helper
            : alias2),
        typeof helper === alias3
          ? helper.call(alias1, {
              name: "contractName",
              hash: {},
              data: data,
              loc: { start: { line: 41, column: 16 }, end: { line: 41, column: 34 } },
            })
          : helper)
      ) +
      '"\n\n  return deployContract({ code, name, ...props })\n}'
    );
  },
  useData: true,
});
templates["package"] = template({
  1: function (container, depth0, helpers, partials, data) {
    var alias1 = container.lambda,
      alias2 = container.escapeExpression;

    return (
      "import " +
      alias2(alias1(depth0, depth0)) +
      " from './" +
      alias2(alias1(depth0, depth0)) +
      "'\n"
    );
  },
  3: function (container, depth0, helpers, partials, data) {
    var alias1 = container.lambda,
      alias2 = container.escapeExpression;

    return (
      "import { " +
      alias2(alias1(depth0, depth0)) +
      "Template, " +
      alias2(alias1(depth0, depth0)) +
      " } from './" +
      alias2(alias1(depth0, depth0)) +
      "'\n"
    );
  },
  5: function (container, depth0, helpers, partials, data) {
    var alias1 = container.lambda,
      alias2 = container.escapeExpression;

    return (
      "import { " +
      alias2(alias1(depth0, depth0)) +
      "Template, deploy" +
      alias2(alias1(depth0, depth0)) +
      " } from './" +
      alias2(alias1(depth0, depth0)) +
      "'\n"
    );
  },
  7: function (container, depth0, helpers, partials, data) {
    return "        " + container.escapeExpression(container.lambda(depth0, depth0)) + ",\n";
  },
  9: function (container, depth0, helpers, partials, data) {
    var alias1 = container.lambda,
      alias2 = container.escapeExpression;

    return (
      "        " +
      alias2(alias1(depth0, depth0)) +
      "Template, " +
      alias2(alias1(depth0, depth0)) +
      ",\n"
    );
  },
  11: function (container, depth0, helpers, partials, data) {
    var alias1 = container.lambda,
      alias2 = container.escapeExpression;

    return (
      "      " +
      alias2(alias1(depth0, depth0)) +
      "Template, deploy" +
      alias2(alias1(depth0, depth0)) +
      ",\n"
    );
  },
  compiler: [8, ">= 4.3.0"],
  main: function (container, depth0, helpers, partials, data) {
    var stack1,
      alias1 = depth0 != null ? depth0 : container.nullContext || {},
      lookupProperty =
        container.lookupProperty ||
        function (parent, propertyName) {
          if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
            return parent[propertyName];
          }
          return undefined;
        };

    return (
      ((stack1 = lookupProperty(helpers, "each").call(
        alias1,
        depth0 != null ? lookupProperty(depth0, "folders") : depth0,
        {
          name: "each",
          hash: {},
          fn: container.program(1, data, 0),
          inverse: container.noop,
          data: data,
          loc: { start: { line: 1, column: 0 }, end: { line: 3, column: 9 } },
        }
      )) != null
        ? stack1
        : "") +
      "\n" +
      ((stack1 = lookupProperty(helpers, "each").call(
        alias1,
        depth0 != null ? lookupProperty(depth0, "files") : depth0,
        {
          name: "each",
          hash: {},
          fn: container.program(3, data, 0),
          inverse: container.noop,
          data: data,
          loc: { start: { line: 5, column: 0 }, end: { line: 7, column: 9 } },
        }
      )) != null
        ? stack1
        : "") +
      "\n" +
      ((stack1 = lookupProperty(helpers, "each").call(
        alias1,
        depth0 != null ? lookupProperty(depth0, "contracts") : depth0,
        {
          name: "each",
          hash: {},
          fn: container.program(5, data, 0),
          inverse: container.noop,
          data: data,
          loc: { start: { line: 9, column: 0 }, end: { line: 11, column: 9 } },
        }
      )) != null
        ? stack1
        : "") +
      "\nexport default {\n" +
      ((stack1 = lookupProperty(helpers, "each").call(
        alias1,
        depth0 != null ? lookupProperty(depth0, "folders") : depth0,
        {
          name: "each",
          hash: {},
          fn: container.program(7, data, 0),
          inverse: container.noop,
          data: data,
          loc: { start: { line: 14, column: 4 }, end: { line: 16, column: 13 } },
        }
      )) != null
        ? stack1
        : "") +
      ((stack1 = lookupProperty(helpers, "each").call(
        alias1,
        depth0 != null ? lookupProperty(depth0, "files") : depth0,
        {
          name: "each",
          hash: {},
          fn: container.program(9, data, 0),
          inverse: container.noop,
          data: data,
          loc: { start: { line: 17, column: 4 }, end: { line: 19, column: 13 } },
        }
      )) != null
        ? stack1
        : "") +
      ((stack1 = lookupProperty(helpers, "each").call(
        alias1,
        depth0 != null ? lookupProperty(depth0, "contracts") : depth0,
        {
          name: "each",
          hash: {},
          fn: container.program(11, data, 0),
          inverse: container.noop,
          data: data,
          loc: { start: { line: 20, column: 4 }, end: { line: 22, column: 13 } },
        }
      )) != null
        ? stack1
        : "") +
      "}"
    );
  },
  useData: true,
});
templates["script"] = template({
  compiler: [8, ">= 4.3.0"],
  main: function (container, depth0, helpers, partials, data) {
    var stack1,
      helper,
      alias1 = depth0 != null ? depth0 : container.nullContext || {},
      alias2 = container.hooks.helperMissing,
      alias3 = "function",
      alias4 = container.escapeExpression,
      lookupProperty =
        container.lookupProperty ||
        function (parent, propertyName) {
          if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
            return parent[propertyName];
          }
          return undefined;
        };

    return (
      "/** pragma type script **/\n\nimport {\n  getEnvironment,\n  replaceImportAddresses,\n  reportMissingImports,\n  reportMissing,\n  executeScript\n} from '" +
      alias4(
        ((helper =
          (helper =
            lookupProperty(helpers, "ixDependency") ||
            (depth0 != null ? lookupProperty(depth0, "ixDependency") : depth0)) != null
            ? helper
            : alias2),
        typeof helper === alias3
          ? helper.call(alias1, {
              name: "ixDependency",
              hash: {},
              data: data,
              loc: { start: { line: 9, column: 8 }, end: { line: 9, column: 26 } },
            })
          : helper)
      ) +
      "'\n\nexport const CODE = `\n  " +
      ((stack1 =
        ((helper =
          (helper =
            lookupProperty(helpers, "code") ||
            (depth0 != null ? lookupProperty(depth0, "code") : depth0)) != null
            ? helper
            : alias2),
        typeof helper === alias3
          ? helper.call(alias1, {
              name: "code",
              hash: {},
              data: data,
              loc: { start: { line: 12, column: 2 }, end: { line: 12, column: 14 } },
            })
          : helper)) != null
        ? stack1
        : "") +
      "\n`;\n\n/**\n* Method to generate cadence code for TestAsset\n* @param {Object.<string, string>} addressMap - contract name as a key and address where it's deployed as value\n*/\nexport const " +
      alias4(
        ((helper =
          (helper =
            lookupProperty(helpers, "assetName") ||
            (depth0 != null ? lookupProperty(depth0, "assetName") : depth0)) != null
            ? helper
            : alias2),
        typeof helper === alias3
          ? helper.call(alias1, {
              name: "assetName",
              hash: {},
              data: data,
              loc: { start: { line: 19, column: 13 }, end: { line: 19, column: 28 } },
            })
          : helper)
      ) +
      "Template = async (addressMap = {}) => {\n  const envMap = await getEnvironment();\n  const fullMap = {\n  ...envMap,\n  ...addressMap,\n  };\n\n  // If there are any missing imports in fullMap it will be reported via console\n  reportMissingImports(CODE, fullMap, `" +
      alias4(
        ((helper =
          (helper =
            lookupProperty(helpers, "name") ||
            (depth0 != null ? lookupProperty(depth0, "name") : depth0)) != null
            ? helper
            : alias2),
        typeof helper === alias3
          ? helper.call(alias1, {
              name: "name",
              hash: {},
              data: data,
              loc: { start: { line: 27, column: 39 }, end: { line: 27, column: 49 } },
            })
          : helper)
      ) +
      " =>`)\n\n  return replaceImportAddresses(CODE, fullMap);\n};\n\nexport const " +
      alias4(
        ((helper =
          (helper =
            lookupProperty(helpers, "assetName") ||
            (depth0 != null ? lookupProperty(depth0, "assetName") : depth0)) != null
            ? helper
            : alias2),
        typeof helper === alias3
          ? helper.call(alias1, {
              name: "assetName",
              hash: {},
              data: data,
              loc: { start: { line: 32, column: 13 }, end: { line: 32, column: 28 } },
            })
          : helper)
      ) +
      " = async (props) => {\n  const { addressMap = {}, args = [] } = props\n  const code = await " +
      alias4(
        ((helper =
          (helper =
            lookupProperty(helpers, "assetName") ||
            (depth0 != null ? lookupProperty(depth0, "assetName") : depth0)) != null
            ? helper
            : alias2),
        typeof helper === alias3
          ? helper.call(alias1, {
              name: "assetName",
              hash: {},
              data: data,
              loc: { start: { line: 34, column: 21 }, end: { line: 34, column: 35 } },
            })
          : helper)
      ) +
      'Template(addressMap);\n\n  reportMissing("arguments", args.length, ' +
      alias4(
        ((helper =
          (helper =
            lookupProperty(helpers, "argsAmount") ||
            (depth0 != null ? lookupProperty(depth0, "argsAmount") : depth0)) != null
            ? helper
            : alias2),
        typeof helper === alias3
          ? helper.call(alias1, {
              name: "argsAmount",
              hash: {},
              data: data,
              loc: { start: { line: 36, column: 42 }, end: { line: 36, column: 58 } },
            })
          : helper)
      ) +
      ", `" +
      alias4(
        ((helper =
          (helper =
            lookupProperty(helpers, "name") ||
            (depth0 != null ? lookupProperty(depth0, "name") : depth0)) != null
            ? helper
            : alias2),
        typeof helper === alias3
          ? helper.call(alias1, {
              name: "name",
              hash: {},
              data: data,
              loc: { start: { line: 36, column: 61 }, end: { line: 36, column: 71 } },
            })
          : helper)
      ) +
      " =>`);\n\n  return executeScript({code, ...props})\n}"
    );
  },
  useData: true,
});
templates["transaction"] = template({
  compiler: [8, ">= 4.3.0"],
  main: function (container, depth0, helpers, partials, data) {
    var stack1,
      helper,
      alias1 = depth0 != null ? depth0 : container.nullContext || {},
      alias2 = container.hooks.helperMissing,
      alias3 = "function",
      alias4 = container.escapeExpression,
      lookupProperty =
        container.lookupProperty ||
        function (parent, propertyName) {
          if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
            return parent[propertyName];
          }
          return undefined;
        };

    return (
      "/** pragma type transaction **/\n\nimport {\n  getEnvironment,\n  replaceImportAddresses,\n  reportMissingImports,\n  reportMissing,\n  sendTransaction\n} from '" +
      alias4(
        ((helper =
          (helper =
            lookupProperty(helpers, "ixDependency") ||
            (depth0 != null ? lookupProperty(depth0, "ixDependency") : depth0)) != null
            ? helper
            : alias2),
        typeof helper === alias3
          ? helper.call(alias1, {
              name: "ixDependency",
              hash: {},
              data: data,
              loc: { start: { line: 9, column: 8 }, end: { line: 9, column: 26 } },
            })
          : helper)
      ) +
      "'\n\nexport const CODE = `\n  " +
      ((stack1 =
        ((helper =
          (helper =
            lookupProperty(helpers, "code") ||
            (depth0 != null ? lookupProperty(depth0, "code") : depth0)) != null
            ? helper
            : alias2),
        typeof helper === alias3
          ? helper.call(alias1, {
              name: "code",
              hash: {},
              data: data,
              loc: { start: { line: 12, column: 2 }, end: { line: 12, column: 14 } },
            })
          : helper)) != null
        ? stack1
        : "") +
      "\n`;\n\n/**\n* Method to generate cadence code for " +
      alias4(
        ((helper =
          (helper =
            lookupProperty(helpers, "assetName") ||
            (depth0 != null ? lookupProperty(depth0, "assetName") : depth0)) != null
            ? helper
            : alias2),
        typeof helper === alias3
          ? helper.call(alias1, {
              name: "assetName",
              hash: {},
              data: data,
              loc: { start: { line: 16, column: 38 }, end: { line: 16, column: 53 } },
            })
          : helper)
      ) +
      " transaction\n* @param {Object.<string, string>} addressMap - contract name as a key and address where it's deployed as value\n*/\nexport const " +
      alias4(
        ((helper =
          (helper =
            lookupProperty(helpers, "assetName") ||
            (depth0 != null ? lookupProperty(depth0, "assetName") : depth0)) != null
            ? helper
            : alias2),
        typeof helper === alias3
          ? helper.call(alias1, {
              name: "assetName",
              hash: {},
              data: data,
              loc: { start: { line: 19, column: 13 }, end: { line: 19, column: 28 } },
            })
          : helper)
      ) +
      "Template = async (addressMap = {}) => {\n  const envMap = await getEnvironment();\n  const fullMap = {\n  ...envMap,\n  ...addressMap,\n  };\n\n  // If there are any missing imports in fullMap it will be reported via console\n  reportMissingImports(CODE, fullMap, `" +
      alias4(
        ((helper =
          (helper =
            lookupProperty(helpers, "name") ||
            (depth0 != null ? lookupProperty(depth0, "name") : depth0)) != null
            ? helper
            : alias2),
        typeof helper === alias3
          ? helper.call(alias1, {
              name: "name",
              hash: {},
              data: data,
              loc: { start: { line: 27, column: 39 }, end: { line: 27, column: 49 } },
            })
          : helper)
      ) +
      " =>`)\n\n  return replaceImportAddresses(CODE, fullMap);\n};\n\n\n/**\n* Sends " +
      alias4(
        ((helper =
          (helper =
            lookupProperty(helpers, "assetName") ||
            (depth0 != null ? lookupProperty(depth0, "assetName") : depth0)) != null
            ? helper
            : alias2),
        typeof helper === alias3
          ? helper.call(alias1, {
              name: "assetName",
              hash: {},
              data: data,
              loc: { start: { line: 34, column: 8 }, end: { line: 34, column: 23 } },
            })
          : helper)
      ) +
      " transaction to the network\n* @param {Object.<string, string>} props.addressMap - contract name as a key and address where it's deployed as value\n* @param Array<*> props.args - list of arguments\n* @param Array<*> props.signers - list of signers\n*/\nexport const " +
      alias4(
        ((helper =
          (helper =
            lookupProperty(helpers, "assetName") ||
            (depth0 != null ? lookupProperty(depth0, "assetName") : depth0)) != null
            ? helper
            : alias2),
        typeof helper === alias3
          ? helper.call(alias1, {
              name: "assetName",
              hash: {},
              data: data,
              loc: { start: { line: 39, column: 13 }, end: { line: 39, column: 28 } },
            })
          : helper)
      ) +
      " = async (props) => {\n  const { addressMap, args = [], signers = [] } = props;\n  const code = await " +
      alias4(
        ((helper =
          (helper =
            lookupProperty(helpers, "assetName") ||
            (depth0 != null ? lookupProperty(depth0, "assetName") : depth0)) != null
            ? helper
            : alias2),
        typeof helper === alias3
          ? helper.call(alias1, {
              name: "assetName",
              hash: {},
              data: data,
              loc: { start: { line: 41, column: 21 }, end: { line: 41, column: 35 } },
            })
          : helper)
      ) +
      'Template(addressMap);\n\n  reportMissing("arguments", args.length, ' +
      alias4(
        ((helper =
          (helper =
            lookupProperty(helpers, "argsAmount") ||
            (depth0 != null ? lookupProperty(depth0, "argsAmount") : depth0)) != null
            ? helper
            : alias2),
        typeof helper === alias3
          ? helper.call(alias1, {
              name: "argsAmount",
              hash: {},
              data: data,
              loc: { start: { line: 43, column: 42 }, end: { line: 43, column: 58 } },
            })
          : helper)
      ) +
      ", `" +
      alias4(
        ((helper =
          (helper =
            lookupProperty(helpers, "assetName") ||
            (depth0 != null ? lookupProperty(depth0, "assetName") : depth0)) != null
            ? helper
            : alias2),
        typeof helper === alias3
          ? helper.call(alias1, {
              name: "assetName",
              hash: {},
              data: data,
              loc: { start: { line: 43, column: 61 }, end: { line: 43, column: 76 } },
            })
          : helper)
      ) +
      ' =>`);\n  reportMissing("signers", signers.length, ' +
      alias4(
        ((helper =
          (helper =
            lookupProperty(helpers, "signersAmount") ||
            (depth0 != null ? lookupProperty(depth0, "signersAmount") : depth0)) != null
            ? helper
            : alias2),
        typeof helper === alias3
          ? helper.call(alias1, {
              name: "signersAmount",
              hash: {},
              data: data,
              loc: { start: { line: 44, column: 43 }, end: { line: 44, column: 62 } },
            })
          : helper)
      ) +
      ", `" +
      alias4(
        ((helper =
          (helper =
            lookupProperty(helpers, "assetName") ||
            (depth0 != null ? lookupProperty(depth0, "assetName") : depth0)) != null
            ? helper
            : alias2),
        typeof helper === alias3
          ? helper.call(alias1, {
              name: "assetName",
              hash: {},
              data: data,
              loc: { start: { line: 44, column: 65 }, end: { line: 44, column: 80 } },
            })
          : helper)
      ) +
      " =>`);\n\n  return sendTransaction({code, ...props})\n}"
    );
  },
  useData: true,
});
templates["version"] = template({
  compiler: [8, ">= 4.3.0"],
  main: function (container, depth0, helpers, partials, data) {
    var helper,
      lookupProperty =
        container.lookupProperty ||
        function (parent, propertyName) {
          if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
            return parent[propertyName];
          }
          return undefined;
        };

    return (
      "export const VERSION = " +
      container.escapeExpression(
        ((helper =
          (helper =
            lookupProperty(helpers, "version") ||
            (depth0 != null ? lookupProperty(depth0, "version") : depth0)) != null
            ? helper
            : container.hooks.helperMissing),
        typeof helper === "function"
          ? helper.call(depth0 != null ? depth0 : container.nullContext || {}, {
              name: "version",
              hash: {},
              data: data,
              loc: { start: { line: 1, column: 23 }, end: { line: 1, column: 34 } },
            })
          : helper)
      )
    );
  },
  useData: true,
});
