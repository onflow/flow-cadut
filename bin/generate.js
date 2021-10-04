#!/usr/bin/env node

require("esm")(module /*, options*/)("../src/generator/cli").run(process.argv);
