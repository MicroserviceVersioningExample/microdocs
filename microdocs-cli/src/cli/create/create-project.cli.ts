import { Command } from "command-script";

export default new Command("project <name>")
  .description("Create a new project")
  .arg("project")
  .action(
    (args: { args?: any[], options?: any, flags?: any }, resolve: (result?: any) => void, reject: (err?: any) => void) => {

    });