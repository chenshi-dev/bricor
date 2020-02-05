#!/usr/bin/env node
import Bricor from "commander";
import { initHandler, bootstrapHandler, updateHandler } from "./handlers";

// options
Bricor.version("1.0.0");

// commands
Bricor.command("init").action(initHandler);
Bricor.command("bootstrap").action(bootstrapHandler);
Bricor.command("update <repo> <branch>").action(updateHandler);

// bootstrap! read all args into commander for parse
Bricor.parse(process.argv);
