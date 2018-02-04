#!/usr/bin/env node

import {Cli, Option} from "command-script";
import * as fs from "fs";
import * as path from "path";

// Load package json
let packageJson: any;
if (fs.existsSync(path.join(__dirname, "../package.json"))) {
  packageJson = require("../package.json");
} else {
  packageJson = require("../../package.json");
}

let cli = new Cli({
  packageJson
});

cli.command(require("./cli/create.cli"));

cli.command("help")
  .description("Show help")
  .order(2000)
  .action(() => {
    cli.showHelp();
  });

cli.run(process.argv.splice(2));
