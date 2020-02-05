#!/usr/bin/env node
import Bricor from "commander";
import { initHandler, bootstrapHandler, updateHandler } from "./handlers";

// options
Bricor.version("1.0.0");

// commands
Bricor.command("init")
  .description("quickly create a config file")
  .action(initHandler);
Bricor.command("bootstrap")
  .description(`pull all the repositories that defined in the ".bricor.json"`)
  .action(bootstrapHandler);
Bricor.command("update <repo> <branch>")
  .description("update submodules from specified branch")
  .action(updateHandler);

// bootstrap! read all args into commander for parse
Bricor.parse(process.argv);
