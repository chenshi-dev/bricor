import { readBricorConfig, logger, BricorConfig } from "../utils";
import { dirname } from "path";
import { extractNameFromRepo, concatPath } from "./init-handler";
import { exec } from "shelljs";
import { existsSync } from "fs";

export async function bootstrapHandler() {
  const results = await readBricorConfig();

  if (!results) {
    logger.error(
      `The ".bricor.json" was not found in the project root path, Please run "bricor init" for create config file`
    );

    return;
  }

  const config: BricorConfig = results.config;

  for (const { name, repo, path } of config) {
    const parsedName = name || extractNameFromRepo(repo);

    if (!parsedName) {
      logger.error("Invalid addr of repo.");
      return;
    }

    const parsedPath = parsePath(
      path || concatPath(parsedName),
      results.filepath
    );

    // exec init & update when the submodule is not exist
    if (!existsSync(parsedPath)) {
      exec("git submodule init");
      exec("git submodule update");
    } else {
      // fetch repo
      exec(`git submodule add ${repo} ${parsedPath}`);
    }

    // link to global
    exec(`cd ${parsedPath} && npm link`);
    exec(`npm link ${parsedName}`);
    // reset submodule config
    exec(`git submodule update --init --remote ${name}`);

    logger.info("bootstrap success!");
  }
}

function parsePath(name: string, path: string) {
  return name.replace(/^project/, dirname(path));
}
