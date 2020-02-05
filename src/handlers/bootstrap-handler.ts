import { readBricorConfig, logger, BricorConfig } from "../utils";
import { dirname } from "path";
import { extractNameFromRepo, concatPath } from "./init-handler";
import { exec } from "shelljs";

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

    // fetch repo
    exec(`git submodule add ${repo} ${parsedPath}`);
    // link to global
    exec(`cd ${parsedPath} && npm link`);
    exec(`npm link ${parsedName}`);
    // reset submodule  config
    exec(`git submodule --init --remote ${name}`);
  }
}

function parsePath(name: string, path: string) {
  return name.replace(/^project/, dirname(path));
}
