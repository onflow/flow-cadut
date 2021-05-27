var Handlebars = require("handlebars");  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['asset'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "import { replaceImportAddresses } from \"flow-js-testing\";\r\nimport { getEnvironment, reportMissingImports } from 'utils'\r\n\r\nexport const CODE = `\r\n"
    + alias4(((helper = (helper = lookupProperty(helpers,"code") || (depth0 != null ? lookupProperty(depth0,"code") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"code","hash":{},"data":data,"loc":{"start":{"line":5,"column":0},"end":{"line":5,"column":10}}}) : helper)))
    + "\r\n`;\r\n\r\n/**\r\n* Method to generate cadence code for TestAsset\r\n* @param {Object.<string, string>} addressMap - contract name as a key and address where it's deployed as value\r\n* @param {( \"emulator\" | \"testnet\" | \"mainnet\" )} [env] - current working environment, defines default deployed contracts\r\n*/\r\nexport const "
    + alias4(((helper = (helper = lookupProperty(helpers,"assetName") || (depth0 != null ? lookupProperty(depth0,"assetName") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"assetName","hash":{},"data":data,"loc":{"start":{"line":13,"column":13},"end":{"line":13,"column":28}}}) : helper)))
    + "Template = (addressMap = {}, env = \"testnet\") => {\r\n    const envMap = getEnvironment(env);\r\n    const fullMap = {\r\n    ...envMap,\r\n    ...addressMap,\r\n    };\r\n\r\n    // If there are any missing imports in fullMap it will be reported via console\r\n    reportMissingImports(CODE, fullMap, `"
    + alias4(((helper = (helper = lookupProperty(helpers,"name") || (depth0 != null ? lookupProperty(depth0,"name") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data,"loc":{"start":{"line":21,"column":41},"end":{"line":21,"column":51}}}) : helper)))
    + " =>`)\r\n\r\n    return replaceImportAddresses(CODE, fullMap);\r\n};\r\n\r\n// TODO: compare number of arguments\r\n// TODO: pass signers\r\n// TOOD: compare number of signers\r\n// TODO: create specific method to scripts, transactions and contracts\r\n\r\nexport const  "
    + alias4(((helper = (helper = lookupProperty(helpers,"assetName") || (depth0 != null ? lookupProperty(depth0,"assetName") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"assetName","hash":{},"data":data,"loc":{"start":{"line":31,"column":14},"end":{"line":31,"column":29}}}) : helper)))
    + " = (addressMap = {}, env = \"testnet\", args = []) => {\r\n  // TODO: implement sendTransaction or executeScript, based on context\r\n  const code = "
    + alias4(((helper = (helper = lookupProperty(helpers,"assetName") || (depth0 != null ? lookupProperty(depth0,"assetName") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"assetName","hash":{},"data":data,"loc":{"start":{"line":33,"column":15},"end":{"line":33,"column":29}}}) : helper)))
    + "Template(addressMap, env, args)\r\n}\r\n";
},"useData":true});
templates['contract'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    return "";
},"useData":true});
templates['package'] = template({"1":function(container,depth0,helpers,partials,data) {
    var alias1=container.lambda, alias2=container.escapeExpression;

  return "import "
    + alias2(alias1(depth0, depth0))
    + " from './"
    + alias2(alias1(depth0, depth0))
    + "'\n";
},"3":function(container,depth0,helpers,partials,data) {
    var alias1=container.lambda, alias2=container.escapeExpression;

  return "import { "
    + alias2(alias1(depth0, depth0))
    + "Template, "
    + alias2(alias1(depth0, depth0))
    + " } from './"
    + alias2(alias1(depth0, depth0))
    + "'\n";
},"5":function(container,depth0,helpers,partials,data) {
    return "        "
    + container.escapeExpression(container.lambda(depth0, depth0))
    + ",\n";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = lookupProperty(helpers,"each").call(alias1,(depth0 != null ? lookupProperty(depth0,"folders") : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":1,"column":0},"end":{"line":3,"column":9}}})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = lookupProperty(helpers,"each").call(alias1,(depth0 != null ? lookupProperty(depth0,"files") : depth0),{"name":"each","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":5,"column":0},"end":{"line":7,"column":9}}})) != null ? stack1 : "")
    + "\nexport default {\n"
    + ((stack1 = lookupProperty(helpers,"each").call(alias1,(depth0 != null ? lookupProperty(depth0,"folders") : depth0),{"name":"each","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":10,"column":4},"end":{"line":12,"column":13}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"each").call(alias1,(depth0 != null ? lookupProperty(depth0,"files") : depth0),{"name":"each","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":13,"column":4},"end":{"line":15,"column":13}}})) != null ? stack1 : "")
    + "}";
},"useData":true});
templates['script'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "import { executeScript } from '"
    + alias4(((helper = (helper = lookupProperty(helpers,"ixDependency") || (depth0 != null ? lookupProperty(depth0,"ixDependency") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"ixDependency","hash":{},"data":data,"loc":{"start":{"line":1,"column":31},"end":{"line":1,"column":49}}}) : helper)))
    + "'\n\nimport {\n  getEnvironment,\n  replaceImportAddresses,\n  reportMissingImports,\n  reportMissing\n} from 'flow-template-generator'\n\nexport const CODE = `\n"
    + alias4(((helper = (helper = lookupProperty(helpers,"code") || (depth0 != null ? lookupProperty(depth0,"code") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"code","hash":{},"data":data,"loc":{"start":{"line":11,"column":0},"end":{"line":11,"column":10}}}) : helper)))
    + "\n`;\n\n/**\n* Method to generate cadence code for TestAsset\n* @param {Object.<string, string>} addressMap - contract name as a key and address where it's deployed as value\n* @param {( \"emulator\" | \"testnet\" | \"mainnet\" )} [env] - current working environment, defines default deployed contracts\n*/\nexport const "
    + alias4(((helper = (helper = lookupProperty(helpers,"assetName") || (depth0 != null ? lookupProperty(depth0,"assetName") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"assetName","hash":{},"data":data,"loc":{"start":{"line":19,"column":13},"end":{"line":19,"column":28}}}) : helper)))
    + "Template = async (addressMap = {}) => {\n  const envMap = await getEnvironment(env);\n  const fullMap = {\n  ...envMap,\n  ...addressMap,\n  };\n\n  // If there are any missing imports in fullMap it will be reported via console\n  reportMissingImports(CODE, fullMap, `"
    + alias4(((helper = (helper = lookupProperty(helpers,"name") || (depth0 != null ? lookupProperty(depth0,"name") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data,"loc":{"start":{"line":27,"column":39},"end":{"line":27,"column":49}}}) : helper)))
    + " =>`)\n\n  return replaceImportAddresses(CODE, fullMap);\n};\n\nexport const  "
    + alias4(((helper = (helper = lookupProperty(helpers,"assetName") || (depth0 != null ? lookupProperty(depth0,"assetName") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"assetName","hash":{},"data":data,"loc":{"start":{"line":32,"column":14},"end":{"line":32,"column":29}}}) : helper)))
    + " = async ({ addressMap = {}, args = [] }) => {\n  const code = await "
    + alias4(((helper = (helper = lookupProperty(helpers,"assetName") || (depth0 != null ? lookupProperty(depth0,"assetName") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"assetName","hash":{},"data":data,"loc":{"start":{"line":33,"column":21},"end":{"line":33,"column":35}}}) : helper)))
    + "Template(addressMap, args);\n\n  reportMissing(\"arguments\", args.length, "
    + alias4(((helper = (helper = lookupProperty(helpers,"argsAmount") || (depth0 != null ? lookupProperty(depth0,"argsAmount") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"argsAmount","hash":{},"data":data,"loc":{"start":{"line":35,"column":42},"end":{"line":35,"column":58}}}) : helper)))
    + ", "
    + alias4(((helper = (helper = lookupProperty(helpers,"assetName") || (depth0 != null ? lookupProperty(depth0,"assetName") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"assetName","hash":{},"data":data,"loc":{"start":{"line":35,"column":60},"end":{"line":35,"column":73}}}) : helper)))
    + ");\n\n  return executeScript({ code, args})\n}";
},"useData":true});
templates['transaction'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "import { executeScript } from '"
    + alias4(((helper = (helper = lookupProperty(helpers,"ixDependency") || (depth0 != null ? lookupProperty(depth0,"ixDependency") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"ixDependency","hash":{},"data":data,"loc":{"start":{"line":1,"column":31},"end":{"line":1,"column":49}}}) : helper)))
    + "'\n\nimport {\n  getEnvironment,\n  replaceImportAddresses,\n  reportMissingImports,\n  reportMissing\n} from 'flow-template-generator'\n\nexport const CODE = `\n"
    + alias4(((helper = (helper = lookupProperty(helpers,"code") || (depth0 != null ? lookupProperty(depth0,"code") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"code","hash":{},"data":data,"loc":{"start":{"line":11,"column":0},"end":{"line":11,"column":10}}}) : helper)))
    + "\n`;\n\n/**\n* Method to generate cadence code for TestAsset\n* @param {Object.<string, string>} addressMap - contract name as a key and address where it's deployed as value\n* @param {( \"emulator\" | \"testnet\" | \"mainnet\" )} [env] - current working environment, defines default deployed contracts\n*/\nexport const "
    + alias4(((helper = (helper = lookupProperty(helpers,"assetName") || (depth0 != null ? lookupProperty(depth0,"assetName") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"assetName","hash":{},"data":data,"loc":{"start":{"line":19,"column":13},"end":{"line":19,"column":28}}}) : helper)))
    + "Template = async (addressMap = {}) => {\n\n  const envMap = await getEnvironment(env);\n  const fullMap = {\n  ...envMap,\n  ...addressMap,\n  };\n\n  // If there are any missing imports in fullMap it will be reported via console\n  reportMissingImports(CODE, fullMap, `"
    + alias4(((helper = (helper = lookupProperty(helpers,"name") || (depth0 != null ? lookupProperty(depth0,"name") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data,"loc":{"start":{"line":28,"column":39},"end":{"line":28,"column":49}}}) : helper)))
    + " =>`)\n\n  return replaceImportAddresses(CODE, fullMap);\n};\n\nexport const  "
    + alias4(((helper = (helper = lookupProperty(helpers,"assetName") || (depth0 != null ? lookupProperty(depth0,"assetName") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"assetName","hash":{},"data":data,"loc":{"start":{"line":33,"column":14},"end":{"line":33,"column":29}}}) : helper)))
    + " = async ({ addressMap = {}, args = [], signers = [] }) => {\n  const code = await "
    + alias4(((helper = (helper = lookupProperty(helpers,"assetName") || (depth0 != null ? lookupProperty(depth0,"assetName") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"assetName","hash":{},"data":data,"loc":{"start":{"line":34,"column":21},"end":{"line":34,"column":35}}}) : helper)))
    + "Template(addressMap, env, args);\n\n  reportMissing(\"arguments\", args.length, "
    + alias4(((helper = (helper = lookupProperty(helpers,"argsAmount") || (depth0 != null ? lookupProperty(depth0,"argsAmount") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"argsAmount","hash":{},"data":data,"loc":{"start":{"line":36,"column":42},"end":{"line":36,"column":58}}}) : helper)))
    + ", "
    + alias4(((helper = (helper = lookupProperty(helpers,"assetName") || (depth0 != null ? lookupProperty(depth0,"assetName") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"assetName","hash":{},"data":data,"loc":{"start":{"line":36,"column":60},"end":{"line":36,"column":73}}}) : helper)))
    + ");\n  reportMissing(\"signers\", signers.length, "
    + alias4(((helper = (helper = lookupProperty(helpers,"signersAmount") || (depth0 != null ? lookupProperty(depth0,"signersAmount") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"signersAmount","hash":{},"data":data,"loc":{"start":{"line":37,"column":43},"end":{"line":37,"column":62}}}) : helper)))
    + ", "
    + alias4(((helper = (helper = lookupProperty(helpers,"assetName") || (depth0 != null ? lookupProperty(depth0,"assetName") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"assetName","hash":{},"data":data,"loc":{"start":{"line":37,"column":64},"end":{"line":37,"column":77}}}) : helper)))
    + ");\n\n  return sendTransaction({ code, args, signers })\n}";
},"useData":true});
templates['version'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "export const VERSION = "
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"version") || (depth0 != null ? lookupProperty(depth0,"version") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"version","hash":{},"data":data,"loc":{"start":{"line":1,"column":23},"end":{"line":1,"column":34}}}) : helper)));
},"useData":true});
