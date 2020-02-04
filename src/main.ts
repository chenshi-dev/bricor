#!/usr/bin/env node
import Bricor from "commander";
import { initHandler, bootstrapHandler } from "./handlers";

// options
Bricor.version("1.0.0");

// commands
Bricor.command("init").action(initHandler);
Bricor.command("bootstrap").action(bootstrapHandler);

// bootstrap! read all args into commander for parse
Bricor.parse(process.argv);
