
import { Command } from "command-script";

export default new Command("create")
      .description("Create a new resource")
      .command(require("./create-project.cli"));